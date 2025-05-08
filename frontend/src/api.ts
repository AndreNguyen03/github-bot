import { Octokit } from "@octokit/rest";
import { RequestError } from "@octokit/request-error";
import {
  PushYamlParams,
  // PushYamlParams,
  RepositoryListResponse,
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
  } catch (err: unknown) {
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

export async function handleAPIGetRepositoriesByInstallationId(): Promise<
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

// export async function d({
//   accessToken,
//   repoOwnerName,
//   repoName,
//   branch,
//   filePath,
//   yamlContent,
// }: PushYamlPasrams) {
//   console.log(
//     "accessToken,repoUserName,repoName,yamlContent,path:",
//     accessToken,
//     repoUserName,
//     repoName,
//     yamlContent,
//     path,
//   );

//   const octokit = new Octokit({
//     auth: accessToken,
//   });

//   const contentBase64 = btoa(unescape(encodeURIComponent(yamlContent)));

//   try {
//     const responseexistRepo = await octokit.rest.repos.get({
//       owner: repoOwnerName,
//       repo: repoName,
//     });
//     console.log("OAuth scopes:", responseexistRepo.headers["x-oauth-scopes"]);
//     console.log("Repository tồn tại:", responseexistRepo.data);

//     // Kiểm tra sự tồn tại của thư mục .github
//     try {
//       const fileExistsResponse = await octokit.rest.repos.getContent({
//         owner: repoOwnerName,
//         repo: repoName,
//         path: ".github", // Kiểm tra thư mục .github
//       });

//       console.log("Thư mục .github đã tồn tại:", fileExistsResponse.data);
//     } catch (error: unknown) {
//       if (error instanceof RequestError && error.status === 404) {
//         // Nếu thư mục .github chưa tồn tại, chúng ta sẽ tạo thư mục này
//         console.log("Thư mục .github chưa tồn tại, tạo mới thư mục...");
//         await octokit.rest.repos.createOrUpdateFileContents({
//           owner: repoOwnerName,
//           repo: repoName,
//           path: ".github/.empty", // Tạo một file trống trong thư mục .github để tạo thư mục
//           message: "Tạo thư mục .github",
//           content: "", // File trống
//           branch: "main",
//         });
//       }
//     }

//     // Kiểm tra quyền truy cập
//     const permissions = responseexistRepo.data.permissions;
//     if (permissions?.push) {
//       console.log("Access token có quyền ghi vào repository.");

//       try {
//         // Tạo hoặc cập nhật file bot-config.yml
//         const response = await octokit.rest.repos.createOrUpdateFileContents({
//           owner: repoOwnerName,
//           repo: repoName,
//           path: path, // Đường dẫn tới file
//           message: "Tạo hoặc cập nhật file config.yml",
//           content: contentBase64,
//           branch: "main",
//         });

//         console.log(
//           "File đã được tạo hoặc cập nhật thành công:",
//           response.data,
//         );
//       } catch (error: unknown) {
//         console.error("Lỗi khi tạo hoặc cập nhật file:", error);
//       }
//     } else {
//       console.log("Access token không có quyền ghi vào repository.");
//     }
//   } catch (error: unknown) {
//     console.error("Không thể kiểm tra quyền truy cập:", error);
//   }
// }

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
  try {
    const octokit = new Octokit({ auth: accessToken });

    // Kiểm tra file đã tồn tại chưa để lấy sha
    let sha: string | undefined;
    try {
      const { data: fileData } = await octokit.repos.getContent({
        owner: repoOwnerName,
        repo: repoName,
        path: filePath,
        ref: branch,
      });

      if (!Array.isArray(fileData) && fileData.sha) {
        sha = fileData.sha;
      }
    } catch (err: unknown) {
      if (err instanceof RequestError && err.status !== 404) {
        throw err; // Chỉ bỏ qua nếu file chưa tồn tại
      }
    }

    // Encode nội dung YAML
    const contentBase64 = btoa(unescape(encodeURIComponent(yamlContent)));

    // Push file
    const result = await octokit.repos.createOrUpdateFileContents({
      owner: repoOwnerName,
      repo: repoName,
      path: filePath,
      message: "Update file .githu/bot-config.yml",
      content: contentBase64,
      branch: branch,
      sha,
    });

    return result;
  } catch (err: unknown) {
    if (err instanceof RequestError) {
      switch (err.status) {
        case 401:
          throw new Error(
            "⚠️ Unauthorized: Token không hợp lệ hoặc đã hết hạn.",
          );
        case 403:
          throw new Error("🚫 Forbidden: Không có quyền ghi vào repository.");
        case 404:
          throw new Error(
            "❓ Not Found: Không tìm thấy repository hoặc branch.",
          );
        default:
          throw new Error(`❌ GitHub API Error ${err.status}: ${err.message}`);
      }
    }
    throw err;
  }
}
