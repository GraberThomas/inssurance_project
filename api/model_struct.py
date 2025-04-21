from typing import Annotated, Union, Literal, List

import pandas as pd
from pydantic import BaseModel, conint, confloat, validator, Field
from enum import Enum

class Sex(str, Enum):
    male = "male"
    female = "female"

class Region(str, Enum):
    northeast = "northeast"
    southeast = "southeast"
    southwest = "southwest"

class AssuranceProfil(BaseModel):
    age: Annotated[int, Field(ge=0, le=120)]
    sex: Sex
    bmi: Annotated[float, Field(gt=0)]
    children: Annotated[int, Field(ge=0)]
    smoker: bool
    region: Region

    def to_model_input(self, expected_columns: list[str]):
        data = {
            "age": self.age,
            "bmi": self.bmi,
            "children": self.children,

            "sex_male": 1 if self.sex == "male" else 0,
            "smoker_yes": 1 if self.smoker else 0,

            "region_northwest": 1 if self.region == "northwest" else 0,
            "region_southeast": 1 if self.region == "southeast" else 0,
            "region_southwest": 1 if self.region == "southwest" else 0,
        }

        # Vérification stricte des colonnes
        if sorted(data.keys()) != sorted(expected_columns):
            raise ValueError(f"Incorrectly constructed columns.\nMissing: {set(expected_columns) - set(data.keys())}")

        # Transformation en DataFrame ligne unique
        df = pd.DataFrame([data])
        return df[expected_columns].astype(float)



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
