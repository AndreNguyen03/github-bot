import { useState } from "react";
import { TempRepository } from "../../types";
import RepositoryCard from "./RepositoryCard";
import { useNavigate } from "react-router-dom";

const ListRepoSelected = ({
  selectedRepos,
  deleteSelectedRepos,
}: {
  selectedRepos: TempRepository[];
  deleteSelectedRepos: (deletingRepo: TempRepository) => void;
}) => {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();

  const isSelectedReposEmpty = selectedRepos.length > 0!;
  return (
    <div>
      <div>
        {isSelectedReposEmpty ? (
          <button
            className={`flex w-full items-center justify-center gap-2 rounded ${open ? "bg-gray-300" : "bg-gray-100"} py-1 text-black ${open ? "hover:bg-gray-300" : "hover:bg-gray-200"}`}
            onClick={() => setOpen((open) => !open)}
          >
            {open ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                className="h-5 w-5 font-bold text-green-500"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="m19.5 8.25-7.5 7.5-7.5-7.5"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                className={"h-5 w-5"}
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="m8.25 4.5 7.5 7.5-7.5 7.5"
                />
              </svg>
            )}
            You chose <a className="font-bold">{selectedRepos.length}</a>
            repositories
          </button>
        ) : (
          <button
            className={`flex w-full items-center justify-center gap-2 rounded bg-blue-500 py-1 text-black text-white hover:bg-blue-600`}
            onClick={() => navigate("/repositories")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              className="h-5 w-5"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M15.75 19.5 8.25 12l7.5-7.5"
              />
            </svg>
            Go to Repository
          </button>
        )}
      </div>
      {open && selectedRepos.length > 0 && (
        <div className="flex flex-col gap-3 rounded-b-lg bg-gray-100 p-5">
          {selectedRepos.map((repo) => (
            <RepositoryCard
              repo={repo}
              deleteSelectedRepos={deleteSelectedRepos}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ListRepoSelected;
