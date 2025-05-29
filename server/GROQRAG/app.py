from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import time
from langchain_groq import ChatGroq
from langchain.text_splitters import RecursiveCharacterTextSplitter
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain_core.prompts import ChatPromptTemplate
from langchain.chains import create_retrieval_chain
from langchain_community.vectorstores import FAISS
from langchain_community.document_loaders import PyPDFDirectoryLoader
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from dotenv import load_dotenv

app = Flask(__name__)
CORS(app)

# Load environment variables
load_dotenv()
groq_api_key = os.getenv('GROQ_API_KEY')
google_api_key = os.getenv('GOOGLE_API_KEY')
os.environ['GOOGLE_API_KEY'] = google_api_key

# Load AI Model
llm = ChatGroq(groq_api_key=groq_api_key, model_name="Llama3-8b-8192")

# Prompt Template
prompt = ChatPromptTemplate.from_template(
    """
    You are an AI assistant tasked with answering questions based on the provided context.
    Use the context below to provide a detailed and accurate response to the user's question.
    If the context is insufficient, state that you cannot find the answer in the provided documents.

    <context>
    {context}
    </context>

    Question: {input}

    Answer:
    """
)

# Load and Embed Documents Once
if not hasattr(app, 'vectors'):
    embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")
    loader = PyPDFDirectoryLoader("./data")
    docs = loader.load()
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    final_documents = text_splitter.split_documents(docs)
    app.vectors = FAISS.from_documents(final_documents, embeddings)

@app.route('/ask', methods=['POST'])
def ask_question():
    """Handles Q&A requests."""
    data = request.json
    question = data.get("question")

    if not question:
        return jsonify({"error": "No question provided"}), 400

    try:
        document_chain = create_stuff_documents_chain(llm, prompt)
        retriever = app.vectors.as_retriever()
        retrieval_chain = create_retrieval_chain(retriever, document_chain)

        retrieved_docs = retriever.get_relevant_documents(question)
        context = "\n\n".join([doc.page_content for doc in retrieved_docs])

        start_time = time.process_time()
        response = retrieval_chain.invoke({'input': question, 'context': context})
        process_time = time.process_time() - start_time

        return jsonify({
            "answer": response.get('answer', "I couldn't find an answer in the documents."),
            "context": [doc.page_content for doc in retrieved_docs],
            "response_time": round(process_time, 2)
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':  # Corrected block
    app.run(debug=True, port=5002)