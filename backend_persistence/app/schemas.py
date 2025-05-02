"""
This module defines the Pydantic models for API input/output validation and serialization.

Models:
- AssuranceProfil: Input schema for user insurance profile data
- TopFactor: Schema for important factors affecting insurance prediction
- Plan: Schema for insurance plan details and pricing
- PredictionResponse: Complete response schema with prediction results and recommendations
"""

from pydantic import BaseModel, Field
from typing import Optional, List, Union, Literal, Annotated

class AssuranceProfil(BaseModel):
    nom: Optional[str] = None
    prenom: Optional[str] = None
    age: Annotated[int, Field(ge=0, le=120)]
    sex: Literal["male", "female"]
    bmi: Annotated[float, Field(gt=0)]
    children: Annotated[int, Field(ge=0)]
    smoker: bool
    region: str

class TopFactor(BaseModel):
    feature: str
    shap_value: float
    value: Union[int, float, str]

class Plan(BaseModel):
    name: Literal["Lower", "Moderate", "High"]
    franchise: float
    ceiling: Union[float, Literal["Infinite"]]
    refund_estimate: float
    annual_price: float
    monthly_price: float

class PredictionResponse(BaseModel):
    prediction: float
    interval: List[float]
    mae: float
    risk_level: Literal["lower", "moderate", "high"]
    plan: Plan
    top_factors: List[TopFactor]
    suggestions: List[str]
