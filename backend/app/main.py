from fastapi import FastAPI, APIRouter
from .db.database import init_db
from contextlib import asynccontextmanager
from .routes import heroes, rag


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    yield
    
app = FastAPI(lifespan=lifespan)

api_router = APIRouter()
api_router.include_router(rag.router)

app.include_router(api_router)

