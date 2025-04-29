import { useState, ChangeEvent } from "react";
import {
    Form,
    Button,
    Row,
    Col,
    Card,
    Alert,
    Spinner,
    ListGroup,
    Container
} from "react-bootstrap";
import Layout from "../components/Layout";
import {PredictionResponse} from "../types/inssurance";
import {FormData} from "../types/inssurance";
import {selectedModelAtom} from "../atoms/models";
import {predictInsurance} from "../api/inssurance";
import {useAtomValue} from "jotai";
import PredictionResult from "../components/PredictionResult";

const PredictionPage = () => {
    const model = useAtomValue(selectedModelAtom);
    const [step, setStep] = useState<number>(0);
    const [formData, setFormData] = useState<FormData>({
        firstName: "",
        lastName: "",
        age: 30,
        sex: "male",
        region: "northeast",
        bmi: 25,
        children: 0,
        smoker: false,
        save_data: false,
    });
    const [result, setResult] = useState<PredictionResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (
        e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const target = e.target;
        const { name, value, type } = target as HTMLInputElement | HTMLSelectElement;
        setFormData(prev => ({
            ...prev,
            [name]:
                type === "checkbox"
                    ? (target as HTMLInputElement).checked
                    : type === "number"
                        ? Number((target as HTMLInputElement).value)
                        : value,
        }));
    };

    const handleNext = () => setStep((s) => s + 1);
    const handleBack = () => setStep((s) => s - 1);

    const handleConfirm = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await predictInsurance(model, formData);
            setResult(data);
        } catch (err: any) {
            let message = 'Erreur lors de la prédiction.';
            const detail = err.response?.data?.detail;
            if (typeof detail === 'string') {
                message = detail;
            } else if (Array.isArray(detail)) {
                message = detail.map((d) => d.msg || JSON.stringify(d)).join('; ');
            } else if (detail && typeof detail === 'object') {
                message = JSON.stringify(detail);
            }
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setStep(0);
        setFormData({
            firstName: "",
            lastName: "",
            age: 30,
            sex: "male",
            region: "northeast",
            bmi: 25,
            children: 0,
            smoker: false,
            save_data: false,
        });
        setResult(null);
        setLoading(false);
        setError(null);
    };


    if (result) {
        return (
            <Layout>
                <PredictionResult result={result} reset={handleReset} />
            </Layout>
        );
    }

    return (
        <Layout>
            <Container
                className="d-flex flex-column align-items-center justify-content-center"
                style={{ minHeight: '80vh' }}
            >
                {/* Écran de démarrage */}
                {step === 0 && (
                    <Row className="w-100 justify-content-center">
                        <Col xs={12} sm={10} md={8} lg={6}>
                            <Card className="p-5 text-center">
                                <Card.Title as="h2" className="mb-4">
                                    Démarrer la simulation
                                </Card.Title>
                                <Button size="lg" onClick={() => setStep(1)}>
                                    Commencer
                                </Button>
                            </Card>
                        </Col>
                    </Row>
                )}

                {/* Formulaire multi-étapes */}
                {step > 0 && (
                    <Row className="w-100 justify-content-center mt-5">
                        <Col xs={12} sm={10} md={8} lg={6}>
                            <Card className="p-4">
                                {error && <Alert variant="danger">{error}</Alert>}
                                {loading && <Spinner animation="border" className="mb-3" />}

                                {/* Étape 1 */}
                                {step === 1 && (
                                    <Form>
                                        <h4 className="mb-4">À propos du client</h4>
                                        <Row>
                                            <Col md={6} className="mb-3">
                                                <Form.Group controlId="firstName">
                                                    <Form.Label>Prénom</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        name="firstName"
                                                        value={formData.firstName}
                                                        onChange={handleChange}
                                                        required
                                                        placeholder={"Jean"}
                                                    />
                                                </Form.Group>
                                            </Col>
                                            <Col md={6} className="mb-3">
                                                <Form.Group controlId="lastName">
                                                    <Form.Label>Nom</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        name="lastName"
                                                        value={formData.lastName}
                                                        onChange={handleChange}
                                                        required
                                                        placeholder={"Dupont"}
                                                    />
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                        <Row className="mt-3">
                                            <Col md={6} className="mb-3">
                                                <Form.Group controlId="age">
                                                    <Form.Label>Âge</Form.Label>
                                                    <Form.Control
                                                        type="number"
                                                        name="age"
                                                        value={formData.age}
                                                        onChange={handleChange}
                                                        required
                                                    />
                                                </Form.Group>
                                            </Col>
                                            <Col md={6} className="mb-3">
                                                <Form.Group controlId="sex">
                                                    <Form.Label>Sexe</Form.Label>
                                                    <Form.Select
                                                        name="sex"
                                                        value={formData.sex}
                                                        onChange={handleChange}
                                                    >
                                                        <option value="male">Homme</option>
                                                        <option value="female">Femme</option>
                                                    </Form.Select>
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                        <div className="mt-4 d-flex justify-content-end">
                                            <Button onClick={handleNext}>Suivant</Button>
                                        </div>
                                    </Form>
                                )}

                                {/* Étape 2 */}
                                {step === 2 && (
                                    <Form>
                                        <h4 className="mb-4">Où habite-t-il ?</h4>
                                        <Form.Group controlId="region" className="mb-3">
                                            <Form.Label>Région</Form.Label>
                                            <Form.Select
                                                name="region"
                                                value={formData.region}
                                                onChange={handleChange}
                                            >
                                                <option value="northeast">Nord-Est</option>
                                                <option value="northwest">Nord-Ouest</option>
                                                <option value="southeast">Sud-Est</option>
                                                <option value="southwest">Sud-Ouest</option>
                                            </Form.Select>
                                        </Form.Group>
                                        <div className="mt-4 d-flex justify-content-between">
                                            <Button variant="secondary" onClick={handleBack}>
                                                Précédent
                                            </Button>
                                            <Button onClick={handleNext}>Suivant</Button>
                                        </div>
                                    </Form>
                                )}

                                {/* Étape 3 */}
                                {step === 3 && (
                                    <Form>
                                        <h4 className="mb-4">À propos de la famille</h4>
                                        <Form.Group controlId="children" className="mb-3">
                                            <Form.Label>Enfants à charge</Form.Label>
                                            <Form.Control
                                                type="number"
                                                name="children"
                                                value={formData.children}
                                                onChange={handleChange}
                                            />
                                        </Form.Group>
                                        <div className="mt-4 d-flex justify-content-between">
                                            <Button variant="secondary" onClick={handleBack}>
                                                Précédent
                                            </Button>
                                            <Button onClick={handleNext}>Suivant</Button>
                                        </div>
                                    </Form>
                                )}

                                {/* Étape 4 */}
                                {step === 4 && (
                                    <Form>
                                        <h4 className="mb-4">Informations santé</h4>
                                        <Form.Group controlId="bmi" className="mb-3">
                                            <Form.Label>IMC</Form.Label>
                                            <Form.Control
                                                type="number"
                                                name="bmi"
                                                value={formData.bmi}
                                                onChange={handleChange}
                                                step="0.1"
                                                required
                                            />
                                        </Form.Group>
                                        <div className="mt-4 d-flex justify-content-between">
                                            <Button variant="secondary" onClick={handleBack}>
                                                Précédent
                                            </Button>
                                            <Button onClick={handleNext}>Suivant</Button>
                                        </div>
                                    </Form>
                                )}

                                {/* Étape 5 */}
                                {step === 5 && (
                                    <Form>
                                        <h4 className="mb-4">Habitudes</h4>
                                        <Form.Group controlId="smoker" className="mb-3">
                                            <Form.Check
                                                type="checkbox"
                                                name="smoker"
                                                checked={formData.smoker}
                                                onChange={handleChange}
                                                label="Fumeur"
                                            />
                                        </Form.Group>
                                        <div className="mt-4 d-flex justify-content-between">
                                            <Button variant="secondary" onClick={handleBack}>
                                                Précédent
                                            </Button>
                                            <Button onClick={handleNext}>Suivant</Button>
                                        </div>
                                    </Form>
                                )}

                                {step === 6 && (
                                    <Form>
                                        <h4 className="mb-4">Sauvegarde du nom et prenom </h4>
                                        <Form.Group controlId="save_data" className="mb-3">
                                            <Form.Check
                                                type="checkbox"
                                                name="save_data"
                                                checked={formData.save_data}
                                                onChange={handleChange}
                                                label="Sauvegarde"
                                            />
                                        </Form.Group>
                                        <div className="mt-4 d-flex justify-content-between">
                                            <Button variant="secondary" onClick={handleBack}>
                                                Précédent
                                            </Button>
                                            <Button onClick={handleNext}>Suivant</Button>
                                        </div>
                                    </Form>
                                )}

                                {/* Étape 7 */}
                                {step === 7 && (
                                    <>
                                        <h4 className="mb-4">Récapitulatif</h4>
                                        <ListGroup className="mb-3">
                                            <ListGroup.Item><strong>Prénom:</strong> {formData.firstName}</ListGroup.Item>
                                            <ListGroup.Item><strong>Nom:</strong> {formData.lastName}</ListGroup.Item>
                                            <ListGroup.Item><strong>Âge:</strong> {formData.age}</ListGroup.Item>
                                            <ListGroup.Item><strong>Sexe:</strong> {formData.sex === 'male' ? 'Homme' : 'Femme'}</ListGroup.Item>
                                            <ListGroup.Item><strong>Région:</strong> {formData.region}</ListGroup.Item>
                                            <ListGroup.Item><strong>Enfants:</strong> {formData.children}</ListGroup.Item>
                                            <ListGroup.Item><strong>IMC:</strong> {formData.bmi}</ListGroup.Item>
                                            <ListGroup.Item><strong>Fumeur:</strong> {formData.smoker ? 'Oui' : 'Non'}</ListGroup.Item>
                                            <ListGroup.Item><strong>Sauvegarde du nom et du prenom:</strong> {formData.save_data ? 'Oui' : 'Non'}</ListGroup.Item>
                                        </ListGroup>
                                        <div className="mt-4 d-flex justify-content-between">
                                            <Button variant="secondary" onClick={handleBack}>
                                                Précédent
                                            </Button>
                                            <Button onClick={handleConfirm} disabled={loading}>
                                                Confirmer & Simuler
                                            </Button>
                                        </div>
                                    </>
                                )}
                            </Card>
                        </Col>
                    </Row>
                )}
            </Container>
        </Layout>
    );
};

export default PredictionPage;
