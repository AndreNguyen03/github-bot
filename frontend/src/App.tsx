import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RepositoryPage from "./pages/Repository/RepositoryPage";
import "./index.css";
// import InstallationPage from "./pages/Installation/InstallationPage";
import Header from "./components/Header/Header";
import ConfigurationPage from "./pages/Configuration/ConfigurationPage";
function App() {
  return (
    <Router>
      <>
        {!window.location.pathname.includes("/login") && <Header />}
        <div className="container mx-auto mt-16 p-4">
          <Routes>
            <Route path="/" element={<RepositoryPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/repositories" element={<RepositoryPage />} />
            <Route path="/configuration" element={<ConfigurationPage />} />
            {/* <Route path="/installation" element={<InstallationPage />} /> */}
            <Route path="*" element={<div>404 - Page Not Found</div>} />
          </Routes>
        </div>
      </>
    </Router>
  );
}

export default App;
