import React from "react";
import { useNavigate } from "react-router-dom";
import clsx from "clsx";
import { BotConfig } from "../../types";
import { formatDateTime } from "../utils/FormatDateTime";

interface RepoItemProps {
  config: BotConfig;
}
const borderColorMap: Record<string, string> = {
  red: "border-red-500",
  green: "border-green-500",
  blue: "border-gray-500",
  yellow: "border-yellow-500",
};

const textColorMap: Record<string, string> = {
  red: "text-red-500",
  green: "text-green-500",
  blue: "text-gray-500",
  yellow: "text-yellow-500",
};

const textNotiContentMap: Record<string, string> = {
  red: "my bot has not been granted access 😭",
  green: "my bot is working 😋",
  gray: "",
  yellow: "my bot: Looks like bot-config is lost ⚠️",
};

const textHoverButtonMap: Record<string, string> = {
  red: "grant permission to bots",
  green: "It's ok",
  gray: "Wake up the bot",
  yellow: "Add a bot-config.yml",
};
const nextActionURL: Record<string, string> = {
  red: "https://github.com/settings/installations/63553557",
  green: "",
  gray: "/configuration",
  yellow: "/configuration",
};
const RepoItem: React.FC<RepoItemProps> = ({ config }) => {
  // const navigate = useNavigate();
  return (
    <div
      className={clsx(
        `mb-4 inline-flex w-full items-center justify-between rounded-lg border-[2px] bg-white p-4 shadow-xl transition-transform duration-200 hover:translate-y-[-2px]`,
      )}
    >
      <div key={config._id} className="jus flex items-start gap-4 rounded-xl">
        <div className="flex min-w-20 flex-col items-center space-y-4">
          <div className="flex flex-col space-y-2">
            {/* <TempBadge
              color={repo.hasAccessiblePermissionBot ? "green" : "red"}
              content="Bot Access"
              onClick={() =>
                window.open(
                  `https://github.com/settings/installations/63553557`,
                )
              }
            /> */}
          </div>
        </div>
        <div>
          <a
            //href={repo.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="lg:text-md text-md font-semibold text-blue-600 hover:underline sm:text-sm md:text-sm"
          >
            {config.configName}
          </a>
          <p className="text-sm text-gray-600">{}</p>
          <p className="mt-1 text-xs text-gray-500">Owner: {config.botAppId}</p>
          <p className="mt-1 text-xs font-bold text-gray-900">
            Created at:{" "}
            {formatDateTime(config.createdAt.toDateString() || "undefined")}
          </p>
          <p
            className={clsx(
              "mt-1 text-xs font-bold tracking-normal text-gray-900 hover:cursor-pointer hover:underline",
            )}
            // title={}
          ></p>
        </div>
      </div>
      {/* {isCheckedMode && (
        <div className="mt-2">
          <label className="flex items-center">
            <input
              type="checkbox"
              className="mr-4 h-4"
              checked={checked}
              onChange={() => {
                handleCheck({
                  id: repo.id,
                  name: repo.name,
                  owner: repo.owner,
                  html_url: repo.html_url,
                  created_at: repo.created_at,
                });
              }}
            />
          </label>
        </div>
      )} */}
    </div>
  );
};

export default RepoItem;
