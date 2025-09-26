from fastapi import APIRouter, UploadFile, File, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import tempfile
import os
from pathlib import Path
from ..rag.rag_service import RAGService
from ..rag.document_processor import DocumentProcessor

router = APIRouter(prefix="/rag", tags=["rag"])

class QueryRequest(BaseModel):
    question: str

class QueryResponse(BaseModel):
    question: str
    answer: str
    source_documents: List[Dict[str, Any]]

class FakeDataRequest(BaseModel):
    count: int = 100

class SearchCriteriaRequest(BaseModel):
    job_title: Optional[str] = None
    location: Optional[str] = None
    age_range: Optional[List[int]] = None  # [min_age, max_age]
    industry: Optional[str] = None
    income_level: Optional[str] = None
    health_condition: Optional[str] = None
    limit: int = 10

rag_service = RAGService()
doc_processor = DocumentProcessor()

@router.post("/upload", summary="Upload and process PDF document")
async def upload_document(file: UploadFile = File(...)):
    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are supported")

    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as temp_file:
            content = await file.read()
            temp_file.write(content)
            temp_path = temp_file.name

        result = doc_processor.process_and_store_document(temp_path)

        os.unlink(temp_path)

        return {"message": result, "filename": file.filename}

    except Exception as e:
        if 'temp_path' in locals():
            try:
                os.unlink(temp_path)
            except:
                pass
        raise HTTPException(status_code=500, detail=f"Error processing document: {str(e)}")

@router.post("/query", response_model=QueryResponse, summary="Query documents using RAG")
async def query_documents(request: QueryRequest):
    try:
        result = rag_service.query(request.question)
        return QueryResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing query: {str(e)}")

@router.post("/process-directory", summary="Process all PDFs in project directory")
async def process_project_pdfs():
    try:
        project_root = Path(__file__).parent.parent.parent.parent
        results = doc_processor.process_directory(str(project_root))
        return {"results": results}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing directory: {str(e)}")

@router.post("/populate-fake-data", summary="Generate and store fake personal data")
async def populate_fake_data(request: FakeDataRequest):
    try:
        result = doc_processor.generate_and_store_fake_data(request.count)
        return {"message": result, "count": request.count}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error populating fake data: {str(e)}")

@router.post("/clear-data", summary="Clear all data from vector store")
async def clear_data():
    try:
        result = doc_processor.clear_vector_store()
        return {"message": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error clearing data: {str(e)}")

@router.get("/data-stats", summary="Get statistics about stored data")
async def get_data_stats():
    try:
        stats = doc_processor.get_data_statistics()
        return stats
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting statistics: {str(e)}")

@router.post("/search-by-criteria", summary="Search profiles by specific criteria")
async def search_by_criteria(request: SearchCriteriaRequest):
    try:
        criteria = {
            "job_title": request.job_title,
            "location": request.location,
            "age_range": request.age_range,
            "industry": request.industry,
            "income_level": request.income_level,
            "health_condition": request.health_condition
        }
        # Remove None values
        criteria = {k: v for k, v in criteria.items() if v is not None}

        results = doc_processor.search_profiles_by_criteria(criteria, k=request.limit)

        formatted_results = []
        for doc in results:
            formatted_results.append({
                "name": doc.metadata.get("person_id", "unknown"),
                "age": doc.metadata.get("age"),
                "job_title": doc.metadata.get("job_title"),
                "location": doc.metadata.get("location"),
                "industry": doc.metadata.get("industry"),
                "income_level": doc.metadata.get("income_level"),
                "annual_income": doc.metadata.get("annual_income"),
                "content_preview": doc.page_content[:200] + "..." if len(doc.page_content) > 200 else doc.page_content
            })

        return {
            "criteria": criteria,
            "results_count": len(formatted_results),
            "results": formatted_results
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error searching by criteria: {str(e)}")

@router.get("/health", summary="Health check for RAG service")
async def health_check():
    return {"status": "healthy", "service": "RAG", "data_type": "personal_profiles"}