export interface BotConfig {
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