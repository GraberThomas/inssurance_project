"""
This module defines SQLModel classes for database modeling in the insurance prediction system.

Classes:
    ModelInfo: Represents an ML model's metadata and its relationship to predictions
    Prediction: Stores prediction results, user data, and insurance plan recommendations
"""

from typing import Optional, List
from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime

class ModelInfo(SQLModel, table=True):
    """Stores metadata about ML models used for predictions."""
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(unique=True)
    predictions: List["Prediction"] = Relationship(back_populates="model")

class Prediction(SQLModel, table=True):
    """Stores individual prediction results including user data, predictions, and recommendations."""
    id: Optional[int] = Field(default=None, primary_key=True)

    nom: Optional[str] = None
    prenom: Optional[str] = None
    age: int
    sex: str  # Corrigé
    bmi: float
    children: int
    smoker: bool
    region: str

    prediction: float
    interval_min: float
    interval_max: float
    mae: float
    risk_level: str

    plan_name: str
    franchise: float
    ceiling: str
    refund_estimate: float
    annual_price: float
    monthly_price: float

    suggestions: str
    top_factors: str

    created_at: datetime = Field(default_factory=datetime.utcnow)

    model_id: int = Field(foreign_key="modelinfo.id")
    model: Optional[ModelInfo] = Relationship(back_populates="predictions")
