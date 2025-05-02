from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from model_struct import PredictionResponse
from plan import DEDUCTIBLE_RATE, CEILING_RATE
from plan import build_recommendation
from model_struct import AssuranceProfil
from model_load import load_models

models = load_models()
app = FastAPI()

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


@app.get("/models")
def list_models():
    """
    Lists all models and their respective benchmark metrics and columns.

    This function retrieves all available models defined in the system and collects
    their benchmark metrics along with the associated column specifications. The
    resulting dictionary maps model names to their respective metrics and columns.

    :return: A dictionary where each key is the model name and the value is another
        dictionary containing the model's benchmark metrics and column definitions.
    :rtype: dict
    """
    return {
        name: {
            "metrics": model_data["benchmark"],
            "columns": model_data["columns"]
        }
        for name, model_data in models.items()
    }


@app.get("/models/{model_name}")
def get_model(model_name: str):
    """
    Retrieve information about a specified model by its name.

    This function is designed to fetch details about a specific model, identified
    by its `model_name`. The details include the model's associated benchmark
    metrics and its data columns. If the specified model does not exist, an
    HTTP 404 exception will be raised.

    :param model_name: Name of the model whose details are to be retrieved.
    :type model_name: str
    :return: Dictionary containing the model's name, benchmark metrics, and data
             columns.
    :rtype: dict
    :raises HTTPException: If the specified model name is not found in the available
                            models.
    """
    if model_name not in models:
        raise HTTPException(status_code=404, detail=f"Model '{model_name}' does not exist.")

    model_info = models[model_name]

    return {
        "model_name": model_name,
        "metrics": model_info["benchmark"],
        "columns": model_info["columns"]
    }

@app.post("/models/{model_name}/predict", response_model=PredictionResponse)
def predict(model_name: str, profil: AssuranceProfil):
    """
    Handles prediction requests for specified machine learning models and computes
    associated information like prediction intervals and recommendations.

    Predicts the output based on the data provided within the `profil` (dependent
    on the provided `model_name`) and returns the prediction result, confidence interval,
    and additional recommendations. Raises errors for invalid model names or input data
    processing issues.

    :param model_name: The name of the model to be used for prediction.
    :param profil: An object providing input data for the model, expected to match
                   the required input column schema.
    :return: A dictionary with the prediction results, including:
             - `prediction` (float): The predicted output.
             - `interval` (list[float]): Confidence interval around the prediction,
               calculated using the model's Mean Absolute Error (MAE).
             - `mae` (float): The MAE of the model used for error interval calculations.
             - Additional key-value pairs from generated recommendation.
    :raises HTTPException: When the given model name is not valid, or when the
                           processing of profil data fails due to errors.
    """
    if model_name not in models:
        raise HTTPException(status_code=404, detail="Model not found.")

    model_info = models[model_name]
    model = model_info["model"]
    columns = model_info["columns"]
    benchmark = model_info["benchmark"]

    try:
        df = profil.to_model_input(columns)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    prediction = model.predict(df)[0]
    mae = benchmark.get("MAE", 0)

    recommendation = build_recommendation(prediction, model, df)

    return {
        "prediction": round(prediction, 2),
        "interval": [round(prediction - mae, 2), round(prediction + mae, 2)],
        "mae": round(mae, 2),
        **recommendation
    }

@app.get("/plans")
def list_plans():
    """
    Provides a list of available insurance plans, categorized by their respective
    tiers ("lower", "moderate", and "high"). Each tier contains corresponding
    deductible and ceiling rates, offering detailed information about potential
    insurance coverage options.

    :return: A dictionary where each key represents a plan tier ("lower", "moderate",
        "high") and each value contains the respective "deductible_rate" and
        "ceiling_rate" for that tier.
    :rtype: dict
    """
    return {
        "lower": {
            "deductible_rate": DEDUCTIBLE_RATE["lower"],
            "ceiling_rate": CEILING_RATE["lower"],
        },
        "moderate": {
            "deductible_rate": DEDUCTIBLE_RATE["moderate"],
            "ceiling_rate": CEILING_RATE["moderate"]
        },
        "high": {
            "deductible_rate": DEDUCTIBLE_RATE["high"],
            "ceiling_rate": CEILING_RATE["high"]
        }
    }
