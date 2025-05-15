import { useState } from "react";
import { Repo } from "../../types";

const UsedRepositories: React.FC<{
  isEditMode: boolean;
  repos: Repo[];
  handleDeleteRepo: (id: string) => void;
}> = ({ repos, handleDeleteRepo, isEditMode }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedRepoId, setSelectedRepoId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleDeleteClick = (id: string) => {
    setSelectedRepoId(id);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    if (selectedRepoId) {
      setIsLoading(true);
      try {
        handleDeleteRepo(selectedRepoId);
        setShowModal(false);
      } finally {
        setIsLoading(false);
        setSelectedRepoId(null);
      }
    }
  };

  return (
    <div className="relative w-[25rem] rounded-[1rem] bg-gray-100 p-5">
      {!isEditMode && (
        <div className="pointer-events-auto absolute inset-0 z-10 rounded-[1rem] bg-black/10" />
      )}
      <h2 className="mb-4 text-xl font-bold">Used Repositories</h2>
      <ul className="space-y-2">
        {repos.map((repo) => (
          <li
            key={repo.id}
            className="relative rounded bg-white px-3 py-2 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div
                key={repo.id}
                className="jus flex items-start gap-4 rounded-xl"
              >
                <img
                  src={repo.owner.avatar_url}
                  alt={repo.owner.login}
                  className="h-12 w-12 rounded-full"
                />
                <div>
                  <a
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xl font-semibold text-blue-600 hover:underline sm:text-lg"
                  >
                    {repo.full_name}
                  </a>
                  <p className="text-sm text-gray-600">
                    {repo.description || "No description"}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    Owner:{" "}
                    <a href={repo.owner.html_url} className="hover:underline">
                      {repo.owner.login}
                    </a>
                  </p>
                </div>
              </div>

              {isEditMode && (
                <button
                  className="rounded bg-red-500 px-2 py-1 text-sm text-white hover:bg-red-600"
                  onClick={() => handleDeleteClick(repo.id)}
                >
                  Delete
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-[20rem] rounded-lg bg-white p-6 shadow-xl">
            <h3 className="mb-4 text-lg font-semibold">Confirm Deletion</h3>
            <p className="mb-6 text-sm text-gray-600">
              Are you sure you want to delete this repository?
            </p>
            <div className="flex justify-end gap-4">
              <button
                className="rounded bg-gray-300 px-4 py-2 text-sm text-gray-800 hover:bg-gray-400"
                onClick={() => {
                  setShowModal(false);
                  setSelectedRepoId(null);
                }}
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                className="flex items-center gap-2 rounded bg-red-500 px-4 py-2 text-sm text-white hover:bg-red-600"
                onClick={confirmDelete}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Deleting...
                  </>
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default UsedRepositories;
