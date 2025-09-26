import os
from pathlib import Path
from typing import List, Dict, Any
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain.schema import Document
from .database import get_vector_store, init_database
from .fake_data_generator import FakeDataGenerator, PersonProfile

class DocumentProcessor:
    def __init__(self):
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200,
            length_function=len,
        )
        self.vector_store = None
        self.data_generator = FakeDataGenerator()

    def load_pdf(self, file_path: str) -> List[Document]:
        loader = PyPDFLoader(file_path)
        documents = loader.load()
        return documents

    def split_documents(self, documents: List[Document]) -> List[Document]:
        return self.text_splitter.split_documents(documents)

    def process_and_store_document(self, file_path: str) -> str:
        try:
            if self.vector_store is None:
                self.vector_store = init_database()

            documents = self.load_pdf(file_path)

            chunks = self.split_documents(documents)

            file_name = Path(file_path).name
            for chunk in chunks:
                chunk.metadata["source_file"] = file_name

            self.vector_store.add_documents(chunks)

            return f"Successfully processed and stored {len(chunks)} chunks from {file_name}"

        except Exception as e:
            return f"Error processing document: {str(e)}"

    def process_directory(self, directory_path: str) -> List[str]:
        results = []
        directory = Path(directory_path)

        for pdf_file in directory.glob("*.pdf"):
            result = self.process_and_store_document(str(pdf_file))
            results.append(result)

        return results

    def search_documents(self, query: str, k: int = 5) -> List[Document]:
        if self.vector_store is None:
            self.vector_store = get_vector_store()

        return self.vector_store.similarity_search(query, k=k)

    def process_personal_data(self, profiles: List[PersonProfile]) -> str:
        """Process and store personal profile data in vector store"""
        try:
            if self.vector_store is None:
                self.vector_store = init_database()

            documents = []
            for profile in profiles:
                doc = Document(
                    page_content=profile.to_document_content(),
                    metadata=profile.to_metadata()
                )
                documents.append(doc)

            self.vector_store.add_documents(documents)

            return f"Successfully processed and stored {len(documents)} personal profiles"

        except Exception as e:
            return f"Error processing personal data: {str(e)}"

    def generate_and_store_fake_data(self, count: int = 100) -> str:
        """Generate fake personal profiles and store them in vector store"""
        try:
            profiles = self.data_generator.generate_profiles(count)
            return self.process_personal_data(profiles)
        except Exception as e:
            return f"Error generating fake data: {str(e)}"

    def clear_vector_store(self) -> str:
        """Clear all data from the vector store"""
        try:
            if self.vector_store is None:
                self.vector_store = get_vector_store()

            # Note: This is a simplified approach. In production, you'd want more sophisticated clearing
            # For now, we'll reinitialize the vector store
            self.vector_store = init_database()
            return "Vector store cleared successfully"
        except Exception as e:
            return f"Error clearing vector store: {str(e)}"

    def get_data_statistics(self) -> Dict[str, Any]:
        """Get statistics about the data stored in the vector store"""
        try:
            if self.vector_store is None:
                self.vector_store = get_vector_store()

            # Perform a broad search to get sample data
            sample_docs = self.vector_store.similarity_search("person profile", k=100)

            stats = {
                "total_profiles": len(sample_docs),
                "data_types": {},
                "sample_metadata": []
            }

            for doc in sample_docs:
                data_type = doc.metadata.get("data_type", "unknown")
                stats["data_types"][data_type] = stats["data_types"].get(data_type, 0) + 1

                if len(stats["sample_metadata"]) < 5:  # Keep only first 5 for brevity
                    stats["sample_metadata"].append({
                        "name": doc.metadata.get("person_id", "unknown"),
                        "age": doc.metadata.get("age", "unknown"),
                        "job_title": doc.metadata.get("job_title", "unknown"),
                        "location": doc.metadata.get("location", "unknown")
                    })

            return stats

        except Exception as e:
            return {"error": f"Error getting statistics: {str(e)}"}

    def search_profiles_by_criteria(self, criteria: Dict[str, Any], k: int = 10) -> List[Document]:
        """Search profiles based on specific criteria"""
        if self.vector_store is None:
            self.vector_store = get_vector_store()

        # Build search query based on criteria
        query_parts = []
        if criteria.get("job_title"):
            query_parts.append(f"job title {criteria['job_title']}")
        if criteria.get("location"):
            query_parts.append(f"location {criteria['location']}")
        if criteria.get("age_range"):
            age_min, age_max = criteria["age_range"]
            query_parts.append(f"age between {age_min} and {age_max}")
        if criteria.get("industry"):
            query_parts.append(f"industry {criteria['industry']}")
        if criteria.get("income_level"):
            query_parts.append(f"income level {criteria['income_level']}")
        if criteria.get("health_condition"):
            query_parts.append(f"health condition {criteria['health_condition']}")

        search_query = " ".join(query_parts) if query_parts else "personal profile"

        return self.vector_store.similarity_search(search_query, k=k)