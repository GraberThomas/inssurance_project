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
    """
    Determines the risk level based on a given prediction threshold.

    The function evaluates the input `prediction` value and compares it
    against predefined thresholds, `q1` and `q2`. It categorizes the risk
    into one of three levels: "lower", "moderate", or "high", depending on
    the comparison results.

    :param prediction: The numerical value representing the prediction to
        be evaluated against predefined risk thresholds.
    :type prediction: float
    :return: A string indicating the risk level: either "lower", "moderate",
        or "high".
    :rtype: str
    """
    if prediction < q1:
        return "lower"
    elif prediction < q2:
        return "moderate"
    else:
        return "high"

MARGIN = 0.05


def dynamic_plan(prediction):
    """
    Analyzes the risk level of a given prediction and computes financial metrics such
    as franchise, ceiling, refund, and the corresponding annual and monthly prices
    based on pre-defined rates and margins.

    :param prediction: The predicted monetary value for which the dynamic plan will
                       be computed.
    :type prediction: float

    :return: A dictionary containing the input prediction, computed risk level,
             franchise amount, ceiling amount, refund amount, annual price, and
             monthly price for the dynamic plan.
    :rtype: dict
    """
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
    """
    Builds a personalized recommendation for a client by analyzing risk level,
    providing tailored health suggestions, highlighting influential factors using
    SHAP analysis, and constructing a comprehensive response plan.

    The function incorporates dynamic planning based on the given prediction,
    analyzes health-related habits or concerns, and utilizes SHAP explainer
    mechanisms to determine features with the greatest impact. The final result
    is a structured response containing critical details such as risk level,
    health plans, top factors influencing the decision, and actionable health
    suggestions.

    :param prediction: The outcome from the machine learning model representing
        the risk prediction for the client.
    :type prediction: Any
    :param model: The trained machine learning model used for SHAP explanations.
    :type model: Any
    :param df: A DataFrame containing the input data corresponding to the client,
        with features required for analysis and SHAP evaluations.
    :type df: pandas.DataFrame
    :return: A dictionary containing the client's risk level, health plan details,
        the top factors determined using SHAP, and health improvement suggestions.
    :rtype: dict
    """
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

