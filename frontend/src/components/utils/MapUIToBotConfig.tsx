import { BotConfig, UIConfigState } from "../../types";

export function mapUIToBotConfig(ui: UIConfigState): BotConfig {
  return {
    enabled: true,

    welcome_comment: {
      enabled:
        ui.welcomeCommentIssueEnabled || ui.welcomeCommentPullRequestEnabled,
      issue: {
        enabled: ui.welcomeCommentIssueEnabled,
        message: ui.welcomeCommentIssueMessage,
      },
      pull_request: {
        enabled: ui.welcomeCommentPullRequestEnabled,
        message: ui.welcomeCommentPullRequestMessage,
      },
    },

    auto_label: {
      enabled: ui.autoLabelIssue || ui.autoLabelPullRequest,
      ai_model: "grok",
      issue: {
        enabled: ui.autoLabelIssue,
        labels: ["bug", "feature-request", "question", "urgent"],
      },
      pull_request: {
        enabled: ui.autoLabelPullRequest,
        labels: ["fix", "enhancement", "documentation", "needs-review"],
      },
    },

    auto_assign: {
      enabled: ui.assign,
    },

    discord_notifications: {
      enabled: ui.discordEnabled,
      webhook_url: "https://discord.com/api/webhooks/...", // bạn có thể giữ giá trị cố định
      events: ui.discordLabel ? [ui.discordLabel] : [],
    },

    pr_summary: {
      enabled: ui.prSummaryEnabled,
      ai_model: "grok",
      max_length: 200,
    },

    scan: {
      enabled: false,
      issue: { enabled: false, prompt: "" },
      pull_request: { enabled: false, prompt: "" },
    },
  };
}
