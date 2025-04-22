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
    region: "northeast" | "northwest" | "southeast" | "southwest";
    bmi: number;
    children: number;
    smoker: boolean;
}