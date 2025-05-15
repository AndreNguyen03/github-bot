import React from "react";
import { HistoryConfig } from "../../types";
import { useNavigate } from "react-router-dom";

interface Props {
  history: HistoryConfig;
}

const HistoryItem: React.FC<Props> = ({ history }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/configuration-history", { state: history });
  };

  return (
    <div
      onClick={handleClick}
      className="mb-4 inline-flex w-full cursor-pointer items-center justify-between rounded-lg bg-white p-4 shadow-md transition-transform duration-300 hover:translate-y-[-5px] hover:shadow-lg"
    >
      <div className="flex w-full items-center justify-between gap-4 rounded-xl">
        <div>
          <h3 className="text-xl font-semibold text-blue-600 sm:text-lg">
            {history.name}
          </h3>
          <p className="text-sm text-gray-600">
            {new Date(history.uploadedAt).toDateString()}
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Number repository used: {history.usedRepos.length}
          </p>
        </div>
        <button className="rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600">
          Delete
        </button>
      </div>
    </div>
  );
};

export default HistoryItem;
