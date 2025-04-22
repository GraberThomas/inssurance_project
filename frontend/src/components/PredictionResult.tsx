import React from "react";
import {Card, ListGroup, Row, Col, Badge, Alert} from "react-bootstrap";
import {Plan, PredictionResponse} from "../types/inssurance.ts";

// Mapping risk levels to friendly labels
const planLabels: Record<PredictionResponse['risk_level'], string> = {
    lower: "Eco",
    moderate: "Medium",
    high: "Premium",
};

// Reusable PlanCard component
interface PlanCardProps {
    plan: Plan;
    label: string;
}
const PlanCard: React.FC<PlanCardProps> = ({ plan, label }) => (
    <Card className="h-100 text-center shadow-sm">
        <Card.Header as="h5" className="bg-light">
            {label}
        </Card.Header>
        <Card.Body>
            <Card.Text><strong>Franchise&nbsp;:</strong> {plan.franchise} €</Card.Text>
            <Card.Text><strong>Plafond&nbsp;:</strong> {plan.ceiling}</Card.Text>
            <Card.Text><strong>Remboursement&nbsp;estimé&nbsp;:</strong> {plan.refund_estimate} €</Card.Text>
        </Card.Body>
        <Card.Footer>
            <h4>{plan.monthly_price} € <small>/ mois</small></h4>
            <small className="text-muted">soit {plan.annual_price} € / an</small>
        </Card.Footer>
    </Card>
);

// Main result component
interface PredictionResultProps { result: PredictionResponse }
const PredictionResult: React.FC<PredictionResultProps> = ({ result }) => (
    <>
        {/* Résumé */}
        <Card className="mb-4 shadow-sm">
            <Card.Header as="h4" className="bg-primary text-white">Résumé</Card.Header>
            <Card.Body>
                <Row>
                    <Col md={4} className="mb-3">
                        <strong>Coût estimé</strong>
                        <p className="display-6">{result.prediction} €</p>
                    </Col>
                    <Col md={4} className="mb-3">
                        <strong>Intervalle</strong>
                        <p>{result.interval[0]} € – {result.interval[1]} €</p>
                    </Col>
                    <Col md={4} className="mb-3">
                        <strong>Niveau de risque</strong>
                        <div>
                            <Badge bg={
                                result.risk_level === 'lower' ? 'success'
                                    : result.risk_level === 'moderate' ? 'warning'
                                        : 'danger'
                            } className="fs-6">
                                {planLabels[result.risk_level]}
                            </Badge>
                        </div>
                    </Col>
                </Row>
            </Card.Body>
        </Card>

        {/* Plan suggéré */}
        <Card className="mb-4 shadow-sm">
            <Card.Header as="h4" className="bg-secondary text-dark">Plan suggéré</Card.Header>
            <Card.Body>
                <Row xs={1} md={1} lg={3} className="g-4">
                    <Col>
                        <PlanCard plan={result.plan} label={planLabels[result.risk_level]} />
                    </Col>
                </Row>
            </Card.Body>
        </Card>

        {/* Facteurs principaux */}
        <Card className="mb-4 shadow-sm">
            <Card.Header as="h4" className="bg-info text-white">Facteurs principaux</Card.Header>
            <Card.Body>
                <ListGroup>
                    {result.top_factors.map((factor, i) => (
                        <ListGroup.Item key={i} className="d-flex justify-content-between">
                            <span><strong>{factor.feature}</strong>: {factor.value}</span>
                            <span>impact {factor.shap_value.toFixed(2)}</span>
                        </ListGroup.Item>
                    ))}
                    {result.top_factors.length == 0 && (
                        <Alert variant="warning">Le modèle sélectionné ne prend pas en charge les facteurs.</Alert>
                    )}
                </ListGroup>
            </Card.Body>
        </Card>

        {/* Suggestions */}
        {result.suggestions.length > 0 && (
            <Card className="mb-4 shadow-sm">
                <Card.Header as="h4" className="bg-light">Suggestions</Card.Header>
                <Card.Body>
                    <ul className="mb-0">
                        {result.suggestions.map((s, i) => (
                            <li key={i}>{s}</li>
                        ))}
                    </ul>
                </Card.Body>
            </Card>
        )}
    </>
);

export default PredictionResult;

// Usage:
// Dans votre PredictionPage.tsx, importez et utilisez ce composant :
// import PredictionResult from "../components/PredictionResult";
// ...
// if (result) {
//   return (
//     <Layout>
//       <PredictionResult result={result} />
//     </Layout>
//   );
// }
