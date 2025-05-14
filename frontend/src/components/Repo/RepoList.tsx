// components/RepoList.tsx
import React from "react";
import { Repository, TempRepository } from "../../types";
import RepoItem from "./RepoItem";
import defineColorCard from "../utils/DefineColorCard";

type Props = {
  repositoriesListResponse: Repository[] | undefined;
  isCheckedMode: boolean;
  handleCheck: (repo: TempRepository) => void;
  selectedRepos: TempRepository[];
};

const RepoList: React.FC<Props> = ({
  repositoriesListResponse,
  isCheckedMode,
  handleCheck,
  selectedRepos,
}) => {
  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
        {repositoriesListResponse?.map((repo) => (
          <RepoItem
            color={defineColorCard(
              repo.hasBotConfig,
              repo.hasAccessiblePermissionBot,
            )}
            isCheckedMode={isCheckedMode}
            checked={selectedRepos.some((item) => item.id === repo.id)}
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
