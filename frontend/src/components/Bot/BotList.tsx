// components/RepoList.tsx
import React from "react";
import { BotConfig } from "../../types";
import BotItem from "./BotItem";

type Props = {
  botConfigsResponse: BotConfig[] | undefined;
};

const BotList: React.FC<Props> = ({ botConfigsResponse }) => {
  console.log("bot list get item");
  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
        {botConfigsResponse?.map((config) => (
          <BotItem config={config} key={config._id} />
        ))}
      </div>
    </div>
  );
};

export default BotList;
