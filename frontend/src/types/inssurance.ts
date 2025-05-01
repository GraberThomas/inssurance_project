export interface Plan {
    name: string;
    franchise: number;
    ceiling: number | string;
    refund_estimate: number;
    annual_price: number;
    monthly_price: number;
}

export interface TopFactor {
    feature: string;
    shap_value: number;
    value: number | string;
}

export interface PredictionResponse {
    prediction: number;
    interval: number[];
    mae: number;
    risk_level: "lower" | "moderate" | "high";
    plan: Plan;
    top_factors: TopFactor[];
    suggestions: string[];
}

export interface FormData {
    firstName: string;
    lastName: string;
    age: number;
    sex: "male" | "female";
    region: "northeast" | "southeast" | "southwest";
    bmi: number;
    children: number;
    smoker: boolean;
    save_data: boolean;
}

export interface Prediction {
    id: number;
    nom: string | null;
    prenom: string | null;
    age: number;
    sex: "male" | "female";
    bmi: number;
    children: number;
    smoker: boolean;
    region: string;
    prediction: number;
    interval_min: number;
    interval_max: number;
    mae: number;
    plan_name: string;
    franchise: number;
    ceiling: string;
    refund_estimate: number;
    annual_price: number;
    monthly_price: number;
    suggestions: string[];
    top_factors: TopFactor[];
    created_at: string;
    model_name: string;
}