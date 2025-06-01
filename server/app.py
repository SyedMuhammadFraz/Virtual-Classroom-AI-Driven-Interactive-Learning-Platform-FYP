from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import time
import requests  # Added missing import
import json
import traceback
from langchain_groq import ChatGroq
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import FAISS
from langchain_community.document_loaders import PyPDFDirectoryLoader
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_core.prompts import ChatPromptTemplate
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain.chains import create_retrieval_chain
from dotenv import load_dotenv

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS

# Load environment variables from .env
load_dotenv()
groq_api_key = os.getenv('GROQ_API_KEY')
google_api_key = os.getenv("GOOGLE_API_KEY")

# Ensure API keys are present
if not groq_api_key:
    print("WARNING: GROQ_API_KEY is not set in environment variables")
    
if not google_api_key:
    print("WARNING: GOOGLE_API_KEY is not set in environment variables")
else:
    os.environ["GOOGLE_API_KEY"] = google_api_key

# Initialize the AI Model (Llama3)
try:
    llm = ChatGroq(groq_api_key=groq_api_key, model_name="Llama3-70B-8192")
    print("✅ LLM initialized successfully")
except Exception as e:
    print(f"❌ Failed to initialize LLM: {str(e)}")
    llm = None

# Video API URL
video_api_url = "http://localhost:5003/generate-video"

# Path to store the FAISS index
FAISS_INDEX_PATH = "./faiss_index"

# Define the question-answering prompt template
qa_prompt = ChatPromptTemplate.from_template("""
You are a helpful assistant that answers questions based on provided context.

Context:
{context}

Question: {input}

Please provide a detailed and accurate answer based on the context above.
""")

def load_documents():
    """Loads documents, embeds them, and stores the FAISS index if not already saved."""
    if not hasattr(app, 'vectors'):
        try:
            # Check if the FAISS index already exists
            if os.path.exists(FAISS_INDEX_PATH):
                # Load the FAISS index from disk
                embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")
                app.vectors = FAISS.load_local(FAISS_INDEX_PATH, embeddings, allow_dangerous_deserialization=True)
                print("✅ FAISS index loaded from disk.")
            else:
                # Create the data directory if it doesn't exist
                if not os.path.exists("./data"):
                    os.makedirs("./data")
                    print("✅ Created data directory")
                    
                # Load documents and embeddings
                embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")
                loader = PyPDFDirectoryLoader("./data")  # Adjust path to your data folder
                docs = loader.load()  # Load the documents
                
                if not docs:
                    print("⚠️ No documents found in the data directory.")
                    return False
                    
                # Split the documents into chunks
                text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
                final_documents = text_splitter.split_documents(docs)
                
                # Create the FAISS vector store from the embedded documents
                app.vectors = FAISS.from_documents(final_documents, embeddings)
                
                # Save the FAISS index to disk for future use
                app.vectors.save_local(FAISS_INDEX_PATH)
                print(f"✅ FAISS index saved to {FAISS_INDEX_PATH}")
            
            return True
            
        except Exception as e:
            print(f"❌ Error loading documents: {str(e)}")
            traceback.print_exc()
            return False
    return True

# Try to load documents when the application starts, but don't crash if it fails
with app.app_context():
    try:
        load_documents()
        print("✅ Documents loaded and embedded on startup")
    except Exception as e:
        print(f"⚠️ Failed to load documents on startup: {str(e)}")

@app.route('/embed_documents', methods=['POST'])
def embed_documents():
    """Manually trigger the document embedding process."""
    try:
        # Remove existing index if it exists
        if os.path.exists(FAISS_INDEX_PATH):
            import shutil
            shutil.rmtree(FAISS_INDEX_PATH)
            print(f"✅ Removed existing FAISS index at {FAISS_INDEX_PATH}")
        
        # Reset the vectors attribute if it exists
        if hasattr(app, 'vectors'):
            delattr(app, 'vectors')
        
        if load_documents():
            return jsonify({"message": "Documents re-embedded and FAISS index saved successfully!"}), 200
        else:
            return jsonify({"error": "Failed to embed documents."}), 500
    except Exception as e:
        print(f"❌ Error embedding documents: {str(e)}")
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

