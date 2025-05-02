import { Container, Nav, Navbar, Image } from "react-bootstrap";
import { Link } from "react-router-dom";

const NavBar: React.FC = () => {
    return (
        <Navbar bg="light" expand="lg" className="shadow-sm mb-3" style={{ height: "64px" }}>
            <Container className="h-100">
                <Navbar.Brand as={Link} to="/" className="h-100 d-flex align-items-center">
                    <Image
                        src="/logo_symetra_cropped_transparent.png"
                        alt="Symetra Logo"
                        className="h-100"
                        style={{ objectFit: "contain" }}
                    />
                </Navbar.Brand>
                <Navbar.Toggle />
                <Navbar.Collapse>
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to="/">Simulation</Nav.Link>
                        <Nav.Link as={Link} to="/models">Modèles</Nav.Link>
                        <Nav.Link as={Link} to="/history">Historique</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default NavBar;
