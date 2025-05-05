import { loginWithGitHub } from "../api";
const LoginPage = () => {
  return (
    <>
      <a onClick={() => loginWithGitHub()} className="text-blue-600 underline">
        Login with GitHub
      </a>
    </>
  );
};

export default LoginPage;
