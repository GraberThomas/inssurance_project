import pandas as pd
import shap

df = pd.read_csv("data_src/inssurance.csv")

q1 = df["charges"].quantile(0.33)
q2 = df["charges"].quantile(0.66)

DEDUCTIBLE_RATE = {
    "lower": 0.3,
    "moderate": 0.25,
    "high": 0.1
}

CEILING_RATE = {
    "lower": 1.0,
    "moderate": 0.9,
    "high": 0.7
}

def get_risk_level(prediction):
    if prediction < q1:
        return "lower"
    elif prediction < q2:
        return "moderate"
    else:
        return "high"

MARGIN = 0.05


def dynamic_plan(prediction):
    level = get_risk_level(prediction)
    tf = DEDUCTIBLE_RATE[level]
    tp = CEILING_RATE[level]

    franchise = round(prediction * tf, 2)
    ceiling = round(prediction * tp, 2)
    refund = max(0, min(prediction - franchise, ceiling))

    annual_price = refund / (1 - MARGIN)
    monthly_price = annual_price / 12

    return {
        "prediction": prediction,
        "risk_level": level,
        "franchise": franchise,
        "ceiling": ceiling,
        "refund": round(refund, 2),
        "annual_price": round(annual_price, 2),
        "monthly_price": round(monthly_price, 2)
    }

def build_recommendation(prediction, model, df):
    # 1. Calcul du plan dynamique
    plan = dynamic_plan(prediction)
    level = plan["risk_level"]

    # 2. Suggestions santé
    suggestions = []
    if df.get("smoker_yes", [0])[0] == 1:
        suggestions.append("The client is a smoker. Offer support to help them quit smoking.")
    if df.get("bmi", [0])[0] > 30:
        suggestions.append("High BMI: offer nutritional support or health sports.")
    if df.get("age", [0])[0] < 25:
        suggestions.append("Young client: consider offering the Eco Jeune plan.")

    # 3. SHAP (top features)
    top_factors = []
    try:
        explainer = shap.Explainer(model)
        shap_values = explainer(df, check_additivity=False)
        shap_df = pd.DataFrame({
            "feature": df.columns,
            "shap_value": shap_values.values[0],
            "value": df.iloc[0].values
        })
        shap_df["impact"] = shap_df["shap_value"].abs()
        top_factors = shap_df.sort_values("impact", ascending=False).head(3)[["feature", "shap_value", "value"]].to_dict(orient="records")
    except Exception:
        pass

    # 4. Construction de la réponse
    return {
        "risk_level": level,
        "plan": {
            "name": level.capitalize(),
            "franchise": plan["franchise"],
            "ceiling": plan["ceiling"] if plan["ceiling"] != float("inf") else "Infinite",
            "refund_estimate": plan["refund"],
            "annual_price": plan["annual_price"],
            "monthly_price": plan["monthly_price"]
        },
        "top_factors": top_factors,
        "suggestions": suggestions
    }

