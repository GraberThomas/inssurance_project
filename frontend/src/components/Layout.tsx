/**
 * Layout component that provides a consistent page structure with navigation bar,
 * main content area, and footer. It wraps the main content in a flex container
 * to ensure the footer stays at the bottom of the page.
 */

import { Container, Stack } from "react-bootstrap";
import { ReactNode } from "react";

import NavBar from "./NavBar.tsx"

interface LayoutProps {
    children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
    return (
        <div className="d-flex flex-column min-vh-100">
            <NavBar />

            <Container className="flex-grow-1">{children}</Container>

            <footer className="border-top mt-auto py-3">
                <Container>
                    <Stack gap={2} className="text-center">
                        <p className="mb-0">© 2025 Symetra Inc. Tous droits réservés.</p>
                        <Stack direction="horizontal" gap={3} className="justify-content-center small">
                            <a href="#" className="text-muted link-primary text-decoration-none">Mentions légales</a>
                            <span className="text-muted">|</span>
                            <a href="#" className="text-muted link-primary text-decoration-none">CGU</a>
                            <span className="text-muted">|</span>
                            <a href="mailto:contact@symetra.com" className="text-muted link-primary text-decoration-none">Contact</a>
                        </Stack>
                    </Stack>
                </Container>
            </footer>
        </div>
    );
};

export default Layout;
