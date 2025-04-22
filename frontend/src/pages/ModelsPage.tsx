import React from 'react';
import {useAtom} from "jotai";
import {modelsAtom, selectedModelAtom} from "../atoms/models.ts";
import {Alert, Container, ListGroup, Spinner} from "react-bootstrap";
import Layout from "../components/Layout.tsx";

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
