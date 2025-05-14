// InstallationService.js
import { Octokit } from "@octokit/rest";
import { createAppAuth } from "@octokit/auth-app";

export async function fetchRepositoriesFromInstallation() {
  if (!process.env.APP_ID || !process.env.PRIVATE_KEY) {
    throw new Error("Missing APP_ID or PRIVATE_KEY in environment variables");
  }

  const octokit = new Octokit({
    authStrategy: createAppAuth,
    auth: {
      appId: process.env.APP_ID,
      privateKey: process.env.PRIVATE_KEY.replace(/\\n/g, "\n"),
    },
  });

  const installationList = await octokit.request("GET /app/installations");
  if (!installationList.data.length) {
    throw new Error("No installations found.");
  }

  const installationId = installationList.data[0].id;

  const authResponse = await octokit.request(
    `POST /app/installations/${installationId}/access_tokens`
  );
  const token = authResponse.data.token;

  const octokitWithAuth = new Octokit({ auth: token });

  const repoResponse = await octokitWithAuth.request(
    "GET /installation/repositories",
    { per_page: 100 }
  );

  return repoResponse.data; // <- chỉ trả về data
}
