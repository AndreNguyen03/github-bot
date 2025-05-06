import { Octokit } from "@octokit/rest";
import { RequestError } from "@octokit/request-error";
import { Repository, User } from "./types";

// frontend/src/api.ts
export async function getCurrentUser(): Promise<User | null> {
  const res = await fetch("http://localhost:3001/api/user", {
    credentials: "include", // Quan trọng: để gửi session cookie
  });
  if (!res.ok) {
    return null;
  }
  const data = res.json();``
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

export async function handleAPIGetRepositories(accessToken: string) {
  try {
    if (!accessToken) return;
    const octokit = new Octokit({
      auth: accessToken,
    });
    const res = await octokit.rest.repos.listForAuthenticatedUser();
    if (res.status !== 200) {
      throw new Error("Failed to fetch repositories");
    }
    return res.data;
  } catch (err: any) {
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

// export async function handleAPIGetInstallationListForUser(accessToken: string) {
//   try {
//     if (!accessToken) return;
//     const octokit = new Octokit({
//       auth: accessToken,
//     });
//     const res = await octokit.rest.apps.listInstallationsForAuthenticatedUser();
//     if (res.status !== 200) {
//       throw new Error("Failed to fetch installations");
//     }
//     return res.data;
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

export async function handleAPIGetRepositoriesByInstallationId(): Promise<
  Repository[] | undefined
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

    return data.repositories as Repository[];
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
