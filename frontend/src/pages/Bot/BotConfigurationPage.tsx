import { useEffect, useState } from "react";
import { BotConfig, BotInfo } from "../../types";
import { botConfigsData } from "../../tempData";
import BotList from "../../components/Bot/BotList";
import BotNotFound from "../../components/Bot/BotNotFound";
import { botInfoE } from "../../tempData";
import BotInfoComponent from "../../components/Bot/BotInfo";
export default function BotConfigurationPage() {
  const [loading, setLoading] = useState<boolean>(true);
  const [currentConfigs, setCurrentConfigs] = useState<BotConfig[]>([]);
  const [currentBotInfo, setCurrentBotInfo] = useState<BotInfo | undefined>();
  //Phân trang
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const repositoriesPerPage = 20;

  //Sub

  const fetchBotConfigs = async () => {
    setCurrentConfigs([]);
    if (botInfoE) setCurrentBotInfo(botInfoE);
  };
  useEffect(() => {
    setLoading(true);
    fetchBotConfigs();
    setLoading(false);
  }, []);
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
  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
  };
  console.log("co gi koc", currentBotInfo);
  return (
    <>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="sm: p-5">
          <div className="inline-flex w-full items-center justify-between">
            <div className="flex gap-2">
              <h2 className="mb-4 text-2xl font-bold">Configurations</h2>
            </div>
          </div>
          <BotInfoComponent bot={currentBotInfo} />
          {currentBotInfo && currentConfigs.length > 0 ? (
            <>
              <div className="flex gap-2">
                <button
                  className="mb-4 rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600"
                  onClick={() => {
                    // TODO: Open add bot modal
                    alert("Add bot functionality coming soon!");
                  }}
                >
                  Add Bot
                </button>
                <button
                  className="mb-4 rounded bg-yellow-500 px-4 py-2 text-white hover:bg-yellow-600"
                  onClick={() => {
                    // TODO: Open edit bot modal (select bot first)
                    alert("Edit bot functionality coming soon!");
                  }}
                >
                  Edit Bot
                </button>
                <button
                  className="mb-4 rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
                  onClick={() => {
                    // TODO: Delete selected bot (select bot first)
                    alert("Delete bot functionality coming soon!");
                  }}
                >
                  Delete Bot
                </button>
              </div>
              <h2 className="mb-2">{`${currentConfigs.length} configs are found`}</h2>
              <BotList botConfigsResponse={currentConfigs} />
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
            </>
          ) : (
            <BotNotFound />
          )}
        </div>
      )}
    </>
  );
}
