import os.path
from contextlib import asynccontextmanager

from dotenv import load_dotenv
from fastapi import FastAPI
from app.api.routes import router
from app.models import SQLModel
from app.database import engine
from app.seed import seed_models_if_needed


@asynccontextmanager
async def lifespan(app: FastAPI):
    await seed_models_if_needed()

    yield  # App continue ici
app = FastAPI(lifespan=lifespan)

app.include_router(router)
