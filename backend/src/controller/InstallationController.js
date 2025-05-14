import { Octokit } from "@octokit/rest";
import { createAppAuth } from "@octokit/auth-app";
class InstallationController {
  async getRepositoriesManagedByInstallation(req, res) {
    try {
      const data = await fetchRepositoriesFromInstallation();
      res.json(data); // Gửi data HTTP
    } catch (err) {
      console.error("Error fetching repositories", err);
      res.status(500).json({ error: err.message });
    }
  }
}

export default new InstallationController();
