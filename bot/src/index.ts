// bot/src/app.ts
import { Probot } from "probot";

export = (app: Probot) => {
  app.on("issues.opened", async (context) => {
    app.log.info("Hello! Issue opened!");
  });
};
