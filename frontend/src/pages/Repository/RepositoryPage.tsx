import { useEffect, useState } from "react";
import { handleAPIGetRepositories } from "../../api";
import { Repository } from "../../types"; // Ensure this import is correct
const RepositoryPage = () => {
  const [repositories, setRepositories] = useState<Repository[]>([]); // Explicitly define the type

  useEffect(() => {
    const handleGetRepositories = async () => {
      const accessToken = localStorage.getItem("accessToken") || "";
      if (!accessToken) return; // Ensure you have a way to get the access token
      try {
        const repos = await handleAPIGetRepositories(accessToken);
        if (!repos) return;
        if (!Array.isArray(repos)) {
          console.error("Invalid repository data received");
          return;
        }
        setRepositories(repos);
      } catch (err: unknown) {
        alert("Error fetching repositories: " + (err as string));
      }
    };

    handleGetRepositories();
  }, []);
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Your GitHub Repositories</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {repositories.map((repo) => (
          <div
            key={repo.id}
            className="border rounded-2xl shadow p-4 hover:shadow-lg transition-all"
          >
            <h2 className="text-xl font-semibold text-blue-600 hover:underline">
              <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
                {repo.full_name}
              </a>
            </h2>
            <p className="text-gray-700 mt-1 mb-2">
              {repo.description || "No description provided."}
            </p>
            <div className="text-sm text-gray-500">
              <div>
                ⭐ {repo.stargazers_count} | 🍴 {repo.forks_count}
              </div>
              <div>🔒 {repo.private ? "Private" : "Public"}</div>
              <div>🛠 Language: {repo.language || "N/A"}</div>
              <div>
                📅 Updated:{" "}
                {repo.updated_at
                  ? new Date(repo.updated_at).toLocaleDateString()
                  : "N/A"}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RepositoryPage;
