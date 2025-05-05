import { loginWithGitHub } from "../api";
const LoginPage = () => {
  return (
    <div className="flex flex-col items-center justify-center p-16">
      <div className="py-4">
        <img src="/src/assets/img/botlogo.png" />
      </div>
      <button
        className="rounded bg-gray-700 px-4 py-2 text-white hover:bg-gray-600"
        onClick={() => loginWithGitHub()}
      >
        Login with GitHub
      </button>
    </div>
  );
};

export default LoginPage;
