import axios from 'axios';
import type { PredictionResponse } from '../types/inssurance';
import {FormData} from "../types/inssurance";
import {ModelInfo} from "../atoms/models.ts";

const API_BASE = import.meta.env.VITE_API_MODEL_URL
const API_MODEL_ROUTE = import.meta.env.VITE_MODEL_ROUTE;
const MODEL_PREDICT_SUBROUTE = import.meta.env.VITE_MODEL_PREDICT_SUBROUTE;

export function buildPredictUrl(model: string): string {
    return `${API_BASE}${API_MODEL_ROUTE}/${model}${MODEL_PREDICT_SUBROUTE}`;
}

export async function predictInsurance(
    model: string,
    data: FormData
): Promise<PredictionResponse> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { firstName, lastName, ...apiInput } = data;

    const url = buildPredictUrl(model);
    const res = await axios.post<PredictionResponse>(url, apiInput);
    return res.data;
}

export function buildModelsUrl(): string {
    return `${API_BASE}${API_MODEL_ROUTE}`
}

export async function fetchModels(): Promise<Record<string, ModelInfo>> {
    const url = buildModelsUrl()
    const { data } = await axios.get<Record<string, ModelInfo>>(url)
    return data
}
