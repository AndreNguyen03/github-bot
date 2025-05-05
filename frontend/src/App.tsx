import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RepositoryPage from "./pages/Repository/RepositoryPage";
import HomePage from "./pages/Home/HomePage";
import "./index.css";
import InstallationPage from "./pages/Installation/InstallationPage";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/repositories" element={<RepositoryPage />} />
        <Route path="/installation" element={<InstallationPage />} />
      </Routes>
    </Router>
  );
}

export default App;
