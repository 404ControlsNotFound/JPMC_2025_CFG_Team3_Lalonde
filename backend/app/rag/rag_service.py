import os
from typing import List, Dict, Any
from langchain_openai import ChatOpenAI
from langchain.prompts import ChatPromptTemplate
from langchain.schema import Document
from .document_processor import DocumentProcessor

class RAGService:
    def __init__(self):
        self.document_processor = DocumentProcessor()
        self.llm = ChatOpenAI(
            api_key=os.getenv("OPENAI_API_KEY"),
            model="gpt-3.5-turbo",
            temperature=0.7
        )

        self.prompt_template = ChatPromptTemplate.from_messages([
            ("system", """You are a helpful assistant that answers questions about personal profiles and demographic data.
            The data you're working with consists of synthetic/fake personal profiles created for demonstration purposes.

            IMPORTANT: All personal data provided is synthetic and not based on real individuals.

            Use the following context to answer the user's question. You can provide statistical insights,
            demographic analysis, and specific profile information. If you cannot find the answer in the context,
            say "I don't have enough information to answer that question based on the available profiles."

            When answering:
            - Be specific about demographic details (age, income, location, job, health conditions)
            - Provide statistical summaries when asked about groups of people
            - Always mention that the data is synthetic/fake
            - Format responses clearly for readability

            Context (Personal Profiles):
            {context}"""),
            ("human", "{question}")
        ])

    def retrieve_documents(self, query: str, k: int = 5) -> List[Document]:
        return self.document_processor.search_documents(query, k)

    def generate_response(self, query: str, documents: List[Document]) -> str:
        context = "\n\n".join([doc.page_content for doc in documents])

        chain = self.prompt_template | self.llm

        response = chain.invoke({
            "context": context,
            "question": query
        })

        return response.content

    def query(self, question: str) -> Dict[str, Any]:
        retrieved_docs = self.retrieve_documents(question)

        response = self.generate_response(question, retrieved_docs)

        return {
            "question": question,
            "answer": response,
            "source_documents": [
                {
                    "content": doc.page_content[:200] + "...",
                    "person_name": doc.metadata.get("person_id", "Unknown").replace("_", " ").title(),
                    "age": doc.metadata.get("age", "N/A"),
                    "job_title": doc.metadata.get("job_title", "N/A"),
                    "location": doc.metadata.get("location", "N/A"),
                    "income_level": doc.metadata.get("income_level", "N/A"),
                    "annual_income": doc.metadata.get("annual_income", "N/A"),
                    "data_type": "Synthetic Personal Profile"
                }
                for doc in retrieved_docs
            ]
        }