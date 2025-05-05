import React from "react";
import { Repository } from "../../types";

interface RepoItemProps {
  repo: Repository;
  isCheckedMode: boolean;
  checked: boolean;
  handleCheck: (repoId: string) => void;
}
const RepoItem: React.FC<RepoItemProps> = ({
  repo,
  checked,
  handleCheck,
  isCheckedMode,
}) => {
  return (
    <div className="mb-4 inline-flex w-full items-center justify-between rounded-lg bg-white p-4 shadow shadow-md">
      <div key={repo.id} className="jus flex items-start gap-4 rounded-xl">
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
            className="text-xl font-semibold text-blue-600 hover:underline"
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
      {isCheckedMode && (
        <div className="mt-2">
          <label className="flex items-center">
            <input
              type="checkbox"
              className="mr-2"
              checked={checked}
              onChange={() => {
                handleCheck(repo.id.toString());
              }}
            />
          </label>
        </div>
      )}
    </div>
  );
};

export default RepoItem;
