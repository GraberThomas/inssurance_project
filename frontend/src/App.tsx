// src/App.tsx
import './App.css'
import { useEffect, useState } from 'react'
import { Route, Routes, BrowserRouter } from 'react-router-dom'
import { Container, Spinner } from 'react-bootstrap'
import { useAtom } from 'jotai'
import { modelsAtom, selectedModelAtom } from './atoms/models'
import PredictionPage from './pages/PredictionPage'
import HistoryPage   from './pages/HistoryPage.tsx'
import ModelsPage     from './pages/ModelsPage'
import SettingsPage   from './pages/SettingsPage'
import {fetchModels} from "./api/inssurance.ts";

function App() {
    const [, setModels] = useAtom(modelsAtom)
    const [selectedModel, setSelectedModel] = useAtom(selectedModelAtom)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function loadModels() {
            try {
                const data = await fetchModels()
                setModels(data)

                const bestModel = Object.entries(data)
                    .sort(([, a], [, b]) => b.metrics.R2 - a.metrics.R2)[0]?.[0] || ''

                const modelToUse =
                    selectedModel && data[selectedModel]
                        ? selectedModel
                        : bestModel

                setSelectedModel(modelToUse)
            } catch (err) {
                console.error('Erreur chargement des modèles', err)
            } finally {
                setLoading(false)
            }
        }
        void loadModels()
    }, [selectedModel, setModels, setSelectedModel])

    if (loading) {
        return (
            <BrowserRouter>
                <Container
                    fluid
                    className="d-flex align-items-center justify-content-center"
                    style={{ height: 'calc(100vh - 56px)' }}
                >
                    <div className="text-center">
                        <Spinner animation="border" role="status" />
                        <div className="mt-2">Chargement des modèles…</div>
                    </div>
                </Container>
            </BrowserRouter>
        )
    }

    return (
        <BrowserRouter>
            <Container className="mt-4">
                <Routes>
                    <Route path="/" element={<PredictionPage />} />
                    <Route path="/history" element={<HistoryPage />} />
                    <Route path="/models" element={<ModelsPage />} />
                    <Route path="/settings" element={<SettingsPage />} />
                </Routes>
            </Container>
        </BrowserRouter>
    )
}

export default App
