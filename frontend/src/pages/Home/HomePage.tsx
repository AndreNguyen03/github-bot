import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { User } from "../../types";
import { getCurrentUser, logOut } from "../../api";
const HomePage = () => {
  const [user, setUser] = useState<User | null>();
  const navigate = useNavigate();
  const fetchUser = async () => {
    const curUser = await getCurrentUser();
    if (curUser) {
      setUser(curUser);
      localStorage.setItem("accessToken", curUser.accessToken);
    } else {
      setUser(null);
      navigate("../login");
      localStorage.removeItem("accessToken");
      alert(
        "Phiên đăng nhập đã hết hạn hoặc không hợp lệ. Vui lòng đăng nhập lại.",
      );
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);
  const handleLogOut = async () => {
    const message = await logOut();
    alert(message);
    fetchUser();
  };
  const handleGotoListRepos = () => {
    navigate("../repositories");
  };
  const handleGotoListInstallation = () => {
    navigate("../installation");
  };
  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <a onClick={() => handleLogOut()} className="text-blue-600 underline">
        Logout
      </a>
      <a
        onClick={() => handleGotoListRepos()}
        className="text-blue-600 underline"
      >
        List Repositories
      </a>
      <a
        onClick={() => handleGotoListInstallation()}
        className="text-blue-600 underline"
      >
        List Installation
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
    </div>
  );
};

export default HomePage;
