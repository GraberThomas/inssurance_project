"""
This module generates fake insurance prediction data for testing and development.

It provides functionality to:
- Connect to the backend API and wait for its availability
- Create or retrieve ML model information
- Generate random user profiles with Faker
- Make API prediction calls with fake profiles
- Store prediction results in the database
"""

import os
import random
import json
import time
from datetime import datetime, timedelta

import requests
from faker import Faker
from sqlmodel import Session, select

from app.database import get_engine
from app.models import ModelInfo, Prediction

BACKEND_URL = os.getenv("INSSURANCE_BACKEND_URL", "http://inssurance_backend:8000")
N = 1000
faker = Faker()


def wait_for_backend(timeout: int = 60, interval: int = 2):
    deadline = time.time() + timeout
    health_url = f"{BACKEND_URL}/models"
    while time.time() < deadline:
        try:
            r = requests.get(health_url, timeout=1)
            if r.status_code == 200:
                print("✅ Backend ready")
                return
        except Exception:
            pass
        print("⏳ Waiting for backend…")
        time.sleep(interval)
    raise RuntimeError(f"Backend not ready after {timeout}s")

def main():
    """
    Seeds the database with prediction records by fetching model information
    from a backend service, generating fake user data, and interacting with
    an external API to obtain prediction results. The function commits the
    seeded data into the database using a provided session.

    :return: None
    """
    wait_for_backend()

    engine = get_engine()
    session = Session(engine)

    models = session.exec(select(ModelInfo)).all()
    if not models:
        resp = requests.get(f"{BACKEND_URL}/models")
        resp.raise_for_status()
        api_models = resp.json()
        if isinstance(api_models, dict):
            names = list(api_models.keys())
        elif isinstance(api_models, list) and api_models and isinstance(api_models[0], dict):
            names = [m["name"] for m in api_models]
        else:
            names = list(api_models)
        for name in names:
            session.add(ModelInfo(name=name))
        session.commit()
        models = session.exec(select(ModelInfo)).all()

    for _ in range(N):
        model = random.choice(models)
        profil = {
            "nom": faker.first_name(),
            "prenom": faker.last_name(),
            "age": random.randint(18, 80),
            "sex": random.choice(["male", "female"]),
            "bmi": round(random.uniform(15, 40), 1),
            "children": random.randint(0, 5),
            "smoker": random.choice([True, False]),
            "region": random.choice(["northeast", "southeast", "southwest"])
        }
        data = requests.post(
            f"{BACKEND_URL}/models/{model.name}/predict",
            json=profil
        ).json()

        record = Prediction(
            nom=profil["nom"],
            prenom=profil["prenom"],
            age=profil["age"],
            sex=profil["sex"],
            bmi=profil["bmi"],
            children=profil["children"],
            smoker=profil["smoker"],
            region=profil["region"],
            prediction=data["prediction"],
            interval_min=data["interval"][0],
            interval_max=data["interval"][1],
            mae=data["mae"],
            risk_level=data["risk_level"],
            plan_name=data["plan"]["name"],
            franchise=data["plan"]["franchise"],
            ceiling=str(data["plan"]["ceiling"]),
            refund_estimate=data["plan"]["refund_estimate"],
            annual_price=data["plan"]["annual_price"],
            monthly_price=data["plan"]["monthly_price"],
            suggestions=json.dumps(data.get("suggestions", [])),
            top_factors=json.dumps(data.get("top_factors", [])),
            model_id=model.id,
            created_at=datetime.now() - timedelta(days=random.randint(0, 365))
        )
        session.add(record)

    session.commit()
    print(f"Seeded {N} real predictions via API.")

if __name__ == "__main__":
    main()
