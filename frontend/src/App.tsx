import './App.css'
import {Route, Routes, BrowserRouter} from "react-router-dom";
import {Container, Navbar} from "react-bootstrap";
import PredictionPage from "./pages/PredictionPage.tsx";
import AnalysisPage from "./pages/AnalysisPage.tsx";
import ModelsPage from "./pages/ModelsPage.tsx";
import SettingsPage from "./pages/SettingsPage.tsx";

function App() {
  return (
      <BrowserRouter>
          <Navbar />
          <Container className="mt-4">
              <Routes>
                  <Route path="/" element={<PredictionPage />} />
                  <Route path="/analysis" element={<AnalysisPage />} />
                  <Route path="/models" element={<ModelsPage />} />
                  <Route path="/settings" element={<SettingsPage />} />
              </Routes>
          </Container>
      </BrowserRouter>
  )
}

export default App
