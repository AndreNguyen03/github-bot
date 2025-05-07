import { ConfigState } from "../../types";
export const defaultValues: ConfigState = {
  enabled: true,

  welcome_comment: {
    enabled: true,
    issue: { enabled: true, message: "" },
    pull_request: { enabled: true, message: "" },
  },

  auto_label: {
    enabled: true,
    ai_model: "grok",
    issue: { enabled: true, labels: [] },
    pull_request: { enabled: true, labels: [] },
  },

  auto_assign: { enabled: true },

  discord_notifications: {
    enabled: false,
    webhook_url: "",
    events: [],
  },

  pr_summary: { enabled: false, ai_model: "grok", max_length: 200 },

  scan: {
    enabled: false,
    issue: { enabled: false, prompt: "" },
    pull_request: { enabled: false, prompt: "" },
  },
};
