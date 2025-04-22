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
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # ou ["*"] pour tout autoriser (à éviter en prod)
    allow_credentials=True,
    allow_methods=["*"],  # ou ["GET", "POST", "PUT", "DELETE", ...]
    allow_headers=["*"],  # ou spécifie les headers autorisés
)

@app.get("/models")
def list_models():
    return {
        name: {
            "metrics": model_data["benchmark"],
            "columns": model_data["columns"]
        }
        for name, model_data in models.items()
    }


@app.get("/models/{model_name}")
def get_model(model_name: str):
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
