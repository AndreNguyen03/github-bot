import { useState } from "react";
import { useLocation } from "react-router-dom";
import { TempRepository } from "../../types";

import FormConfiguration from "../../components/Configuration/FormConfiguration";
import ListRepoSelected from "../../components/Configuration/ListRepoSelected";

const ConfigurationPage = () => {
  const location = useLocation();

  const [selectedRepos, setSelectedRepos] = useState(
    location.state as TempRepository[],
  );
  const isSelectedReposEmpty = selectedRepos.length <= 0;
  //console.log("Selected Repositories:", selectedRepos);
  const handleDeleteSelectedRepos = (deletingRepo: TempRepository) => {
    setSelectedRepos((selectedRepos) =>
      selectedRepos
        ? selectedRepos.filter((repo) => repo.id !== deletingRepo.id)
        : [],
    );
  };
  return (
    <div className="mb-4 flex h-full w-full flex-col justify-between">
      <div className="mb-4 flex justify-between">
        <div className="flex">
          <h2 className="inline-block text-2xl font-bold">Configuration</h2>
        </div>
      </div>
      <div
        className={`grid ${isSelectedReposEmpty ? "grid-cols-1" : "sm:grid-cols-1 lg:grid-cols-3"} gap-6`}
      >
        <div>
          <ListRepoSelected
            selectedRepos={selectedRepos}
            deleteSelectedRepos={handleDeleteSelectedRepos}
          />
        </div>
        <div>
          {/* Middle Section */}
          {!isSelectedReposEmpty && (
            <FormConfiguration selectedRepos={selectedRepos} />
          )}
        </div>
        <div>
          {/* Right Section */}
          {!isSelectedReposEmpty && <p>Right Section</p>}
        </div>
      </div>
    </div>
  );
};

export default ConfigurationPage;
