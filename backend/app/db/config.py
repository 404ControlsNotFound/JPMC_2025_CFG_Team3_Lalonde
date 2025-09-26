from sqlmodel import SQLModel
from sqlmodel import Session, create_engine
from dotenv import load_dotenv
import os
from typing import Annotated
from fastapi import Depends

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
assert DATABASE_URL is not None


engine = create_engine(DATABASE_URL, echo=True)

def get_session():
    with Session(engine) as session:
        yield session


SessionDep = Annotated[Session, Depends(get_session)]


def init_db():
    SQLModel.metadata.create_all(engine)
    