@app.route('/ask', methods=['POST'])
def ask_question():
    """Handles Q&A requests."""
    try:
        data = request.json
        if not data:
            return jsonify({"error": "No JSON data provided"}), 400
            
        question = data.get("question")
        if not question:
            return jsonify({"error": "No question provided"}), 400

        # Check if LLM is initialized
        if llm is None:
            return jsonify({"error": "LLM is not initialized. Check API keys and connections."}), 500

        # Ensure documents are loaded
        if not hasattr(app, 'vectors'):
            success = load_documents()
            if not success or not hasattr(app, 'vectors'):
                return jsonify({"error": "Documents not loaded. Please check the data directory."}), 500

        # Create a document chain using the AI model and prompt template
        document_chain = create_stuff_documents_chain(llm, qa_prompt)

        # Create a retriever from the FAISS vector store
        retriever = app.vectors.as_retriever(search_kwargs={"k": 5})

        # Create a retrieval chain
        retrieval_chain = create_retrieval_chain(retriever, document_chain)

        # Retrieve relevant documents based on the question
        retrieved_docs = retriever.get_relevant_documents(question)
        context = "\n\n".join([doc.page_content for doc in retrieved_docs])

        # Start timing the response generation
        start_time = time.process_time()

        # Generate a response based on the retrieved context and question
        response = retrieval_chain.invoke({'input': question})

        process_time = time.process_time() - start_time  # Calculate response time

        # Return the answer, relevant context, and response time
        return jsonify({
            "answer": response.get('answer', "I couldn't find an answer in the documents."),
            "context": [doc.page_content for doc in retrieved_docs],
            "response_time": round(process_time, 2)
        })

    except Exception as e:
        print(f"❌ Error processing question: {str(e)}")
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

@app.route('/generate_lesson', methods=['POST'])
def generate_lesson():
    try:
        # Validate request data
        data = request.json
        if not data:
            return jsonify({"error": "No JSON data provided"}), 400
            
        topic = data.get("topic")
        if not topic:
            return jsonify({"error": "No topic provided"}), 400

        # Check if LLM is initialized
        if llm is None:
            return jsonify({"error": "LLM is not initialized. Check API keys and connections."}), 500

        # Format the prompt with the topic
        formatted_prompt = f"""
You are an AI instructor creating a lesson on: {topic}

Respond with a valid JSON object using this exact structure:

{{
  "topic": "{topic}",
  "introduction": {{
    "definition": ["Definition point 1", "Definition point 2"],
    "background": ["Background point 1", "Background point 2"],
    "relevance": ["Relevance point 1", "Relevance point 2"]
  }},
  "core_concepts": [
    {{
      "title": "Concept 1",
      "explanation": "Explanation 1"
    }},
    {{
      "title": "Concept 2",
      "explanation": "Explanation 2"
    }},
    {{
      "title": "Concept 3",
      "explanation": "Explanation 3"
    }}
  ],
  "examples": [
    {{
      "title": "Example 1",
      "description": "Description 1"
    }},
    {{
      "title": "Example 2",
      "description": "Description 2"
    }}
  ],
  "takeaways": ["Takeaway 1", "Takeaway 2", "Takeaway 3"]
}}

Only return the JSON. Do not include any additional text, explanation, or markdown formatting.
"""
        
        # Start timing
        start_time = time.process_time()
        print(f"Generating lesson for topic: {topic}")

        # Generate the lesson
        response = llm.invoke(formatted_prompt)
        process_time = time.process_time() - start_time
        print(f"Lesson generated in {process_time:.2f} seconds")

        # Extract the JSON content from the response
        response_text = response.content.strip() if hasattr(response, 'content') else str(response)
        
        # Try to parse the JSON
        try:
            # Clean the response to ensure it's valid JSON
            start_idx = response_text.find('{')
            end_idx = response_text.rfind('}') + 1
            
            if start_idx >= 0 and end_idx > start_idx:
                json_text = response_text[start_idx:end_idx]
                
                # Check for common JSON formatting issues
                # Replace single quotes with double quotes if necessary
                if "'" in json_text and '"' not in json_text:
                    json_text = json_text.replace("'", '"')
                
                # Try to load the JSON
                lesson_json = json.loads(json_text)
                
                # Add response time to the JSON
                lesson_json["response_time"] = round(process_time, 2)
                
                # Validate the lesson structure has the expected keys
                required_keys = ["topic", "introduction", "core_concepts", "examples", "takeaways"]
                for key in required_keys:
                    if key not in lesson_json:
                        print(f"⚠️ Generated lesson missing key: {key}")
                        if key == "examples" and "examples_and_applications" in lesson_json:
                            # Handle potential key name mismatch
                            lesson_json["examples"] = lesson_json.pop("examples_and_applications")
                        else:
                            # Initialize with empty default
                            lesson_json[key] = [] if key in ["core_concepts", "examples", "takeaways"] else {}

                # Attempt to send to video service
                try:
                    print("Sending to video generation service...")
                    image_video_response = send_to_image_video_api(lesson_json, video_api_url)
                    
                    # Check if image_video_response is a valid response object with status_code
                    if hasattr(image_video_response, 'status_code'):
                        if image_video_response.status_code == 200:
                            try:
                                response_data = image_video_response.json()
                                image_url = response_data.get("image_url", "")
                                video_url = response_data.get("video_url", "")
                                lesson_json["image_url"] = image_url
                                lesson_json["video_url"] = video_url
                                print("✅ Media generation successful")
                            except Exception as e:
                                print(f"⚠️ Error parsing video service response: {str(e)}")
                                lesson_json["image_url"] = ""
                                lesson_json["video_url"] = ""
                        else:
                            print(f"⚠️ Video service returned status {image_video_response.status_code}")
                            lesson_json["media_error"] = f"Video service returned status {image_video_response.status_code}"
                    else:
                        print("⚠️ Invalid response from video service")
                        lesson_json["media_error"] = "Invalid response from video service"
                        
                except Exception as e:
                    print(f"⚠️ Error communicating with video service: {str(e)}")
                    lesson_json["media_error"] = f"Error communicating with video service: {str(e)}"
                
                # Return the lesson JSON even if video generation failed
                return jsonify(lesson_json)
            else:
                print("❌ Could not extract JSON from the response")
                return jsonify({
                    "error": "Could not extract JSON from the response",
                    "raw_response": response_text
                }), 500
                
        except json.JSONDecodeError as e:
            print(f"❌ Invalid JSON in response: {str(e)}")
            return jsonify({
                "error": f"Invalid JSON in response: {str(e)}",
                "raw_response": response_text
            }), 500

    except Exception as e:
        print(f"❌ Error generating lesson: {str(e)}")
        traceback.print_exc()
        return jsonify({"error": f"Error generating lesson: {str(e)}"}), 500

