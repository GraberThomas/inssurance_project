import logging
import os.path
from contextlib import asynccontextmanager

from dotenv import load_dotenv
from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware

from app.api.routes import router
from app.models import SQLModel
from app.database import engine
from app.seed.seed import seed_models_if_needed


@asynccontextmanager
async def lifespan(app: FastAPI):
    await seed_models_if_needed()

    yield  # App continue ici
app = FastAPI(lifespan=lifespan)

@app.exception_handler(Exception)
async def debug_exception_handler(request, exc):
    logging.exception(exc)
    raise exc

origins = [
    "http://localhost",
    "http://localhost:80",
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)
