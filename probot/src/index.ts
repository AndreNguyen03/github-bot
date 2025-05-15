import { Probot, Context } from "probot";
import * as fs from "fs";
import * as yaml from "js-yaml";
import { OpenAI } from "openai";
import { handleWelcomeComment } from "./handler/handler-welcome-comment.js";
import { handleAutoLabel } from "./handler/handler-autolabel.js";
import { handleAutoAssign } from "./handler/handler-autoassign.js";
import {
  handleNotificationIssueComment,
  handleNotificationPullRequestClose,
  handleNotificationPullRequestOpen,
} from "./handler/handler-notification.js";
import { handlePrSummary } from "./handler/handler-prsummary.js";
import {
  handleScanIssue,
  handleScanPullRequest,
} from "./handler/handler-scan.js";
import { handleAiReviewPullRequest } from "./handler/handler-ai-review.js";

// Hàm chính xử lý bot
export default (app: Probot) => {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  // Xử lý issue.opened
  app.on("issues.opened", async (context: Context<"issues.opened">) => {
    const { repository } = context.payload;
    const owner = repository.owner.login;
    const repo = repository.name;

    const fileContents = fs.readFileSync("config.yml", "utf8");
    const config: any = yaml.load(fileContents);

    //app.log.info(`Config: ${JSON.stringify(config)}`);
    // const config = await getConfig(context, owner, repo);

    if (!config || !config.enabled) {
      ``;
      app.log.info(`Bot disabled in ${owner}/${repo}`);
      return;
    }

    // Welcome comment
    if (
      config.welcome_comment.enabled &&
      config.welcome_comment.issue.enabled
    ) {
      await handleWelcomeComment(context, app, config);
    }

    // Auto-label
    if (config.auto_label.enabled && config.auto_label.issue.enabled) {
      await handleAutoLabel(context, app, config, openai);
    }

    // Auto-assign
    if (config.auto_assign.enabled) {
      await handleAutoAssign(context, app, openai);
    }

    // Discord notification
    if (
      config.discord_notifications.enabled &&
      config.discord_notifications.events.includes("issue.opened")
    ) {
      await handleNotificationIssueComment(context, app, config);
    }

    // scan issue
    if (config.scan.issue.enabled && config.scan.issue.prompt) {
      await handleScanIssue(context, app, config);
    }
  });

  // Xử lý issue_comment.created
  app.on(
    "issue_comment.created",
    async (context: Context<"issue_comment.created">) => {
      // const { repository } = context.payload;
      // const owner = repository.owner.login;
      // const repo = repository.name;

      // const config = await getConfig(context, owner, repo);

      const fileContents = fs.readFileSync("config.yml", "utf8");
      const config: any = yaml.load(fileContents);

      if (!config || !config.enabled) return;

      // Discord notification
      if (
        config.discord_notifications.enabled &&
        config.discord_notifications.events.includes("issue.commented")
      ) {
        await handleNotificationIssueComment(context, app, config);
      }
    }
  );

  // Xử lý pull_request.opened và pull_request.reopened
  app.on(
    ["pull_request.opened", "pull_request.reopened"],
    async (
      context: Context<"pull_request.opened" | "pull_request.reopened">
    ) => {
      // const { repository } = context.payload;
      // const owner = repository.owner.login;
      // const repo = repository.name;

      const fileContents = fs.readFileSync("config.yml", "utf8");
      const config: any = yaml.load(fileContents);
      console.log(config);

      app.log.info(`config : ${config}}`);

      // const config = await getConfig(context, owner, repo);

      if (!config || !config.enabled) return;

      if (config.pr_summary.enabled) {
        await handlePrSummary(context);
      }
      if (
        config.discord_notifications.enabled &&
        config.discord_notifications.events.includes("pull_request.opened")
      ) {
        await handleNotificationPullRequestOpen(context, app, config);
      }

      // scan pull request
      if (config.scan.pull_request.enabled && config.scan.pull_request.prompt) {
        await handleScanPullRequest(context, app, config);
      }
    }
  );

  // Xử lý pull_request.closed (merged)
  app.on(
    "pull_request.closed",
    async (context: Context<"pull_request.closed">) => {
      const { pull_request } = context.payload;
      // const { repository} = context.payload;
      if (!pull_request.merged) return;

      // const owner = repository.owner.login;
      // const repo = repository.name;

      const fileContents = fs.readFileSync("config.yml", "utf8");
      const config: any = yaml.load(fileContents);

      // const config = await getConfig(context, owner, repo);

      if (!config || !config.enabled) return;

      // Discord notification
      if (
        config.discord_notifications.enabled &&
        config.discord_notifications.events.includes("pull_request.merged")
      ) {
        await handleNotificationPullRequestClose(context, app, config);
      }
    }
  );

  app.on(
    "pull_request.labeled",
    async (context: Context<"pull_request.labeled">) => {
      const fileContents = fs.readFileSync("config.yml", "utf-8");
      const config: any = yaml.load(fileContents);

      if (config.ai_pr_review_while_labeled.enabled) {
        await handleAiReviewPullRequest(context, app, config);
      }
    }
  );
};
