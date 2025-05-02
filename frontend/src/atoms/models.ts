/**
 * This module defines atoms for storing and managing machine learning model information.
 * It includes interfaces and atoms for model metrics, available columns, and currently selected model.
 * The state is persisted using local storage through Jotai's atomWithStorage utility.
 */

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
