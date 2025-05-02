/**
 * HistoryPage component displays a paginated list of insurance predictions with filtering capabilities.
 * Features:
 * - Filters by model name, sex, smoker status, region, age range, and children count
 * - Paginated results with configurable items per page
 * - Detailed view of each prediction in an accordion layout
 * - Error handling and loading states
 * - Dynamic model name options loaded from API
 */
import { useState, useEffect } from "react";
import {
    Container,
    Row,
    Col,
    Form,
    Button,
    Table,
    Spinner,
    Alert,
    Accordion,
    Card
} from "react-bootstrap";
import Layout from "../components/Layout";
import type { Prediction } from "../types/inssurance";
import { getPaginatedPredictions, getModelNames } from "../api/persistance";

/**
 * Generic interface for paginated API responses
 */
interface Paginated<T> {
    items: T[];
    total: number;
    page: number;
    pages: number;
    limit: number;
}

/**
 * HistoryPage is a React functional component that renders a view for managing and displaying a historical list of predictions.
 * It provides filtering options for searching predictions based on various criteria such as model name, sex, smoking status, region, age range, and number of children.
 * The component supports pagination and fetches a paginated list of predictions from an external API.
 * It also handles UI interactions for filters, error handling during data fetching, and the displaying of prediction details in an accordion layout.
 *
 * Component Features:
 * - Filters to refine the displayed prediction data by various parameters.
 * - Pagination for navigating through the list of predictions.
 * - Dynamic fetching of model names and prediction data from APIs.
 * - Displays predictions and detailed information including metadata (name, age, risk level, model, etc.).
 * - Loading state and error handling.
 */
