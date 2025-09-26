from langchain_openai import OpenAIEmbeddings
from langchain_postgres import PGVector
from .config import DATABASE_URL, OPENAI_API_KEY

def get_vector_store():
    embeddings = OpenAIEmbeddings(api_key=OPENAI_API_KEY)

    vector_store = PGVector(
        connection=DATABASE_URL,
        embeddings=embeddings,
        collection_name="documents",
    )

    return vector_store