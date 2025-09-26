import os
from dotenv import load_dotenv
from langchain_community.vectorstores import PGVector
from langchain_openai import OpenAIEmbeddings
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

def get_vector_store():
    embeddings = OpenAIEmbeddings(api_key=OPENAI_API_KEY)

    vector_store = PGVector(
        connection_string=DATABASE_URL,
        embedding_function=embeddings,
        collection_name="documents",
    )

    return vector_store

def init_database():
    engine = create_engine(DATABASE_URL)

    with engine.connect() as connection:
        connection.execute(text("CREATE EXTENSION IF NOT EXISTS vector"))
        connection.commit()

    vector_store = get_vector_store()

    return vector_store

def get_db_session():
    engine = create_engine(DATABASE_URL)
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    return SessionLocal()