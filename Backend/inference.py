import os
import logging
from langchain_groq import ChatGroq
from langchain.document_loaders import DirectoryLoader, PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.embeddings import HuggingFaceBgeEmbeddings
from langchain_community.vectorstores import Chroma
from langchain.prompts import PromptTemplate
from langchain.chains import RetrievalQA

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

def initialize_llm():
    try:
        llm = ChatGroq(
            temperature=0,
            groq_api_key="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",
            model_name="llama-3.3-70b-versatile"
        )
        logger.info("LLM initialized successfully")
        return llm
    except Exception as e:
        logger.error(f"Failed to initialize LLM: {str(e)}")
        raise

def create_vector_db():
    try:
        if not os.path.exists("./dataset"):
            os.makedirs("./dataset")
            logger.error("Dataset directory created. Please add SQL schema PDF files to ./dataset and rerun.")
            raise FileNotFoundError("Dataset directory is empty. Please add PDF files.")

        loader = DirectoryLoader("./dataset", glob="*.pdf", loader_cls=PyPDFLoader)
        documents = loader.load()
        if not documents:
            logger.error("No PDF documents found in ./dataset")
            raise FileNotFoundError("No PDF documents found in ./dataset")

        text_splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
        texts = text_splitter.split_documents(documents)

        embeddings = HuggingFaceBgeEmbeddings(model_name='sentence-transformers/all-MiniLM-L6-v2')
        vector_db = Chroma.from_documents(texts, embeddings, persist_directory='./chroma_db')
        vector_db.persist()
        logger.info("ChromaDB created and data saved")
        return vector_db
    except Exception as e:
        logger.error(f"Failed to create vector database: {str(e)}")
        raise

def load_vector_db():
    db_path = "./chroma_db"
    try:
        if not os.path.exists(db_path):
            logger.warning("Vector database not found. Attempting to create it.")
            return create_vector_db()
        
        embeddings = HuggingFaceBgeEmbeddings(model_name='sentence-transformers/all-MiniLM-L6-v2')
        vector_db = Chroma(persist_directory=db_path, embedding_function=embeddings)
        logger.info("Vector database loaded successfully")
        return vector_db
    except Exception as e:
        logger.error(f"Failed to load vector database: {str(e)}")
        raise

def setup_qa_chain(vector_db, llm):
    try:
        retriever = vector_db.as_retriever()

        prompt_template = """You are an expert SQL query generator. Based on the following database schema and examples, convert the natural language question into a valid SQL query. Return only the SQL query itself, without any explanation, markdown, or additional text.

Database Schema and Examples:
{context}

User Question: {question}

SQL Query: """

        PROMPT = PromptTemplate(template=prompt_template, input_variables=['context', 'question'])

        qa_chain = RetrievalQA.from_chain_type(
            llm=llm,
            chain_type="stuff",
            retriever=retriever,
            chain_type_kwargs={"prompt": PROMPT}
        )
        logger.info("QA chain set up successfully")
        return qa_chain
    except Exception as e:
        logger.error(f"Failed to set up QA chain: {str(e)}")
        raise

def generate_sql_query(query):
    try:
        if not query or not isinstance(query, str):
            logger.error("Invalid query provided")
            raise ValueError("Query must be a non-empty string")
        
        llm = initialize_llm()
        vector_db = load_vector_db()
        qa_chain = setup_qa_chain(vector_db, llm)
        sql_query = qa_chain.run(query)
        logger.info(f"Generated SQL query for: {query}")
        return sql_query.strip()
    except Exception as e:
        logger.error(f"Failed to generate SQL query: {str(e)}")
        raise

def main():
    print("Text-to-SQL Converter (Standalone Mode)")
    print("Type 'exit' to quit")
    
    while True:
        query = input("\nEnter your question: ")
        if query.lower() in ["exit", "quit", "bye"]:
            print("Exiting Text-to-SQL Converter")
            break
        
        try:
            sql_query = generate_sql_query(query)
            print(f"\nSQL Query:\n{sql_query}")
        except Exception as e:
            print(f"Error: {str(e)}")

if __name__ == "__main__":
    main()