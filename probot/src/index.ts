import { Probot, Context } from "probot";
import { WebhookClient, EmbedBuilder } from "discord.js";
import * as fs from "fs";
import * as yaml from "js-yaml";
import { OpenAI } from "openai";
import { summaryCodeChanges } from "./ai/summaryChanges.js";
// Định nghĩa cấu trúc cho config.yml
interface BotConfig {
  enabled: boolean;
  welcome_comment: {
    enabled: boolean;
    issue: { enabled: boolean; message: string };
  };
  auto_label: {
    enabled: boolean;
    issue: { enabled: boolean; labels: string[] };
  };
  auto_assign: { enabled: boolean };
  discord_notifications: {
    enabled: boolean;
    webhook_url: string;
    events: string[];
  };
}

// Định nghĩa cấu trúc commit summary
interface CommitSummary {
  author: string;
  message: string;
  files: string;
}

// Hàm đọc config.yml từ repository
// async function getConfig(
//   context: Context,
//   owner: string,
//   repo: string
// ): Promise<BotConfig | null> {
//   try {
//     const response = await context.octokit.repos.getContent({
//       owner,
//       repo,
//       path: ".github/config.yml",
//     });

//     // Kiểm tra xem response.data là file hay thư mục
//     if (Array.isArray(response.data)) {
//       context.log.error(
//         `Error: .github/config.yml is a directory in ${owner}/${repo}`
//       );
//       return null;
//     }

//     // Đảm bảo response.data là file và có content
//     if (!("content" in response.data)) {
//       context.log.error(
//         `Error: .github/config.yml has no content in ${owner}/${repo}`
//       );
//       return null;
//     }

//     const content = Buffer.from(response.data.content, "base64").toString();
//     return yaml.load(content) as BotConfig;
//   } catch (error) {
//     context.log.error(`Error reading config.yml in ${owner}/${repo}: ${error}`);
//     return null;
//   }
// }

// Hàm gửi thông báo Discord
async function sendDiscordNotification(
  webhookUrl: string,
  message: string,
  embedTitle: string,
  embedUrl?: string
): Promise<void> {
  try {
    const webhookClient = new WebhookClient({ url: webhookUrl });
    const embed = new EmbedBuilder()
      .setTitle(embedTitle)
      .setDescription(message)
      .setColor(0x00ff00)
      .setTimestamp();

    if (embedUrl) {
      embed.setURL(embedUrl);
    }

    await webhookClient.send({ embeds: [embed] });
  } catch (error) {}
}

// Hàm tạo prompt cho OpenAI để gán assignee
function buildAssigneePrompt(
  title: string,
  body: string,
  commits: CommitSummary[]
): string {
  const formattedCommits = commits.map(
    (c) => `Author: ${c.author}\nMessage: ${c.message}\nFiles: ${c.files}`
  );
  return `
    You are a helpful assistant for a GitHub repository.
    Given the issue and recent commits, identify the most relevant developer to assign this issue to.
    Consider commit authors, their recent changes, and files they worked on.
    
    Issue:
    Title: ${title}
    Body: ${body}
    
    Recent Commits:
    ${formattedCommits.join("\n\n")}
    
    Reply with the GitHub username (e.g., @alice) of the best-suited developer.
  `.trim();
}

// Hàm tạo prompt cho OpenAI để gán nhãn
function buildLabelPrompt(content: string, labels: string[]): string {
  return `
    You are a helpful assistant. Review the issue content: ${content}
    and label it appropriately from these labels: ${labels.join(", ")}.
    Return only the suitable label, no explanation.
  `.trim();
}

// Hàm lấy commit summaries
async function getCommitSummaries(
  context: Context,
  owner: string,
  repo: string,
  limit: number = 10
): Promise<CommitSummary[]> {
  const commits = await context.octokit.repos.listCommits({
    owner,
    repo,
    per_page: limit,
  });

  const summaries: CommitSummary[] = [];
  for (const commit of commits.data) {
    const detail = await context.octokit.repos.getCommit({
      owner,
      repo,
      ref: commit.sha,
    });
    summaries.push({
      author: commit.author?.login || "unknown",
      message: commit.commit.message,
      files: detail.data.files?.map((f) => f.filename).join(", ") || "",
    });
  }
  return summaries;
}

