"""
This module handles database connection configuration and session management.

It provides:
- Database engine configuration using environment variables
- Session management utilities for database operations
- Global engine instance accessible throughout the application
"""

from sqlmodel import create_engine, Session
import os

DATABASE_URL = os.getenv("DATABASE_URL")
engine = create_engine(DATABASE_URL, echo=True)

def get_session():
    """
    Creates and yields a database session using the configured engine.
    
    Yields:
        Session: A SQLModel session object for database operations.
    """
    with Session(engine) as session:
        yield session

def get_engine():
    """
    Returns the global database engine instance.
    
    Returns:
        Engine: SQLModel engine configured with DATABASE_URL.
    """
    return engine