import {PredictionResponse, FormData,Prediction} from "../types/inssurance.ts";

const API_BASE = import.meta.env.VITE_API_PERSISTANCE_URL

export async function saveResult(
    formData: FormData,
    prediction_response: PredictionResponse,
    model_name: string,
): Promise<void> {
    const payload = {
        profil: {
            nom: formData.save_data ? formData.lastName : null,
            prenom: formData.save_data ? formData.firstName : null,
            age: formData.age,
            sex: formData.sex,
            bmi: formData.bmi,
            children: formData.children,
            smoker: formData.smoker,
            region: formData.region,
        },
        response: prediction_response,
        model_name: model_name,
    };

    console.log("Payload envoyé à /predictions/ :", payload);

    try {
        const res = await fetch(`${API_BASE}/predictions/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        if (!res.ok) {
            throw new Error(`Erreur HTTP : ${res.status}`);
        }

        const result = await res.json();
        console.log("Prédiction enregistrée, ID :", result.id);
    } catch (err) {
        console.error("Erreur lors de l'enregistrement de la prédiction :", err);
    }
}

// src/api/persistance.ts
export interface Paginated<T> {
    items: T[];
    total: number;
    page: number;
    pages: number;
    limit: number;
}

export async function getPaginatedPredictions(
    params: Record<string, any>
): Promise<Paginated<Prediction>> {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== "") query.set(k, String(v));
    });
    const res = await fetch(`${API_BASE}/predictions/?${query}`);
    if (!res.ok) throw new Error("Erreur chargement historique");
    return await res.json();
}

export async function getModelNames(): Promise<string[]> {
    const res = await fetch(`${API_BASE}/models`);
    if (!res.ok) throw new Error("Erreur chargement modèles");
    return await res.json();
}
