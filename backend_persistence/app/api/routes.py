import json
import math
from typing import Optional, Dict, Any

from fastapi import APIRouter, Depends, HTTPException, Body, Query
from sqlalchemy import func
from sqlmodel import Session, select
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

@router.get("/models/")
def list_models(session: Session = Depends(get_session)):
    return session.exec(select(ModelInfo)).all()

@router.post("/predictions/")
def create_prediction(
    profil: AssuranceProfil = Body(...),
    response: PredictionResponse = Body(...),
    model_name: str = Body(...),
    session: Session = Depends(get_session)
):
    model = session.exec(
        select(ModelInfo).where(ModelInfo.name == model_name)
    ).first()

    if not model:
        raise HTTPException(status_code=404, detail=f"Model '{model_name}' not found")

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
        model_id=model.id
    )
    session.add(record)
    session.commit()
    session.refresh(record)
    return {"id": record.id}

@router.get("/predictions/")
def list_predictions(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1),
    model_name: Optional[str] = Query(None),
    sex: Optional[str] = Query(None, regex="^(male|female)$"),
    smoker: Optional[bool] = Query(None),
    region: Optional[str] = Query(None),
    age_min: Optional[int] = Query(None, ge=0),
    age_max: Optional[int] = Query(None, ge=0),
    children_min: Optional[int] = Query(None, ge=0),
    children_max: Optional[int] = Query(None, ge=0),
    session: Session = Depends(get_session)
) -> Dict[str, Any]:
    # 1) Base select avec jointure
    stmt = select(Prediction, ModelInfo.name.label("model_name")) \
        .join(ModelInfo, Prediction.model_id == ModelInfo.id)

    # 2) Filtre par nom de modèle
    if model_name:
        stmt = stmt.where(ModelInfo.name == model_name)

    # 3) Autres filtres
    if sex:
        stmt = stmt.where(Prediction.sex == sex)
    if smoker is not None:
        stmt = stmt.where(Prediction.smoker == smoker)
    if region:
        stmt = stmt.where(Prediction.region == region)
    if age_min is not None:
        stmt = stmt.where(Prediction.age >= age_min)
    if age_max is not None:
        stmt = stmt.where(Prediction.age <= age_max)
    if children_min is not None:
        stmt = stmt.where(Prediction.children >= children_min)
    if children_max is not None:
        stmt = stmt.where(Prediction.children <= children_max)

    # 4) Comptage total sur la même sous-requête
    total = session.exec(
        select(func.count())
        .select_from(stmt.subquery())
    ).one()

    # 5) Pagination
    pages = math.ceil(total / limit)
    offset = (page - 1) * limit

    # 6) Exécution finale avec ordre, offset, limit
    rows = session.exec(
        stmt.order_by(Prediction.created_at.desc())
            .offset(offset)
            .limit(limit)
    ).all()

    # 7) Construction de la liste d'items intégrant model_name
    items = []
    for pred, mdl_name in rows:
        data = pred.model_dump()  # ou .dict() selon ta version
        data["model_name"] = mdl_name
        items.append(data)

    return {
        "items": items,
        "total": total,
        "page": page,
        "pages": pages,
        "limit": limit
    }
