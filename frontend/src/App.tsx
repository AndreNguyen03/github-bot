import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RepositoryPage from "./pages/Repository/RepositoryPage";
import "./index.css";
// import InstallationPage from "./pages/Installation/InstallationPage";
import ConfigurationPage from "./pages/Configuration/ConfigurationPage";
import { NotificationProvider } from "./provider/NotificationProvider";
import { LayoutHeader } from "./pages/Layout/LayoutHeader";

import BotConfiguration from "./pages/Bot/BotConfigurationPage";
import CreateGithubAppPage from "./pages/Bot/CreateGithubAppPage";
function App() {
  return (
    <NotificationProvider>
      <Router>
        <>
          <div className="container mx-auto mt-16 p-4">
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/" element={<LayoutHeader />}>
                <Route path="/repository" element={<RepositoryPage />} />
                <Route path="/configuration" element={<ConfigurationPage />} />
                <Route path="/bot" element={<BotConfiguration />} />
                <Route path="/bot/newapp" element={<CreateGithubAppPage />} />
                {/* <Route path="/installation" element={<InstallationPage />} /> */}
                <Route path="*" element={<div>404 - Page Not Found</div>} />
              </Route>
            </Routes>
          </div>
        </>
      </Router>
    </NotificationProvider>
  );
}

export default App;
