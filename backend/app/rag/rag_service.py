import os
from typing import List, Dict, Any, Optional
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
            ("system", """You are a helpful assistant that specializes in resource allocation and demographic analysis using personal profile data.
            The data you're working with consists of synthetic/fake personal profiles created for demonstration purposes.

            IMPORTANT: All personal data provided is synthetic and not based on real individuals.

            You can handle two main types of requests:

            1. RESOURCE ALLOCATION: When given specific resource allocation criteria, analyze the profiles to:
               - Identify eligible individuals based on criteria
               - Apply priority weights to rank candidates
               - Recommend top candidates with detailed reasoning
               - Consider factors like recent recipients, need level, demographics

            2. NATURAL LANGUAGE QUERIES: Answer follow-up questions or general inquiries about:
               - The profiles and demographic data
               - Statistical insights and analysis
               - Specific profile information
               - Clarifications about previous recommendations

            Use the following context to answer the user's question. If you cannot find the answer in the context,
            say "I don't have enough information to answer that question based on the available profiles."

            When answering:
            - Be specific about demographic details (age, income, location, job, health conditions)
            - For resource allocation, provide clear recommendations with reasoning
            - For general queries, provide statistical summaries and insights
            - Always mention that the data is synthetic/fake
            - Format responses clearly for readability
            - Maintain context from previous resource allocation discussions when relevant

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

    def create_resource_allocation_prompt(
        self,
        resource_name: str,
        available_quantity: int,
        resource_description: str,
        eligibility_criteria: str,
        priority_weights: Dict[str, float],
        additional_filters: Optional[Dict[str, Any]] = None
    ) -> str:
        """
        Create a custom prompt for resource allocation based on frontend inputs.
        This prompt will be used with the unified prompt_template.

        Args:
            resource_name: Name of the resource to allocate
            available_quantity: Number of units available
            resource_description: Description of what the resource is
            eligibility_criteria: Who is eligible for this resource
            priority_weights: Dict with weights for different factors (e.g., {"recent_recipients": 0.3, "need_level": 0.7})
            additional_filters: Optional additional filtering criteria

        Returns:
            str: A formatted prompt for resource allocation
        """
        filters_text = ""
        if additional_filters:
            filters_list = [f"- {key}: {value}" for key, value in additional_filters.items()]
            filters_text = f"\n\nAdditional filtering criteria:\n" + "\n".join(filters_list)

        priority_text = ""
        if priority_weights:
            priority_list = []
            for factor, weight in priority_weights.items():
                priority_list.append(f"- {factor.replace('_', ' ').title()}: {weight * 100:.0f}% weight")
            priority_text = f"\n\nPriority weights for allocation decisions:\n" + "\n".join(priority_list)

        prompt = f"""RESOURCE ALLOCATION REQUEST:

Resource Details:
- Resource Name: {resource_name}
- Available Quantity: {available_quantity} units
- Description: {resource_description}

Eligibility Criteria:
{eligibility_criteria}
{priority_text}
{filters_text}

Please analyze the available profiles and:
1. Identify all individuals who meet the eligibility criteria
2. Apply the priority weights to rank eligible candidates
3. Recommend the top {available_quantity} individuals who should receive this resource
4. Provide reasoning for each recommendation, considering the specified priority weights
5. Include relevant demographic details for each recommended individual

Ensure recommendations are fair, transparent, and align with the specified criteria and weights."""

        return prompt

    def query_resource_allocation(
        self,
        resource_name: str,
        available_quantity: int,
        resource_description: str,
        eligibility_criteria: str,
        priority_weights: Dict[str, float],
        additional_filters: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        Convenience method that creates a custom prompt and queries for resource allocation.
        Uses the unified prompt_template for consistent handling.

        Returns the same format as the regular query method.
        """
        custom_prompt = self.create_resource_allocation_prompt(
            resource_name=resource_name,
            available_quantity=available_quantity,
            resource_description=resource_description,
            eligibility_criteria=eligibility_criteria,
            priority_weights=priority_weights,
            additional_filters=additional_filters
        )

        return self.query(custom_prompt)