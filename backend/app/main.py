from fastapi import FastAPI, APIRouter
from .db.database import init_db
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from .routes import heroes, rag

@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    yield

app = FastAPI(lifespan=lifespan)

origins = [
    "http://localhost:3000",
]

api_router = APIRouter()
api_router.include_router(rag.router)

app.include_router(api_router)
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
