// components/RepoList.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { Repository } from "../../types";
import RepoItem from "./RepoItem";

type Props = {
  repositoriesListResponse: Repository[] | undefined;
};

const RepoList: React.FC<Props> = ({ repositoriesListResponse }) => {
  const navigate = useNavigate();
  const [isCheckedMode, setIsCheckedMode] = React.useState(false);
  const [selectedRepos, setSelectedRepos] = React.useState<string[]>([]);
  const handleCheck = (repoId: string) => {
    if (selectedRepos.includes(repoId)) {
      setSelectedRepos(selectedRepos.filter((id) => id !== repoId));
    } else {
      setSelectedRepos([...selectedRepos, repoId]);
    }
  };
  return (
    <div className="p-4">
      <div className="mb-4 inline-flex w-full items-center justify-between">
        <h2 className="mb-4 text-2xl font-bold">Repositories</h2>
        <div className="flex items-end items-center justify-between gap-4 text-gray-500">
          {isCheckedMode && (
            <h2>{selectedRepos?.length} Repositories are selected</h2>
          )}

          <button
            className="mb-4 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            onClick={() => setIsCheckedMode(!isCheckedMode)}
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
      <div className="grid gap-4 md:grid-cols-2">
        {repositoriesListResponse?.map((repo) => (
          <RepoItem
            isCheckedMode={isCheckedMode}
            checked={selectedRepos.includes(repo.id.toString())}
            repo={repo}
            key={repo.id}
            handleCheck={handleCheck}
          />
        ))}
      </div>
    </div>
  );
};

export default RepoList;
