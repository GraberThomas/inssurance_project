from typing import Annotated, Union, Literal, List

import pandas as pd
from pydantic import BaseModel, conint, confloat, validator, Field
from enum import Enum

class Sex(str, Enum):
    """
    Enumeration representing biological sexes.

    This class provides enumerated values for representing biological sexes
    such as male and female. It inherits from both str and Enum to enable
    string-like behavior while also being a part of an enumerated type.
    This is useful for maintaining strict value constraints in applications
    working with user data or systems requiring gender specification.

    :cvar male: Represents the male sex.
    :type male: str
    :cvar female: Represents the female sex.
    :type female: str
    """
    male = "male"
    female = "female"

class Region(str, Enum):
    """
    Represents an enumeration for different regions.

    This class is a specific enumeration for defining and categorizing
    geographical regions. Each region is represented as a string and
    can be used throughout the application to ensure consistency. The
    regions defined here are pre-determined and immutable.

    :ivar northeast: Represents the northeastern region.
    :type northeast: str
    :ivar southeast: Represents the southeastern region.
    :type southeast: str
    :ivar southwest: Represents the southwestern region.
    :type southwest: str
    """
    northeast = "northeast"
    southeast = "southeast"
    southwest = "southwest"

class AssuranceProfil(BaseModel):
    """
    Represents an insurance profile with personal details and related attributes.

    This class is designed to model and manage insurance-related data for an individual.
    It includes attributes such as age, sex, body mass index (BMI), number of children,
    smoking status, and region of residence. It also provides functionality to transform
    the data into a format suitable for predictive modeling or analysis.

    :ivar age: Age of the individual. Must be between 0 and 120.
    :type age: int
    :ivar sex: Sex of the individual. Expected to be of type `Sex`.
    :type sex: Sex
    :ivar bmi: Body Mass Index (BMI) of the individual. Must be a positive number.
    :type bmi: float
    :ivar children: Number of children dependent on the individual. Must be a non-negative integer.
    :type children: int
    :ivar smoker: Smoking status of the individual. True if the individual smokes, otherwise False.
    :type smoker: bool
    :ivar region: Region of residence of the individual. Expected to be of type `Region`.
    :type region: Region
    """
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
    """
    Represents the top factor influencing a model's output or decision-making process.

    This class is used to encapsulate details about a specific factor, including
    its associated feature name, SHAP value, and its value. It is commonly used in
    explanatory or interpretive machine learning tasks where understanding feature
    contributions is essential.

    :ivar feature: The name of the feature associated with this factor.
    :type feature: str
    :ivar shap_value: The SHAP value quantifying the contribution of the feature.
    :type shap_value: float
    :ivar value: The actual value of the feature, which can be an integer,
        float, or string, depending on the data.
    :type value: Union[int, float, str]
    """
    feature: str
    shap_value: float
    value: Union[int, float, str]


class Plan(BaseModel):
    """
    Represents an insurance plan with specific parameters.

    The `Plan` class is used to store details about an insurance plan, including
    its name, financial parameters such as franchise, ceiling, refund estimate,
    and pricing in both annual and monthly formats. It provides a structured
    representation to manage and interact with plan data effectively.

    :ivar name: The name of the plan, indicating its level.
    :type name: Literal["Lower", "Moderate", "High"]
    :ivar franchise: The franchise amount associated with the plan.
    :type franchise: float
    :ivar ceiling: The maximum coverage ceiling of the plan. Can be a numeric value
        or "Infinite".
    :type ceiling: Union[float, Literal["Infinite"]]
    :ivar refund_estimate: The estimated refund amount under the plan.
    :type refund_estimate: float
    :ivar annual_price: The annual subscription price for the plan.
    :type annual_price: float
    :ivar monthly_price: The monthly subscription price for the plan.
    :type monthly_price: float
    """
    name: Literal["Lower", "Moderate", "High"]
    franchise: float
    ceiling: Union[float, Literal["Infinite"]]
    refund_estimate: float
    annual_price: float
    monthly_price: float


class PredictionResponse(BaseModel):
    """
    Represents the response for a prediction model.

    The `PredictionResponse` class models the output of a predictive system. It encapsulates
    a prediction along with supplementary information such as confidence intervals, mean
    absolute error (MAE), and associated metadata. The class also includes risk level
    assessment, a mitigation or action plan, influencing factors, and suggestions for
    improvement or evaluation. This structure is designed for facilitating insight into predictions
    and decision-making processes.

    :ivar prediction: The predicted value or outcome generated by the model.
    :type prediction: float
    :ivar interval: The confidence interval for the prediction, represented as a list of
        two float values [lower bound, upper bound].
    :type interval: List[float]
    :ivar mae: The mean absolute error (MAE) of the prediction.
    :type mae: float
    :ivar risk_level: The determined risk level associated with the prediction; can either be
        "lower", "moderate", or "high".
    :type risk_level: Literal["lower", "moderate", "high"]
    :ivar plan: The proposed action plan related to the prediction.
    :type plan: Plan
    :ivar top_factors: A list of key factors or contributors influencing the prediction.
    :type top_factors: List[TopFactor]
    :ivar suggestions: Recommendations or suggestions derived from the prediction or analysis.
    :type suggestions: List[str]
    """
    prediction: float
    interval: List[float]
    mae: float
    risk_level: Literal["lower", "moderate", "high"]
    plan: Plan
    top_factors: List[TopFactor]
    suggestions: List[str]
