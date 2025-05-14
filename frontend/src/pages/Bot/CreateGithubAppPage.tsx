import { useState, useEffect } from "react";

// Định nghĩa interface cho GitHub Manifest
interface GitHubManifest {
  name: string;
  url: string;
  hook_attributes: {
    url: string;
  };
  redirect_url: string;
  description: string;
  public: boolean;
  default_permissions: {
    [key: string]: "read" | "write" | "admin";
  };
  default_events: string[];
}

export default function GitHubAppCreator() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [installation, setInstallation] = useState<{
    id: string;
    app_id: string;
    app_slug: string;
  } | null>(null);

  // GitHub app manifest - định nghĩa các thuộc tính của ứng dụng
  const manifest = {
    name: "My GitHub App",
    url: "https://example.com", // Trang chính của GitHub App
    hook_attributes: {
      url: "https://example.com/webhook", // Webhook nhận sự kiện
    },
    redirect_url: "http://localhost:5173/bot/newapp",
    public: true,
    default_permissions: {
      issues: "write",
      pull_requests: "write",
      contents: "read",
    },
    default_events: ["issues", "issue_comment", "pull_request", "push"],
    description: "A GitHub App created with React and Tailwind",
  };

  // Kiểm tra thông tin cài đặt từ callback URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const appId = urlParams.get("app_id");
    const installationId = urlParams.get("installation_id");
    const appSlug = urlParams.get("app_slug");

    if (appId && installationId && appSlug) {
      setInstallation({
        id: installationId,
        app_id: appId,
        app_slug: appSlug,
      });
    }
  }, []);

  const createGitHubApp = async (): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      // Lưu manifest vào localStorage để có thể truy cập sau khi redirect
      localStorage.setItem("github_app_manifest", JSON.stringify(manifest));

      // Mã hóa manifest thành base64 để truyền qua URL
      const encodedManifest = btoa(
        encodeURIComponent(JSON.stringify(manifest)),
      );
      // Chuyển hướng người dùng đến GitHub với manifest được mã hóa
      window.location.href = `https://github.com/settings/apps/new?manifest=${encodedManifest}`;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error occurred");
      setIsLoading(false);
    }
  };

  // Xử lý cài đặt app ở repository sau khi app được tạo
  const installApp = () => {
    if (installation) {
      window.location.href = `https://github.com/apps/${installation.app_slug}/installations/new`;
    }
  };

  // Xem cấu hình app
  const viewAppConfig = () => {
    if (installation) {
      window.open(
        `https://github.com/settings/apps/${installation.app_slug}`,
        "_blank",
      );
    }
  };

  // Nếu đã có installation data (trạng thái sau redirect từ GitHub)
  if (installation) {
    return (
      <div className="mx-auto mt-10 max-w-md rounded-lg bg-white p-6 shadow-md">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <svg
              className="h-6 w-6 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
          </div>
          <h2 className="mt-4 text-lg font-medium text-gray-900">
            GitHub App đã được tạo thành công!
          </h2>
          <p className="mt-2 text-gray-600">App ID: {installation.app_id}</p>
          <p className="mt-1 text-gray-600">
            Installation ID: {installation.id}
          </p>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              onClick={viewAppConfig}
              className="rounded bg-gray-800 px-4 py-2 font-medium text-white transition duration-200 hover:bg-gray-900"
            >
              Xem cấu hình
            </button>
            <button
              onClick={installApp}
              className="rounded bg-blue-600 px-4 py-2 font-medium text-white transition duration-200 hover:bg-blue-700"
            >
              Cài đặt App
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto mt-10 max-w-md rounded-lg bg-white p-6 shadow-md">
      <h1 className="mb-6 text-2xl font-bold text-gray-800">Tạo GitHub App</h1>

      <div className="mb-6">
        <h2 className="mb-2 text-lg font-semibold">Cấu hình App</h2>
        <div className="rounded border bg-gray-50 p-4">
          <p className="mb-1 text-sm text-gray-600">
            <span className="font-medium">Name:</span> {manifest.name}
          </p>
          <p className="mb-1 text-sm text-gray-600">
            <span className="font-medium">Description:</span>{" "}
            {manifest.description}
          </p>
          <p className="mb-1 text-sm text-gray-600">
            <span className="font-medium">Webhook URL:</span>{" "}
            {manifest.hook_attributes.url}
          </p>
          <p className="mb-1 text-sm text-gray-600">
            <span className="font-medium">Permissions:</span>
          </p>
          <ul className="list-disc pl-5 text-sm text-gray-600">
            {Object.entries(manifest.default_permissions).map(
              ([key, value]) => (
                <li key={key}>
                  {key}: {value}
                </li>
              ),
            )}
          </ul>
          <p className="mb-1 mt-2 text-sm text-gray-600">
            <span className="font-medium">Events:</span>
          </p>
          <ul className="list-disc pl-5 text-sm text-gray-600">
            {manifest.default_events.map((event) => (
              <li key={event}>{event}</li>
            ))}
          </ul>
        </div>
      </div>

      <button
        onClick={createGitHubApp}
        disabled={isLoading}
        className="w-full rounded bg-blue-600 px-4 py-2 font-medium text-white transition duration-200 hover:bg-blue-700 disabled:opacity-50"
      >
        {isLoading ? (
          <span className="flex items-center justify-center">
            <svg
              className="-ml-1 mr-2 h-4 w-4 animate-spin text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Đang xử lý...
          </span>
        ) : (
          "Tạo GitHub App"
        )}
      </button>

      {error && (
        <div className="mt-4 rounded border border-red-200 bg-red-50 p-3 text-red-700">
          {error}
        </div>
      )}
    </div>
  );
}
