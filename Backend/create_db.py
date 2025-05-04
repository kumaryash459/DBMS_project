import os
from langchain.document_loaders import DirectoryLoader, PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.embeddings import HuggingFaceBgeEmbeddings
from langchain_community.vectorstores import Chroma
import logging

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

def create_vector_db():
    try:
        if not os.path.exists("./dataset"):
            os.makedirs("./dataset")
            logger.error("Dataset directory created. Please add SQL schema PDF files to ./dataset and rerun.")
            return

        loader = DirectoryLoader("./dataset", glob="*.pdf", loader_cls=PyPDFLoader)
        documents = loader.load()
        if not documents:
            logger.error("No PDF documents found in ./dataset")
            return

        text_splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
        texts = text_splitter.split_documents(documents)

        embeddings = HuggingFaceBgeEmbeddings(model_name='sentence-transformers/all-MiniLM-L6-v2')
        vector_db = Chroma.from_documents(texts, embeddings, persist_directory='./chroma_db')
        vector_db.persist()
        logger.info("ChromaDB created and data saved")
    except Exception as e:
        logger.error(f"Failed to create vector database: {str(e)}")

if __name__ == "__main__":
    create_vector_db()