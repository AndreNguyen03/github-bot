import React, { useEffect } from "react";
import { handleAPIGetRepositoriesByInstallationId } from "../../api";
import { Repository } from "../../types";

const InstallationPage = () => {
  const [repositories, setRepositories] = React.useState<Repository[]>([]);
  useEffect(() => {
    const handleGetInstallationList = async () => {
      const repos = await handleAPIGetRepositoriesByInstallationId();
      if (!repos) return;
      setRepositories(repos);
    };
    handleGetInstallationList();
  }, []);
  return (
    <div>
      {repositories.length > 0
        ? repositories.map((repo) => <div key={repo.id}>{repo.name}</div>)
        : "No repositories found."}
    </div>
  );
};

export default InstallationPage;