# Function to send content to Image and Video Generation API
def send_to_image_video_api(lesson_json, image_video_api_url):
    try:
        print(f"Sending lesson content to Image and Video API: {image_video_api_url}")
        
        # Prepare the payload with the necessary lesson information
        payload = {
            "topic": lesson_json.get("topic", ""),
            "introduction": lesson_json.get("introduction", {}),
            "core_concepts": lesson_json.get("core_concepts", []),
            "examples": lesson_json.get("examples", []),
            "takeaways": lesson_json.get("takeaways", [])
        }

        # Configure request with timeout
        timeout_seconds = 60  # Set an appropriate timeout
        
        # Send POST request to the unified Image & Video Generation API
        response = requests.post(
            image_video_api_url, 
            json=payload, 
            timeout=timeout_seconds,
            headers={"Content-Type": "application/json"}
        )

        return response
    except requests.exceptions.ConnectionError:
        print("❌ Connection error: Cannot connect to video service")
        error_response = requests.Response()
        error_response.status_code = 503
        error_response.reason = "Cannot connect to video service"
        return error_response
    except requests.exceptions.Timeout:
        print("❌ Timeout error: Video service request timed out")
        error_response = requests.Response()
        error_response.status_code = 504
        error_response.reason = "Video service request timed out"
        return error_response
    except Exception as e:
        print(f"❌ Error sending to Image and Video API: {str(e)}")
        traceback.print_exc()
        # Return the error as a response object
        error_response = requests.Response()
        error_response.status_code = 500
        error_response.reason = f"Error sending to Image and Video API: {str(e)}"
        return error_response
      
# Health check endpoint
@app.route('/health', methods=['GET'])
def health_check():
    # Check if LLM is initialized
    llm_status = "ok" if llm is not None else "error"
    
    # Check if vectors are loaded
    vectors_status = "ok" if hasattr(app, 'vectors') else "not_loaded"
    
    return jsonify({
        "status": "ok", 
        "message": "Service is running",
        "components": {
            "llm": llm_status,
            "vectors": vectors_status
        }
    }), 200

if __name__ == '__main__':
    # Create necessary directories
    os.makedirs("./data", exist_ok=True)
    os.makedirs(os.path.dirname(FAISS_INDEX_PATH), exist_ok=True)
    
    print(f"🚀 Server running at http://localhost:5002")
    app.run(debug=True, port=5002)