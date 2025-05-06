// import React, { useEffect } from "react";
// import { handleAPIGetRepositoriesByInstallationId } from "../../api";
// import { RepositoryListResponse } from "../../types";
// import RepoList from "../../components/RepoList";

// const InstallationPage = () => {
//   const [repositories, setRepositories] = React.useState<
//     RepositoryListResponse | undefined
//   >();
//   useEffect(() => {
//     const handleGetInstallationList = async () => {
//       const repos = await handleAPIGetRepositoriesByInstallationId();
//       if (!repos) return;
//       setRepositories(repos);
//     };
//     handleGetInstallationList();
//   }, []);
//   return (
//     <>
//       <h2 className="mb-4 text-2xl font-bold">Installation</h2>
//       <RepoList repositoriesListResponse={repositories} />;
//     </>
//   );
// };

// export default InstallationPage;
