import { useEffect, useState } from "react";
import { handleAPIGetRepositories } from "../../api";
import { Repository, TempRepository } from "../../types"; // Ensure this import is correct
import RepoList from "../../components/Repo/RepoList";
import { useNavigate } from "react-router-dom";

const RepositoryPage = () => {
  const [currentRepositories, setCurrentRepositories] = useState<Repository[]>(
    [],
  );
  const [selectedRepos, setSelectedRepos] = useState<TempRepository[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [isCheckedMode, setIsCheckedMode] = useState(false);

  //Phân trang
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const repositoriesPerPage = 12;
  const navigate = useNavigate();

  const fetchRepositories = async (page: number) => {
    const accessToken = localStorage.getItem("accessToken") || "";
    if (!accessToken) {
      setError("Không tìm thấy access token. Vui lòng đăng nhập lại.");
      setLoading(false);
      return;
    } // Ensure you have a way to get the access token
    try {
      setLoading(true);
      const result = await handleAPIGetRepositories(
        accessToken,
        repositoriesPerPage,
        page,
      );
      if (!result) {
        setError("Không thể lấy dữ liệu repository.");
        return;
      }
      const { repos, pagination } = result;
      if (!Array.isArray(repos)) {
        console.error("Invalid repository data received");
        return;
      }
      repos.map((repo) =>
        console.log(
          repo.full_name,
          repo.hasBotConfig,
          repo.hasAccessiblePermissionBot,
        ),
      );
      setCurrentRepositories(repos);
      setTotalPages(pagination.totalPages);
      setCurrentPage(pagination.currentPage);
      setError(null);
    } catch (err: unknown) {
      setError(
        `Lỗi khi lấy dữ liệu repositories: ${err instanceof Error ? err.message : String(err)}`,
      );
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchRepositories(currentPage);
  }, [currentPage]);
  const handleCheck = (repoParam: TempRepository) => {
    if (selectedRepos.some((repo) => repo.id === repoParam.id)) {
      setSelectedRepos(
        selectedRepos.filter((repo) => repo.id !== repoParam.id),
      );
    } else {
      setSelectedRepos([...selectedRepos, repoParam]);
    }
  };
  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
  };
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      // Hiển thị tất cả trang nếu tổng số trang ít
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Hiển thị trang đầu, trang cuối và một số trang ở giữa
      pages.push(1);

      if (currentPage > 3) {
        pages.push("...");
      }

      // Trang trước trang hiện tại
      if (currentPage > 2) {
        pages.push(currentPage - 1);
      }

      // Trang hiện tại nếu không phải trang đầu hoặc trang cuối
      if (currentPage !== 1 && currentPage !== totalPages) {
        pages.push(currentPage);
      }

      // Trang sau trang hiện tại
      if (currentPage < totalPages - 1) {
        pages.push(currentPage + 1);
      }

      if (currentPage < totalPages - 2) {
        pages.push("...");
      }

      pages.push(totalPages);
    }

    return pages;
  };
  return (
    <>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="sm: p-5">
          <h1 className="mb-4 text-2xl font-bold">Your GitHub Repositories</h1>
          <div className="inline-flex w-full items-center justify-between">
            <div className="flex gap-2">
              <h2 className="mb-4 text-2xl font-bold">Repositories</h2>
            </div>
            <div className="flex justify-between gap-4 text-gray-500">
              {isCheckedMode && (
                <h2>{selectedRepos?.length} repositories are selected</h2>
              )}

              <button
                className="mb-4 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                onClick={() => {
                  setIsCheckedMode(!isCheckedMode);
                  setSelectedRepos([]);
                }}
              >
                {isCheckedMode ? "Deselect" : "Select"}
              </button>
              {isCheckedMode && (
                <button
                  className={
                    "mb-4 rounded px-4 py-2" +
                    (selectedRepos.length > 0
                      ? " bg-green-400 text-white hover:bg-green-500"
                      : " bg-gray-400 text-gray-200")
                  }
                  onClick={() =>
                    navigate("/configuration", { state: selectedRepos })
                  }
                  disabled={selectedRepos.length === 0}
                >
                  Go to Config
                </button>
              )}
            </div>
          </div>
          {error && <h2>{error}</h2>}
          <h2 className="mb-2">{`${currentRepositories.length} repositories are found`}</h2>
          {currentRepositories.length > 0 ? (
            <RepoList
              repositoriesListResponse={currentRepositories}
              isCheckedMode={isCheckedMode}
              handleCheck={handleCheck}
              selectedRepos={selectedRepos}
            />
          ) : (
            <p>No repositories found.</p>
          )}
          <div className="mt-4 flex items-center justify-center space-x-5">
            <div>
              {totalPages > 1 && (
                <div className="pagination flex space-x-1">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="rounded-lg bg-blue-300 p-1 px-2 font-medium hover:bg-blue-500 hover:text-white disabled:bg-gray-500 disabled:text-white"
                  >
                    Previous
                  </button>

                  {getPageNumbers().map((page, index) =>
                    typeof page === "number" ? (
                      <button
                        key={index}
                        onClick={() => handlePageChange(page)}
                        disabled={currentPage === page}
                        className={` ${currentPage === page ? "disabled" : ""} rounded-lg bg-blue-300 p-1 px-2 font-medium hover:bg-blue-500 hover:text-white disabled:bg-blue-500 disabled:text-white`}
                      >
                        {page}
                      </button>
                    ) : (
                      <span key={index} className="ellipsis">
                        {page}
                      </span>
                    ),
                  )}

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="rounded-lg bg-blue-300 p-1 px-2 font-medium hover:bg-blue-500 hover:text-white disabled:bg-gray-500 disabled:text-white"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
            <h2 className="text-sm font-medium text-[11] text-gray-400">
              Now in {currentPage} of {totalPages}
            </h2>
          </div>
        </div>
      )}
    </>
  );
};

export default RepositoryPage;
