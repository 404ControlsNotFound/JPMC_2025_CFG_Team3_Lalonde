from sqlmodel import SQLModel
from sqlmodel import Session, create_engine
from typing import Annotated
from fastapi import Depends
from sqlalchemy import text

from app.rag.document_processor import DocumentProcessor
from .config import DATABASE_URL
from .vector_store import get_vector_store


engine = create_engine(DATABASE_URL, echo=True)

def get_session():
    with Session(engine) as session:
        yield session


NUMBER_OF_FAKE_PROFILES = 10


def clear_database():
    """Clear all database tables and vector data"""
    with engine.connect() as connection:
        # Drop all SQLModel tables
        SQLModel.metadata.drop_all(engine)
        
        # Clear vector store collection (PGVector uses langchain_pg_embedding table)
        try:
            connection.execute(text("DROP TABLE IF EXISTS langchain_pg_embedding CASCADE;"))
            connection.execute(text("DROP TABLE IF EXISTS langchain_pg_collection CASCADE;"))
            connection.commit()
        except Exception as e:
            print(f"Warning: Could not drop vector tables: {e}")
            connection.rollback()


def init_db():
    """Initialize database with fresh data"""
    # Clear existing data
    clear_database()
    
    doc_processor = DocumentProcessor()
    with engine.connect() as connection:
        connection.execute(text("CREATE EXTENSION IF NOT EXISTS vector;"))
        connection.commit()

    # Recreate all tables
    SQLModel.metadata.create_all(engine)
    
    # Populate with fake data
    doc_processor.generate_and_store_fake_data(NUMBER_OF_FAKE_PROFILES)
    
    return get_vector_store()


SessionDep = Annotated[Session, Depends(get_session)]
