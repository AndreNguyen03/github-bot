import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser, logOut } from "../../api";
import { User } from "../../types";

const Header: React.FC = () => {
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
  function handleGotoHistory() {
    navigate("../histories")
  }

  return (
    <header className="fixed left-0 top-0 z-50 w-full bg-blue-600 text-white shadow-md">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <div className="flex items-center space-x-2">
          <img
            src={user ? user.avatar : "/src/assets/img/userimg.png"}
            alt="Logo"
            className="h-8 w-8 rounded-full bg-gray-200"
          />
          <h3>{user?.username}</h3>
        </div>
        <h1 className="text-xl font-bold">GitHub Bot management</h1>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <a className="hover:underline" onClick={handleGotoListRepos}>
                Repository
              </a>
            </li>
            <li>
              <a className="hover:underline" onClick={handleGotoHistory}>
                History
              </a>
            </li>
            <li>
              <a href="#contact" className="hover:underline">
                About
              </a>
            </li>
            <li>
              <a className="hover:underline" onClick={handleLogOut}>
                Logout
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
