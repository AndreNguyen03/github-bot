import React from "react";
import { TempRepository } from "../../types";
import { formatDateTime } from "../utils/FormatDateTime";

const RepositoryCard = ({
  repo,
  deleteSelectedRepos,
}: {
  repo: TempRepository;
  deleteSelectedRepos: (deletingRepo: TempRepository) => void;
}) => {
  const handleDeleteRepo = () => {
    if (
      !window.confirm(
        `Are you sure you want to delete "${repo.owner.login + "/" + repo.name}" repository?`,
      )
    ) {
      return;
    }
    deleteSelectedRepos(repo);
  };
  return (
    <div
      key={repo.id}
      className="flex w-full items-center justify-between overflow-hidden rounded-[0.5rem] bg-white p-2 px-4 pr-3 shadow-md transition-transform duration-200 hover:translate-y-[-2px]"
    >
      <div>
        <div className="flex">
          <img
            src={repo.owner.avatar_url}
            alt={`${repo.owner.login}'s avatar`}
            className="mr-2 h-6 w-6 rounded-full"
          />
          <a
            href={repo.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="cursor-pointer text-blue-500 underline hover:text-blue-700 sm:text-lg lg:text-sm"
          >
            {repo.owner.login}/{repo.name}
          </a>
        </div>
        <div className="mt-2 flex items-center gap-4">
          <div className="text-[12px] font-semibold">
            Owner:{" "}
            <a
              href={repo.owner.html_url}
              className="cursor-pointer hover:underline"
            >
              {repo.owner.login}
            </a>
          </div>

          <a className="text-[11px] font-semibold text-gray-600">
            Created at: {formatDateTime(repo.created_at || "")}
          </a>
        </div>
      </div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        className="h-6 w-6 rounded-md text-red-600 hover:bg-red-500 hover:text-white"
        onClick={() => handleDeleteRepo()}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6 18 18 6M6 6l12 12"
        />
      </svg>
    </div>
  );
};

export default RepositoryCard;