// Hàm chính xử lý bot
export default (app: Probot) => {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  // Xử lý issue.opened
  app.on("issues.opened", async (context: Context<"issues.opened">) => {
    const { issue, repository } = context.payload;
    const owner = repository.owner.login;
    const repo = repository.name;
    const issueNumber = issue.number;

    const fileContents = fs.readFileSync("config.yml", "utf8");
    const config: any = yaml.load(fileContents);

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
      await context.octokit.issues.createComment(
        context.issue({ body: config.welcome_comment.issue.message })
      );
      app.log.info(`Sent welcome comment to issue #${issueNumber}`);
    }

    // Auto-label
    if (
      config.auto_label.enabled &&
      config.auto_label.issue.enabled &&
      issue.body
    ) {
      try {
        const prompt = buildLabelPrompt(
          issue.body.toLowerCase(),
          config.auto_label.issue.labels
        );
        const response = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: "You are a helpful code review assistant.",
            },
            { role: "user", content: prompt },
          ],
        });
        const label = response.choices[0].message.content?.trim();
        if (label) {
          await context.octokit.issues.addLabels(
            context.issue({ labels: [label] })
          );
          app.log.info(`Added label "${label}" to issue #${issueNumber}`);
        }
      } catch (error) {
        app.log.error(`Error labeling issue #${issueNumber}: ${error}`);
      }
    }

    // Auto-assign
    if (config.auto_assign.enabled && issue.body) {
      try {
        const commits = await getCommitSummaries(context, owner, repo);
        const authors = new Set(commits.map((c) => c.author));

        if (authors.size === 1) {
          const [onlyAuthor] = authors;
          await context.octokit.issues.addAssignees(
            context.issue({ assignees: [onlyAuthor] })
          );
          app.log.info(
            `Assigned issue #${issueNumber} to @${onlyAuthor} (only contributor)`
          );
        } else if (commits.length > 0) {
          const prompt = buildAssigneePrompt(issue.title, issue.body, commits);
          const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: prompt }],
          });
          const assignee = response.choices[0].message.content
            ?.trim()
            .replace("@", "");
          if (assignee) {
            await context.octokit.issues.addAssignees(
              context.issue({ assignees: [assignee] })
            );
            app.log.info(`Assigned issue #${issueNumber} to @${assignee}`);
          }
        }
      } catch (error) {
        app.log.error(`Error assigning issue #${issueNumber}: ${error}`);
      }
    }

    // Discord notification
    if (
      config.discord_notifications.enabled &&
      config.discord_notifications.events.includes("issue.opened")
    ) {
      const message = `New issue #${issueNumber} opened in ${owner}/${repo}: "${issue.title}"`;
      await sendDiscordNotification(
        config.discord_notifications.webhook_url,
        message,
        `Issue #${issueNumber} Opened`,
        issue.html_url
      );
    }
  });

  // Xử lý issue_comment.created
  app.on(
    "issue_comment.created",
    async (context: Context<"issue_comment.created">) => {
      const { issue, comment, repository } = context.payload;
      const owner = repository.owner.login;
      const repo = repository.name;
      const issueNumber = issue.number;

      const fileContents = fs.readFileSync("config.yml", "utf8");
      const config: any = yaml.load(fileContents);

      // const config = await getConfig(context, owner, repo);

      if (!config || !config.enabled) return;

      // Discord notification
      if (
        config.discord_notifications.enabled &&
        config.discord_notifications.events.includes("issue.commented")
      ) {
        const message = `New comment on issue #${issueNumber} in ${owner}/${repo} by ${
          comment.user.login
        }: "${comment.body.slice(0, 100)}..."`;
        await sendDiscordNotification(
          config.discord_notifications.webhook_url,
          message,
          `Comment on Issue #${issueNumber}`,
          comment.html_url
        );
      }
    }
  );

  // Xử lý pull_request.opened và pull_request.reopened
  app.on(
    ["pull_request.opened", "pull_request.reopened"],
    async (
      context: Context<"pull_request.opened" | "pull_request.reopened">
    ) => {
      const { pull_request, repository } = context.payload;
      const owner = repository.owner.login;
      const repo = repository.name;
      const prNumber = pull_request.number;

      const fileContents = fs.readFileSync("config.yml", "utf8");
      const config: any = yaml.load(fileContents);

      // const config = await getConfig(context, owner, repo);

      if (!config || !config.enabled) return;

      const prComment = context.issue({
        body: "Bạn đã tạo PR! PR của bạn sẽ được xem xét! Nice a day 😊",
      });

      //app.log.info(`PR Number: ${context.payload.pull_request.number}`);
      await context.octokit.issues.createComment(prComment);

      const files = await context.octokit.pulls.listFiles(
        context.pullRequest({ per_page: 100 })
      );

      //app.log.info(`Toàn bộ thông tin files.data: ${files}`);
      let allPatches = "";
      for (const file of files.data) {
        if (!file.patch) continue; // Bỏ file nhị phân hoặc không có diff
        allPatches += `File: ${file.filename}\n${file.patch}\n\n`;
      }
      const summary = await summaryCodeChanges(
        "Tổng thể Pull Request",
        allPatches
      );
      if (summary && summary.trim() !== "") {
        await context.octokit.issues.createComment(
          context.issue({
            body: `🤖 **Bản tóm tắt PR:**\n ${summary}`,
          })
        );
      }
      // Discord notification
      if (
        config.discord_notifications.enabled &&
        config.discord_notifications.events.includes("pull_request.opened")
      ) {
        const message = `New pull request #${prNumber} opened in ${owner}/${repo}: "${pull_request.title}"`;
        await sendDiscordNotification(
          config.discord_notifications.webhook_url,
          message,
          `Pull Request #${prNumber} Opened`,
          pull_request.html_url
        );
      }
    }
  );

  // Xử lý pull_request.closed (merged)
  app.on(
    "pull_request.closed",
    async (context: Context<"pull_request.closed">) => {
      const { pull_request, repository } = context.payload;
      if (!pull_request.merged) return;

      const owner = repository.owner.login;
      const repo = repository.name;
      const prNumber = pull_request.number;

      const fileContents = fs.readFileSync("config.yml", "utf8");
      const config: any = yaml.load(fileContents);

      // const config = await getConfig(context, owner, repo);

      if (!config || !config.enabled) return;

      // Discord notification
      if (
        config.discord_notifications.enabled &&
        config.discord_notifications.events.includes("pull_request.merged")
      ) {
        const message = `Pull request #${prNumber} merged in ${owner}/${repo}: "${pull_request.title}"`;
        await sendDiscordNotification(
          config.discord_notifications.webhook_url,
          message,
          `Pull Request #${prNumber} Merged`,
          pull_request.html_url
        );
      }
    }
  );
};
