
# import streamlit as st
# import os
# import time
# from langchain_groq import ChatGroq
# from langchain.text_splitter import RecursiveCharacterTextSplitter
# from langchain.chains.combine_documents import create_stuff_documents_chain
# from langchain_core.prompts import ChatPromptTemplate
# from langchain.chains import create_retrieval_chain
# from langchain_community.vectorstores import FAISS
# from langchain_community.document_loaders import PyPDFDirectoryLoader
# from langchain_google_genai import GoogleGenerativeAIEmbeddings
# from dotenv import load_dotenv

# # Load environment variables
# load_dotenv()
# groq_api_key = os.getenv('GROQ_API_KEY')
# google_api_key = os.getenv("GOOGLE_API_KEY")
# os.environ["GOOGLE_API_KEY"] = google_api_key

# # Streamlit App Title
# st.set_page_config(page_title="Document Q&A", layout="wide")
# st.title("📚 Document Q&A - AI-Powered Knowledge Retrieval")

# # Load AI Model
# try:
#     llm = ChatGroq(groq_api_key=groq_api_key, model_name="Llama3-8b-8192")
# except Exception as e:
#     st.error(f"❌ Error Loading AI Model: {e}")
#     llm = None

# # Improved Prompt Template
# prompt = ChatPromptTemplate.from_template(
#     """
#     You are an AI assistant tasked with answering questions based on the provided context.
#     Use the context below to provide a detailed and accurate response to the user's question.
#     If the context is insufficient, state that you cannot find the answer in the provided documents.

#     <context>
#     {context}
#     </context>

#     Question: {input}

#     Answer:
#     """
# )

# # Function to Load and Embed Documents
# def vector_embedding():
#     """Loads documents, splits them into chunks, and stores embeddings in FAISS."""
#     if "vectors" not in st.session_state:
#         st.session_state.embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")
#         st.session_state.loader = PyPDFDirectoryLoader("./data")  # Load PDFs

#         with st.spinner("Loading and processing documents... ⏳"):
#             st.session_state.docs = st.session_state.loader.load()  # Extract text
#             text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
#             st.session_state.final_documents = text_splitter.split_documents(st.session_state.docs)  # Splitting

#             st.session_state.vectors = FAISS.from_documents(st.session_state.final_documents, st.session_state.embeddings)  # Store in FAISS
#         st.success("✅ Document embedding complete! Ready to answer questions.")
#     else:
#         st.info("ℹ️ Documents already embedded.")

# # Sidebar Controls
# st.sidebar.header("🔧 Settings")
# if st.sidebar.button("Embed Documents"):
#     vector_embedding()

# # Main Section - Question Input
# question = st.text_input("🎯 Enter Your Question", "")

# # Generate Answer
# if question:
#     if "vectors" not in st.session_state:
#         st.warning("⚠️ Please embed the documents first!")
#     elif llm is None:
#         st.error("❌ AI Model (Llama3) is not loaded. Check your GROQ API Key.")
#     else:
#         try:
#             # Step 1: Create Document Chain
#             document_chain = create_stuff_documents_chain(llm, prompt)

#             # Step 2: Create Retriever
#             retriever = st.session_state.vectors.as_retriever()

#             # Step 3: Create Retrieval Chain
#             retrieval_chain = create_retrieval_chain(retriever, document_chain)

#             # Step 4: Retrieve Relevant Documents
#             retrieved_docs = retriever.get_relevant_documents(question)
#             context = "\n\n".join([doc.page_content for doc in retrieved_docs])  # Combine text

#             # Step 5: Generate Answer
#             start_time = time.process_time()
#             response = retrieval_chain.invoke({'input': question, 'context': context})
#             process_time = time.process_time() - start_time

#             # Step 6: Display Answer and Context
#             st.subheader("🤖 AI-Generated Answer")
#             st.write(response['answer'])

#             st.write(f"⚡ Response Time: {process_time:.2f} seconds")

#             # Show Retrieved Document Chunks
#             with st.expander("📚 Relevant Document Content"):
#                 for i, doc in enumerate(retrieved_docs):
#                     st.write(f"**Chunk {i+1}**")
#                     st.write(doc.page_content)
#                     st.write("--------------------------------")

#         except Exception as e:
#             st.error(f"❌ Error Generating Answer: {e}")





from flask import Flask, request, jsonify
from flask_cors import CORS 
import os
import time
from langchain_groq import ChatGroq
from langchain.text_splitter import RecursiveCharacterTextSplitter
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

if __name__ == '__main__':
    app.run(debug=True, port=5002)
