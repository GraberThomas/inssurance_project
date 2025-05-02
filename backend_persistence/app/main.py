"""
Main FastAPI application module that configures and launches the insurance prediction API.

This module:
- Sets up the FastAPI application with CORS middleware
- Configures exception handling and logging
- Initializes database models on startup via lifespan context
- Includes API routes from the router module
"""

import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware

from app.api.routes import router
from app.seed.seed import seed_models_if_needed


@asynccontextmanager
async def lifespan(app: FastAPI):
    await seed_models_if_needed()

    yield
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
