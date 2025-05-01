import os.path

from dotenv import load_dotenv
from fastapi import FastAPI
from app.api.routes import router
from app.models import SQLModel
from app.database import engine

app = FastAPI()

app.include_router(router)
