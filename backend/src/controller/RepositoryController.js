import { RequestError } from "@octokit/request-error";
import { Octokit } from "@octokit/rest";
import { fetchRepositoriesFromInstallation } from "../service/InstallationService.js";
import pLimit from "p-limit";
const limit = pLimit(20);
class RepositoryController {
  async getRepositories(req, res) {
    try {
      //console.log(req.query);
      const accessToken = req.query.accessToken;
      const perPage = parseInt(req.query.perPage);
      const pageNumber = parseInt(req.query.page);

      if (!accessToken) {
        return res.status(400).json({ error: "Missing access token" });
      }

      const userOctokit = new Octokit({ auth: accessToken });

      // Lấy các repo mà bot có quyền truy cập
      let botAccessibleRepos;
      try {
        botAccessibleRepos = await fetchRepositoriesFromInstallation();
      } catch (err) {
        console.error("Error fetching repositories", err);
      }
      const botAccessibleReposSet = new Set(
        botAccessibleRepos?.repositories.map((repo) => repo.full_name)
      );

      // Lấy danh sách repo mà user sở hữu
      const resRepos = await userOctokit.rest.repos.listForAuthenticatedUser({
        affiliation: "owner",
        sort: "created",
        direction: "desc",
        per_page: perPage,
        page: pageNumber,
      });

      if (resRepos.status !== 200) {
        return res.status(500).json({ error: "Failed to fetch repositories" });
      }

      const linkHeader = resRepos.headers.link || "";
      const lastPageMatch = linkHeader.match(/page=(\d+)>; rel="last"/);
      const totalPages = lastPageMatch
        ? parseInt(lastPageMatch[1])
        : pageNumber;

      // Bước 1: Kiểm tra bot có quyền truy cập repo không
      const resultsAccessible = await Promise.all(
        resRepos.data.map((repo) =>
          limit(async () => ({
            ...repo,
            hasAccessiblePermissionBot: botAccessibleReposSet.has(
              repo.full_name
            ),
          }))
        )
      );

      // Bước 2: Kiểm tra có file bot-config không
      const AppId = process.env.APP_ID; // Hoặc bạn truyền AppId từ config
      const resultsConfigCheck = await Promise.all(
        resultsAccessible.map((repo) =>
          limit(async () => {
            if (repo.size === 0) return { ...repo, hasBotConfig: false };

            try {
              const result = await userOctokit.request(
                "GET /repos/{owner}/{repo}/contents/{path}",
                {
                  owner: repo.owner.login,
                  repo: repo.name,
                  path: `.github/bot-config-${AppId}.yml`,
                }
              );
              return { ...repo, hasBotConfig: !!result };
            } catch {
              return { ...repo, hasBotConfig: false };
            }
          })
        )
      );
      //   resultsConfigCheck.map((repo) =>
      //     console.log(
      //       repo.full_name,
      //       repo.hasAccessiblePermissionBot,
      //       repo.hasBotConfig
      //     )
      //   );
      return res.json({
        repos: resultsConfigCheck,
        pagination: {
          currentPage: pageNumber,
          perPage: perPage,
          totalPages: totalPages,
        },
      });
    } catch (err) {
      if (err instanceof RequestError) {
        const status = err.status;
        if (status === 401) {
          return res.status(401).json({
            error: "⚠️ Unauthorized: Token hết hạn hoặc không hợp lệ.",
          });
        }
        if (status === 403) {
          return res.status(403).json({
            error:
              "🚫 Forbidden: Bạn không có quyền truy cập repositories này.",
          });
        }
        return res
          .status(500)
          .json({ error: `GitHub API error ${status}: ${err.message}` });
      }
      console.error("Unexpected error:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
}
export default new RepositoryController();
