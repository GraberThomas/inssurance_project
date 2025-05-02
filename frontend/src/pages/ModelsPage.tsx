/**
 * ModelsPage Component
 *
 * A React component that displays a list of available prediction models and allows users to select one.
 * Features:
 * - Shows loading spinner while models are being fetched
 * - Displays models in a list with their performance metrics (R² and MAE)
 * - Allows model selection with visual feedback
 * - Shows selected model confirmation alert
 * - Responsive layout with Bootstrap styling
 */
import React from 'react';
import {useAtom} from "jotai";
import {modelsAtom, selectedModelAtom} from "../atoms/models.ts";
import {Alert, Container, ListGroup, Spinner} from "react-bootstrap";
import Layout from "../components/Layout.tsx";


/**
 * ModelsPage is a React functional component that renders a list of available models
 * and allows users to select one. The component uses state management with Recoil atoms
 * for the list of models and the currently selected model.
 *
 * Key features:
 * - Displays a spinner while waiting for model data to load if no models are available.
 * - Lists all available models dynamically, allowing users to select a model.
 * - Highlights the selected model and displays relevant metrics for each model (R² and MAE).
 * - Shows a success alert when a model is selected, displaying the name of the selected model.
 *
 * Behavior:
 * - When no models are available, a loading spinner is displayed.
 * - Models are listed dynamically using the data from `modelsAtom`.
 * - On clicking a model, it updates the `selectedModelAtom` with the selected model's name.
 * - The selected model is visually indicated and its name is shown in a success alert.
 */
const ModelsPage: React.FC = () => {
    const [models] = useAtom(modelsAtom)
    const [selectedModel, setSelectedModel] = useAtom(selectedModelAtom)

    if (!Object.keys(models).length) {
        return (
            <Container className="text-center mt-5">
                <Spinner animation="border" />
            </Container>
        )
    }

    return (
        <Layout>
            <Container className="mt-5" style={{ maxWidth: 600 }}>
                <h2 className="mb-4">Choisissez un modèle</h2>

                <ListGroup>
                    {Object.entries(models).map(([name, info]) => (
                        <ListGroup.Item
                            key={name}
                            action
                            active={name === selectedModel}
                            onClick={() => setSelectedModel(name)}
                        >
                            <div className="d-flex justify-content-between align-items-center">
                                <strong className="text-capitalize">{name.replace('_', ' ')}</strong>
                                <small>
                                    R² = {info.metrics.R2.toFixed(3)} • MAE = {info.metrics.MAE.toFixed(0)}
                                </small>
                            </div>
                        </ListGroup.Item>
                    ))}
                </ListGroup>

                {selectedModel && (
                    <Alert variant="success" className="mt-4">
                        Modèle sélectionné : <strong>{selectedModel}</strong>
                    </Alert>
                )}
            </Container>
        </Layout>
    )
}

export default ModelsPage;
