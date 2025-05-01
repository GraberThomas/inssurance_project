import json

from fastapi import APIRouter, Depends
from sqlmodel import Session
from app.database import get_session
from app.models import ModelInfo, Prediction
from app.schemas import AssuranceProfil, PredictionResponse

router = APIRouter()

@router.post("/models/")
def create_model(name: str, session: Session = Depends(get_session)):
    model = ModelInfo(name=name)
    session.add(model)
    session.commit()
    return model

@router.post("/predictions/")
def create_prediction(
    profil: AssuranceProfil,
    response: PredictionResponse,
    model_id: int,
    session: Session = Depends(get_session)
):
    record = Prediction(
        nom=profil.nom,
        prenom=profil.prenom,
        age=profil.age,
        sex=profil.sex,
        bmi=profil.bmi,
        children=profil.children,
        smoker=profil.smoker,
        region=profil.region,
        prediction=response.prediction,
        interval_min=response.interval[0],
        interval_max=response.interval[1],
        mae=response.mae,
        risk_level=response.risk_level,
        plan_name=response.plan.name,
        franchise=response.plan.franchise,
        ceiling=str(response.plan.ceiling),
        refund_estimate=response.plan.refund_estimate,
        annual_price=response.plan.annual_price,
        monthly_price=response.plan.monthly_price,
        suggestions=json.dumps(response.suggestions),
        top_factors=json.dumps([f.model_dump() for f in response.top_factors]),
        model_id=model_id
    )
    session.add(record)
    session.commit()
    session.refresh(record)
    return {"id": record.id}
