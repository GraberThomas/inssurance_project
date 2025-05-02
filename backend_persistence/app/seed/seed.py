import os

from sqlmodel import Session, select

from app.database import engine
from app.models import ModelInfo
import asyncio
import requests

async def seed_models_if_needed():
    url = os.path.join(os.getenv("INSSURANCE_BACKEND_URL"), "models")

    for attempt in range(5):
        try:
            response = requests.get(url, timeout=3)
            response.raise_for_status()
            models_data = response.json()
            break
        except Exception as e:
            print(f"[Seed attempt {attempt + 1}] Backend not ready: {e}")
            await asyncio.sleep(2)
    else:
        print("Backend unreachable. Skipping seeding.")
        return

    with Session(engine) as session:
        for model_name, content in models_data.items():
            # Vérifie s'il existe déjà
            exists = session.exec(
                select(ModelInfo).where(ModelInfo.name == model_name)
            ).first()

            if not exists:
                print(f"Inserting model: {model_name}")
                model = ModelInfo(
                    name=model_name,
                    metrics=content.get("metrics"),
                    columns=content.get("columns")
                )
                session.add(model)

        session.commit()
        print("Seeding complete.")
