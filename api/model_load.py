import os
import joblib
import json

MODELS_DIR = "models"

def load_models():
    models = {}

    for filename in os.listdir(MODELS_DIR):
        if filename.endswith(".pkl"):
            model_name = filename.replace(".pkl", "")

            model_path = os.path.join(MODELS_DIR, f"{model_name}.pkl")
            columns_path = os.path.join(MODELS_DIR, f"{model_name}_columns.json")
            benchmark_path = os.path.join(MODELS_DIR, f"{model_name}_benchmark.json")

            model = joblib.load(model_path)

            with open(columns_path, "r") as f:
                columns = json.load(f)

            with open(benchmark_path, "r") as f:
                benchmark = json.load(f)

            models[model_name] = {
                "model": model,
                "columns": columns,
                "benchmark": benchmark
            }

    return models