import { Octokit } from "@octokit/rest";
import { RequestError } from "@octokit/request-error";

import {
  PushYamlParams,
  // PushYamlParams,
  RepositoryListResponse,
  RepositoryPageReponse,
  Result,
  User,
} from "./types";

// frontend/src/api.ts
export async function getCurrentUser(): Promise<User | null> {
  const res = await fetch("http://localhost:3001/api/user", {
    credentials: "include", // Quan trọng: để gửi session cookie
  });
  if (!res.ok) {
    return null;
  }
  const data = res.json();
  return data;
}

export function loginWithGitHub() {
  window.location.href = "http://localhost:3001/auth/github";
}

export async function logOut(): Promise<string> {
  const res = await fetch("http://localhost:3001/auth/logout", {
    method: "POST",
    credentials: "include",
  });
  const data = res.json();
  return data;
}

// export async function handleAPIGetBotRepositoriesConfig(accessToken: string) {
//   try {
//     if (!accessToken) return;
//     const userOctokit = new Octokit({
//       auth: accessToken,
//     });

//     // 1. Lấy danh sách repo mà GitHub App (bot) có quyền
//     const botAccessibleReposRes: RepositoryListResponse | undefined =
//       await handleGetAccessibleRepositoriesByInstallation();
//     const botAccessibleReposSet = new Set(
//       botAccessibleReposRes?.repositories.map((repo) => repo.full_name),
//     );
//     console.log(botAccessibleReposSet);

//     // 2. Lấy danh sách repo của user
//     const res = await userOctokit.rest.repos.listForAuthenticatedUser({
//       affiliation: "owner",
//       sort: "created",
//       direction: "desc",
//     });
//     if (res.status !== 200) {
//       throw new Error("Failed to fetch repositories");
//     }
//     const userRepos = res.data;

//     // 3. Duyệt từng repo để check:
//     // - Bot có quyền?
//     // - Có file bot-config.yml không?
//     const results = await Promise.all(
//       userRepos.map(async (repo) =>
//         limit(async () => {
//           const fullName = `${repo.owner.login}/${repo.name}`;
//           const hasAccessiblePermissionBot =
//             botAccessibleReposSet.has(fullName);
//           console.log(hasAccessiblePermissionBot, fullName);

//           let hasBotConfig = false;
//           try {
//             await userOctokit.rest.repos.getContent({
//               owner: repo.owner.login,
//               repo: repo.name,
//               path: ".github/bot-config.yml",
//             });
//             console.log("555");
//             hasBotConfig = true;
//           } catch (err: unknown) {
//             if (err instanceof RequestError && err.status === 404) {
//               hasBotConfig = false;
//             } else {
//               throw err;
//             }
//           }

//           return {
//             ...repo,
//             hasBotConfig,
//             hasAccessiblePermissionBot,
//           };
//         }),
//       ),
//     );
//     console.log(JSON.stringify(results));
//     return results as unknown as Repository;
//   } catch (err: unknown) {
//     if (err instanceof RequestError) {
//       switch (err.status) {
//         case 401:
//           // token hết hạn hoặc không hợp lệ
//           throw new Error(
//             "⚠️ Unauthorized: Phiên đăng nhập đã hết hạn hoặc token không hợp lệ.",
//           );
//         case 403:
//           throw new Error(
//             "🚫 Forbidden: Bạn không có quyền truy cập repositories này.",
//           );
//         default:
//           throw new Error(`GitHub API error ${err.status}: ${err.message}`);
//       }
//     }
//   }
// }

export async function handleAPIGetRepositories(
  accessToken: string,
  perPage: number = 100,
  pageNumber: number = 1,
): Promise<RepositoryPageReponse | undefined> {
  const url = `http://localhost:3001/api/repositories?accessToken=${accessToken}&perPage=${perPage}&page=${pageNumber}`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    return data as RepositoryPageReponse;
  } catch (err) {
    console.error("Error:", err);
    return undefined;
  }
}
export async function handleGetAccessibleRepositoriesByInstallation(): Promise<
  RepositoryListResponse | undefined
> {
  try {
    const res = await fetch(
      `http://localhost:3001/api/installations/repositories`,
      {
        method: "GET",
      },
    );
    if (!res.ok) {
      throw new Error("Failed to fetch installations");
    }
    const data = await res.json();
    return data as RepositoryListResponse;
  } catch (err: unknown) {
    console.error("Error fetching installations", err);
    if (err instanceof RequestError) {
      switch (err.status) {
        case 401:
          // token hết hạn hoặc không hợp lệ
          throw new Error(
            "⚠️ Unauthorized: Phiên đăng nhập đã hết hạn hoặc token không hợp lệ.",
          );
        case 403:
          throw new Error(
            "🚫 Forbidden: Bạn không có quyền truy cập repositories này.",
          );
        default:
          throw new Error(`GitHub API error ${err.status}: ${err.message}`);
      }
    }
  }
}

export default async function apiPushYamlToRepo({
  accessToken,
  repoOwnerName,
  repoName,
  yamlContent,
  filePath,
  branch = "main",
}: PushYamlParams) {
  console.log(
    "accessToken,repoUserName,repoName,yamlContent,path:",
    accessToken,
    repoOwnerName,
    repoName,
    yamlContent,
    filePath,
  );
  //const encodedYaml = encodeURIComponent(yamlContent);

  const apiUrl = `http://localhost:3001/api/bot/newconfig`;
  const res = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      accessToken: accessToken,
      repoOwnerName: repoOwnerName,
      repoName: repoName,
      yamlContent: yamlContent,
      filePath: filePath,
      branch: branch,
    }),
  });
  const data = res.json();
  console.log("✅ Kết quả phản hồi từ server:", data);
  return data; // nếu bạn muốn trả về true
}
