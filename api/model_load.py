import os
import joblib
import json

MODELS_DIR = "models"

def load_models():
    """
    Loads machine learning models and their associated metadata from a directory.

    This function scans a directory for files related to serialized machine learning
    models and their configurations. For each model, it expects the following related
    files to exist in the directory:

    - A `.pkl` file containing the serialized model.
    - A `_columns.json` file specifying the columns or features used by the model.
    - A `_benchmark.json` file defining the benchmark metadata.

    It loads these files, reconstructs the model objects, and organizes them along
    with their related metadata into a dictionary. This dictionary is returned to
    enable easy access for further operations.

    :raises FileNotFoundError: If the expected files for the model are missing.
    :raises JSONDecodeError: If there is an issue parsing the JSON metadata files.
    :raises Exception: For other errors encountered during file loading.
    :return: A dictionary of models, each containing the model, its columns,
        and benchmark metadata organized under keys ``model``, ``columns``,
        and ``benchmark`` respectively.
    :rtype: dict
    """
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