// src/atoms/models.ts
import { atomWithStorage } from 'jotai/utils'

export interface ModelInfo {
    metrics: { MAE: number; RMSE: number; R2: number }
    columns: string[]
}

export const modelsAtom = atomWithStorage<Record<string, ModelInfo>>(
    'models',
    {}
)

export const selectedModelAtom = atomWithStorage<string>(
    'selectedModel',
    '',
    undefined,
    { getOnInit: true }
)
