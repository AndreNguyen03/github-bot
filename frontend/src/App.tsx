import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RepositoryPage from "./pages/Repository/RepositoryPage";
import "./index.css";
// import InstallationPage from "./pages/Installation/InstallationPage";
import Header from "./components/Header/Header";
import ConfigurationPage from "./pages/Configuration/ConfigurationPage";
import { NotificationProvider } from "./provider/NotificationProvider";
function App() {
  return (
    <NotificationProvider>
      <Router>
        <>
          <div className="container mx-auto mt-16 p-4">
            <Routes>
              <Route
                path="/"
                element={
                  <>
                    <Header />
                    <RepositoryPage />
                  </>
                }
              />
              <Route path="/login" element={<LoginPage />} />
              <Route
                path="/repositories"
                element={
                  <>
                    <Header />
                    <RepositoryPage />
                  </>
                }
              />
              <Route
                path="/configuration"
                element={
                  <>
                    <Header />
                    <ConfigurationPage />
                  </>
                }
              />
              {/* <Route path="/installation" element={<InstallationPage />} /> */}
              <Route path="*" element={<div>404 - Page Not Found</div>} />
            </Routes>
          </div>
        </>
      </Router>
    </NotificationProvider>
  );
}

export default App;
