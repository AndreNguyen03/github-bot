import { useEffect, useState } from "react";
import { User } from "./types";
import { getCurrentUser, loginWithGitHub, logOut } from "./api";

import { Octokit } from "@octokit/rest";

function App() {
  const [user, setUser] = useState<User | null>();

  const fetchUser = async () => {
    const curUser = await getCurrentUser();
    if (curUser) setUser(curUser);
    else setUser(null);
  };

  useEffect(() => {
    fetchUser();
  }, []);
  const handleLogOut = async () => {
    const message = await logOut();
    console.log(message);
    fetchUser();
  };
  const handleAccessRepositories = async () => {
    const octokit = new Octokit({
      auth: user?.accessToken, // lấy từ OAuth
    });
    const res = await octokit.rest.repos.listForAuthenticatedUser();
    console.log("repo", res.data);
  };
  return (
    <>
      <a onClick={() => loginWithGitHub()} className="text-blue-600 underline">
        Login with GitHub
      </a>
      <a onClick={() => handleLogOut()} className="text-blue-600 underline">
        Logout
      </a>
      <a
        onClick={() => handleAccessRepositories()}
        className="text-blue-600 underline"
      >
        repos
      </a>

      {user ? (
        <>
          <div>
            {user.id}-{user.username}
          </div>
          <img src={user.avatar} alt="Avatar" />
        </>
      ) : (
        <div>Chưa đăng nhập</div>
      )}
    </>
  );
}

export default App;
