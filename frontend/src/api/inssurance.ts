import axios from 'axios';
import type { PredictionResponse } from '../types/inssurance';
import {FormData} from "../types/inssurance";

const API_BASE = 'http://localhost:8000';

export function buildPredictUrl(model: string): string {
    return `${API_BASE}/models/${model}/predict`;
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
