import React from "react";
import { Repository } from "../../types";
interface ListRepositoriesPageProps {
  repositories: Repository[];
}
const ListRepositoriesPage: React.FC<ListRepositoriesPageProps> = ({
  repositories,
}) => {
  return (
    <div className="p-6">
      <h1 className="mb-4 text-2xl font-bold">Your GitHub Repositories</h1>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {repositories.map((repo) => (
          <div
            key={repo.id}
            className="rounded-2xl border p-4 shadow transition-all hover:shadow-lg"
          >
            <h2 className="text-xl font-semibold text-blue-600 hover:underline">
              <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
                {repo.full_name}
              </a>
            </h2>
            <p className="mb-2 mt-1 text-gray-700">
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
                  : " N/A"}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListRepositoriesPage;
