import { BotInfo } from "./types";

export const botInfo: BotInfo = {
  user: {
    id: "1",
    username: "john_doe",
    avatar: "https://avatars.githubusercontent.com/u/12345678?v=4",
    accessToken: "gho_xxxxxxx_AccessTokenExample12345", // Đây là access token giả
  },
  githubAppId: "123456",
  githubAppName: "MyGitHubBot",
  githubAppSlug: "my-github-bot",
  privateKey: `-----BEGIN PRIVATE KEY-----
MIIBVgIBADANBgkqhkiG9w0BAQEFAASCATkAdZ0NJ+ixVopKMOyKc9JgL5g=
-----END PRIVATE KEY-----`,
  webhookSecret: "webhook_secret_example_123456",
  installationId: 78910,
  createdAt: new Date("2022-01-01T12:00:00Z"),
  updatedAt: new Date("2023-01-01T12:00:00Z"),
};
export const botInfoE = {};
export const botConfigsDataE = [];
export const botConfigsData = [
  {
    _id: "60f7d1e8f7c2b2b5f72d3c7d",
    botAppId: "123456", // Tham chiếu đến BotApp của user 'johnDoe'
    configName: "Config A - Issue Tracker",
    configOptions: {
      enabled: true,

      welcome_comment: {
        enabled: true,
        issue: {
          enabled: true,
          message:
            "Welcome! Thanks for opening this issue, we are reviewing it!",
        },
        pull_request: {
          enabled: true,
          message: "Welcome! Thanks for your PR, we are reviewing it!",
        },
      },

      auto_label: {
        enabled: true,
        ai_model: "gpt-3.5-turbo",
        issue: {
          enabled: true,
          labels: ["bug", "high-priority"],
        },
        pull_request: {
          enabled: true,
          labels: ["enhancement", "needs-review"],
        },
      },

      auto_assign: {
        enabled: true,
      },

      discord_notifications: {
        enabled: true,
        webhook_url: "https://discord.com/api/webhooks/...",
        events: ["push", "pull_request", "issue"],
      },

      pr_summary: {
        enabled: true,
        ai_model: "gpt-3.5-turbo",
        max_length: 500,
      },

      scan: {
        enabled: true,
        issue: {
          enabled: true,
          prompt: "Scan this issue for potential security vulnerabilities.",
        },
        pull_request: {
          enabled: true,
          prompt: "Scan this PR for code quality and security issues.",
        },
      },
    },
    createdAt: new Date("2021-07-15T11:00:00Z"),
    updatedAt: new Date("2021-07-15T12:30:00Z"),
    enabled: true,
  },
  {
    _id: "60f7d1e8f7c2b2b5f72d3c7e",
    botAppId: "123456",
    configName: "Config B - PR Notifier",
    configOptions: {
      enabled: true,

      welcome_comment: {
        enabled: false,
        issue: {
          enabled: false,
          message: "",
        },
        pull_request: {
          enabled: true,
          message: "Thanks for your PR! We are currently reviewing it.",
        },
      },

      auto_label: {
        enabled: true,
        ai_model: "gpt-3.5-turbo",
        issue: {
          enabled: false,
          labels: [],
        },
        pull_request: {
          enabled: true,
          labels: ["reviewed"],
        },
      },

      auto_assign: {
        enabled: false,
      },

      discord_notifications: {
        enabled: true,
        webhook_url: "https://discord.com/api/webhooks/...",
        events: ["pull_request"],
      },

      pr_summary: {
        enabled: true,
        ai_model: "gpt-3.5-turbo",
        max_length: 400,
      },

      scan: {
        enabled: false,
        issue: {
          enabled: false,
          prompt: "",
        },
        pull_request: {
          enabled: true,
          prompt: "Scan this PR for performance issues.",
        },
      },
    },
    createdAt: new Date("2021-08-01T12:00:00Z"),
    updatedAt: new Date("2021-08-01T14:00:00Z"),
    enabled: false,
  },
  {
    _id: "60f7d1e8f7c2b2b5f72d3c7f",
    botAppId: "123456",
    configName: "Config C - Auto Merge",
    configOptions: {
      enabled: true,

      welcome_comment: {
        enabled: true,
        issue: {
          enabled: true,
          message: "Thank you for your issue report! We are working on it.",
        },
        pull_request: {
          enabled: true,
          message: "Thank you for submitting the PR. We are reviewing it.",
        },
      },

      auto_label: {
        enabled: false,
        ai_model: "gpt-4",
        issue: {
          enabled: true,
          labels: ["auto-label"],
        },
        pull_request: {
          enabled: false,
          labels: [],
        },
      },

      auto_assign: {
        enabled: true,
      },

      discord_notifications: {
        enabled: true,
        webhook_url: "https://discord.com/api/webhooks/...",
        events: ["push", "pull_request", "issue"],
      },

      pr_summary: {
        enabled: false,
        ai_model: "gpt-4",
        max_length: 500,
      },

      scan: {
        enabled: true,
        issue: {
          enabled: true,
          prompt: "Scan for code vulnerabilities in this issue.",
        },
        pull_request: {
          enabled: true,
          prompt: "Check the PR for security flaws.",
        },
      },
    },
    createdAt: new Date("2021-09-10T10:00:00Z"),
    updatedAt: new Date("2021-09-10T12:00:00Z"),
    enabled: true,
  },
];
