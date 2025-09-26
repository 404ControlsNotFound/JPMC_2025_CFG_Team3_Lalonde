from fastapi import FastAPI, APIRouter
from .db.config import init_db
from contextlib import asynccontextmanager
from .routes import heroes


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    yield
    
app = FastAPI(lifespan=lifespan)

api_router = APIRouter()
api_router.include_router(heroes.router)

app.include_router(api_router)

