import { Context, Probot } from "probot";
import { sendDiscordNotification } from "../utils/discord-notification.js";

export async function handleNotificationIssueOpen(
  context: Context<"issues.opened">,
  app: Probot,
  config: any
) {
  const { issue, repository } = context.payload;
  const owner = repository.owner.login;
  const repo = repository.name;
  const issueNumber = issue.number;

  const message = `New issue #${issueNumber} opened in ${owner}/${repo}: "${issue.title}"`;
  await sendDiscordNotification(
    config.discord_notifications.webhook_url,
    message,
    `Issue #${issueNumber} Opened`,
    issue.html_url
  );

  app.log.info("Notification on issue open sent!");
}

export async function handleNotificationIssueComment(
  context: Context<"issue_comment.created">,
  app: Probot,
  config: any
) {
  const { issue, comment, repository } = context.payload;
  const owner = repository.owner.login;
  const repo = repository.name;
  const issueNumber = issue.number;

  const message = `New comment on issue #${issueNumber} in ${owner}/${repo} by ${
    comment.user.login
  }: "${comment.body.slice(0, 100)}..."`;
  await sendDiscordNotification(
    config.discord_notifications.webhook_url,
    message,
    `Comment on Issue #${issueNumber}`,
    comment.html_url
  );

  app.log.info("Notification on issue comment sent!");
}

export async function handleNotificationPullRequestOpen(
  context: Context<"pull_request.opened" | "pull_request.reopened">, app:Probot,
  config: any
) {
  const { pull_request, repository } = context.payload;
  const owner = repository.owner.login;
  const repo = repository.name;
  const prNumber = pull_request.number;

  const message = `New pull request #${prNumber} opened in ${owner}/${repo}: "${pull_request.title}"`;
  await sendDiscordNotification(
    config.discord_notifications.webhook_url,
    message,
    `Pull Request #${prNumber} Opened`,
    pull_request.html_url
  );
  app.log.info("Notification on pull request open sent!")
}

export async function handleNotificationPullRequestClose(
  context: Context<"pull_request.closed">,
  app:Probot,
  config: any
) {
  const { pull_request, repository } = context.payload;
  if (!pull_request.merged) return;

  const owner = repository.owner.login;
  const repo = repository.name;
  const prNumber = pull_request.number;

  const message = `Pull request #${prNumber} merged in ${owner}/${repo}: "${pull_request.title}"`;
  await sendDiscordNotification(
    config.discord_notifications.webhook_url,
    message,
    `Pull Request #${prNumber} Merged`,
    pull_request.html_url
  );

  app.log.info('Notification on pull request close sent!')
}
