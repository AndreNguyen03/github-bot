import { useEffect, useState } from "react";
import { handleAPIGetRepositories } from "../../api";
import { Repository } from "../../types"; // Ensure this import is correct
import RepoList from "../../components/Repo/RepoList";
const RepositoryPage = () => {
  const [repositories, setRepositories] = useState<Repository[]>([]); // Explicitly define the type
  const [currentPage, setCurrentPage] = useState<number>(1);
  const repositoriesPerPage = 10;
  const indexOfLastRepo = currentPage * repositoriesPerPage;
  const indexOfFirstRepo = indexOfLastRepo - repositoriesPerPage;
  const currentRepos = repositories.slice(indexOfFirstRepo, indexOfLastRepo);
  const totalPages = Math.ceil(repositories.length / repositoriesPerPage);

  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const handleGetRepositories = async () => {
      const accessToken = localStorage.getItem("accessToken") || "";
      if (!accessToken) return; // Ensure you have a way to get the access token
      try {
        setLoading(true);
        const repos = await handleAPIGetRepositories(accessToken);
        if (!repos) return;
        if (!Array.isArray(repos)) {
          console.error("Invalid repository data received");
          return;
        }
        setRepositories(repos);
      } catch (err: unknown) {
        alert("Error fetching repositories: " + (err as string));
      } finally {
        setLoading(false);
      }
    };

    handleGetRepositories();
  }, []);
  return (
    <>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="p-6">
          <h1 className="mb-4 text-2xl font-bold">Your GitHub Repositories</h1>

          {repositories.length > 0 ? (
            <RepoList repositoriesListResponse={currentRepos} />
          ) : (
            <p>No repositories found.</p>
          )}
          <div className="mt-4 flex justify-center">
            <div>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    disabled={pageNum === currentPage}
                    style={{
                      margin: "0 4px",
                      padding: "4px 8px",
                      backgroundColor:
                        pageNum === currentPage ? "#007bff" : "#e0e0e0",
                      color: pageNum === currentPage ? "#fff" : "#000",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    {pageNum}
                  </button>
                ),
              )}
            </div>
            <h2 className="ml-4 text-lg font-semibold text-gray-400">
              Now in {currentPage} of {totalPages}
            </h2>
          </div>
        </div>
      )}
    </>
  );
};

export default RepositoryPage;
