// import { createContext, useContext } from "react";
// import { BotConfig, FeatureConfig, SubFeatureConfig } from "../types";

// type BotConfigAction =
//   | { type: "TOGGLE_FEATURE"; feature: keyof BotConfig; value: boolean }
//   | {
//       type: "UPDATE_SUBFEATURE";
//       feature: keyof BotConfig;
//       subFeature: keyof FeatureConfig;
//       payload: Partial<SubFeatureConfig>;
//     };
// interface BotConfigContextType {
//   state: BotConfig;
//   dispatch: React.Dispatch<BotConfigAction>;
// }
// const BotConfigContext = createContext<BotConfigContextType | undefined>(
//   undefined,
// );
// function useBotConfig() {
//   const context = useContext(BotConfigContext);
//   if (context === undefined) {
//     throw new Error("useBotConfig must be used within a BotConfigProvider");
//   }
//   return context;
// }