const HistoryPage = () => {
    // --- filters ---
    const [modelName, setModelName] = useState<string>("");
    const [sex, setSex] = useState<string>("");
    const [smoker, setSmoker] = useState<string>("");
    const [region, setRegion] = useState<string>("");

    const [ageMin, setAgeMin] = useState<number | "">("");
    const [ageMax, setAgeMax] = useState<number | "">("");
    const [childrenMin, setChildrenMin] = useState<number | "">("");
    const [childrenMax, setChildrenMax] = useState<number | "">("");

    // --- paginate and data ---
    const [items, setItems] = useState<Prediction[]>([]);
    const [page, setPage] = useState<number>(1);
    const [pages, setPages] = useState<number>(1);
    const [limit] = useState<number>(10);
    const [total, setTotal] = useState<number>(0);

    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const [modelOptions, setModelOptions] = useState<string[]>([]);

    /**
     * Loads the list of model names from the API and sets the options for the model name filter.
     * The model names are used to populate the model name filter dropdown.
     * The model names are also used to populate the model name column in the prediction table.
     */
    useEffect(() => {
        getModelNames()
            .then(data => {
                if (Array.isArray(data)) {
                    if (data.length > 0 && typeof data[0] === 'object' && 'name' in data[0]) {
                        setModelOptions((data as any[]).map(m => (m as any).name));
                    } else {
                        setModelOptions(data as string[]);
                    }
                } else if (data && typeof data === 'object') {
                    // si réponse dict
                    setModelOptions(Object.keys(data));
                }
            })
            .catch(() => {});
    }, []);

    /**
     * Fetches a paginated list of predictions from the API based on the current filter settings.
     */
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await getPaginatedPredictions({
                    page,
                    limit,
                    model_name: modelName || undefined,
                    sex: sex || undefined,
                    smoker: smoker !== "" ? smoker === "true" : undefined,
                    region: region || undefined,
                    age_min: ageMin === "" ? undefined : ageMin,
                    age_max: ageMax === "" ? undefined : ageMax,
                    children_min: childrenMin === "" ? undefined : childrenMin,
                    children_max: childrenMax === "" ? undefined : childrenMax
                } as any) as Paginated<Prediction>;

                setItems(res.items);
                setPage(res.page);
                setPages(res.pages);
                setTotal(res.total);
            } catch {
                setError("Impossible de charger l’historique");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [page, modelName, sex, smoker, region, ageMin, ageMax, childrenMin, childrenMax, limit]);

    const handleSet = (setter: any, isNumber = false) => (e: any) => {
        const v = e.target.value;
        if (isNumber) {
            setter(v === "" ? "" : Number(v));
        } else {
            setter(v);
        }
        setPage(1);
    };

    return (
        <Layout>
            <Container className="py-5">
                <h2 className="mb-4">Historique des Prédictions</h2>

                {/* FILTRES */}
                <Card className="p-3 mb-4">
                    <Form>
                        <Row>
                            <Col md={3} className="mb-2">
                                <Form.Label>Modèle</Form.Label>
                                <Form.Select value={modelName} onChange={handleSet(setModelName)}>
                                    <option value="">Tous</option>
                                    {modelOptions.map(name => (
                                        <option key={name} value={name}>{name}</option>
                                    ))}
                                </Form.Select>
                            </Col>
                            <Col md={2} className="mb-2">
                                <Form.Label>Sexe</Form.Label>
                                <Form.Select value={sex} onChange={handleSet(setSex)}>
                                    <option value="">Tous</option>
                                    <option value="male">Homme</option>
                                    <option value="female">Femme</option>
                                </Form.Select>
                            </Col>
                            <Col md={2} className="mb-2">
                                <Form.Label>Fumeur</Form.Label>
                                <Form.Select value={smoker} onChange={handleSet(setSmoker)}>
                                    <option value="">Tous</option>
                                    <option value="true">Oui</option>
                                    <option value="false">Non</option>
                                </Form.Select>
                            </Col>
                            <Col md={3} className="mb-2">
                                <Form.Label>Région</Form.Label>
                                <Form.Select value={region} onChange={handleSet(setRegion)}>
                                    <option value="">Toutes</option>
                                    <option value="northeast">Nord-Est</option>
                                    <option value="southeast">Sud-Est</option>
                                    <option value="southwest">Sud-Ouest</option>
                                </Form.Select>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={2} className="mb-2">
                                <Form.Label>Âge min</Form.Label>
                                <Form.Control type="number" min={0} value={ageMin} onChange={handleSet(setAgeMin)} />
                            </Col>
                            <Col md={2} className="mb-2">
                                <Form.Label>Âge max</Form.Label>
                                <Form.Control type="number" min={0} value={ageMax} onChange={handleSet(setAgeMax)} />
                            </Col>
                            <Col md={2} className="mb-2">
                                <Form.Label>Enfants min</Form.Label>
                                <Form.Control type="number" min={0} value={childrenMin} onChange={handleSet(setChildrenMin)} />
                            </Col>
                            <Col md={2} className="mb-2">
                                <Form.Label>Enfants max</Form.Label>
                                <Form.Control type="number" min={0} value={childrenMax} onChange={handleSet(setChildrenMax)} />
                            </Col>
                        </Row>
                    </Form>
                </Card>

                {error && <Alert variant="danger">{error}</Alert>}
                {loading && <Spinner animation="border" className="my-3" />}

                {/* ACCORDION DES PREDICTIONS */}
                {!loading && !error && (
                    <Accordion>
                        {items.map(pred => {
                            const suggestionsArr = typeof pred.suggestions === 'string'
                                ? JSON.parse(pred.suggestions)
                                : pred.suggestions;
                            const topFactorsArr = typeof pred.top_factors === 'string'
                                ? JSON.parse(pred.top_factors)
                                : pred.top_factors;

                            return (
                                <Accordion.Item key={pred.id} eventKey={pred.id.toString()}>
                                    <Accordion.Header>
                                        <Row className="w-100 gx-2">
                                            <Col>{(pred.nom && pred.prenom) ? pred.nom + " " + pred.prenom : "Anonyme"}</Col>
                                            <Col>Âge: {pred.age}</Col>
                                            <Col>Risque: {(pred as any).risk_level}</Col>
                                            <Col>Prédiction: {pred.prediction}€</Col>
                                            <Col>Model: {pred.model_name}</Col>
                                            <Col>{new Date(pred.created_at).toLocaleString()}</Col>
                                        </Row>
                                    </Accordion.Header>
                                    <Accordion.Body>
                                        <Table bordered size="sm">
                                            <tbody>
                                            <tr><th>ID</th><td>{pred.id}</td></tr>
                                            <tr><th>Nom</th><td>{pred.nom}</td></tr>
                                            <tr><th>Prénom</th><td>{pred.prenom}</td></tr>
                                            <tr><th>Sexe</th><td>{pred.sex}</td></tr>
                                            <tr><th>IMC</th><td>{pred.bmi}</td></tr>
                                            <tr><th>Enfants</th><td>{pred.children}</td></tr>
                                            <tr><th>Fumeur</th><td>{pred.smoker ? "Oui" : "Non"}</td></tr>
                                            <tr><th>Région</th><td>{pred.region}</td></tr>
                                            <tr><th>Prédiction</th><td>{pred.prediction}</td></tr>
                                            <tr><th>Intervalle</th><td>[{pred.interval_min}, {pred.interval_max}]</td></tr>
                                            <tr><th>MAE</th><td>{pred.mae}</td></tr>
                                            <tr><th>Franchise</th><td>{pred.franchise}</td></tr>
                                            <tr><th>Plafond</th><td>{pred.ceiling}</td></tr>
                                            <tr><th>Remboursement</th><td>{pred.refund_estimate}</td></tr>
                                            <tr><th>Annuel</th><td>{pred.annual_price}</td></tr>
                                            <tr><th>Mensuel</th><td>{pred.monthly_price}</td></tr>
                                            <tr><th>Suggestions</th><td>{suggestionsArr.join(", ")}</td></tr>
                                            <tr>
                                                <th>Top Factors</th>
                                                <td>
                                                    {topFactorsArr.map((f: any, i: number) => (
                                                        <div key={i}>{f.feature}: {f.shap_value}</div>
                                                    ))}
                                                </td>
                                            </tr>
                                            </tbody>
                                        </Table>
                                    </Accordion.Body>
                                </Accordion.Item>
                            );
                        })}
                    </Accordion>
                )}

                {/* PAGINATION */}
                <div className="d-flex justify-content-between align-items-center mt-4">
                    <div>Total : {total}</div>
                    <div>
                        <Button
                            variant="outline-primary"
                            disabled={page <= 1}
                            onClick={() => setPage(p => p - 1)}
                        >
                            ← Précédent
                        </Button>{" "}
                        <span>Page {page} / {pages}</span>{" "}
                        <Button
                            variant="outline-primary"
                            disabled={page >= pages}
                            onClick={() => setPage(p => p + 1)}
                        >
                            Suivant →
                        </Button>
                    </div>
                </div>
            </Container>
        </Layout>
    );
};

export default HistoryPage;
