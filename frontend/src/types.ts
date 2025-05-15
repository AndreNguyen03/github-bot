export interface User {
  id: string;
  username: string;
  avatar: string;
  accessToken: string;
}

export interface License {
  key: string;
  name: string;
  url: string | null;
  spdx_id: string | null;
  node_id: string;
  html_url?: string;
}

export interface Permissions {
  admin: boolean;
  pull: boolean;
  triage?: boolean;
  push: boolean;
  maintain?: boolean;
}

export interface Owner {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
  type: string;
}

export interface Repository {
  id: number;
  node_id: string;
  name: string;
  full_name: string;
  private: boolean;
  owner: Owner;
  html_url: string;
  description: string | null;
  fork: boolean;
  url: string;
  created_at: string | null; // Cho phép null để khớp với API
  updated_at: string | null; // Cho phép null để khớp với API
  pushed_at: string | null; // Cho phép null để khớp với API
  language: string | null;
  stargazers_count: number;
  watchers_count: number;
  forks_count: number;
  forks: number; // Thêm thuộc tính forks từ API
  license: License | null; // Thêm license từ API
  permissions?: Permissions; // Thêm permissions từ API
  anonymous_access_enabled?: boolean; // Thêm anonymous_access_enabled từ API
  hasBotConfig: false;
  hasAccessiblePermissionBot: false;
}

export interface TempRepository {
  id: number;
  name: string;
  html_url: string;
  owner: Owner;
  created_at: string | null;
}

export interface PushYamlParams {
  accessToken: string;
  repoOwnerName: string;
  repoName: string;
  branch: string;
  filePath: string;
  yamlContent: string;
  commitMessage?: string;
}

export interface RepositoryListResponse {
  total_count: number;
  repository_selection: string;
  repositories: Repository[];
}

export interface Installation {
  id: number;
  account: {
    login: string;
    id: number;
    type: string;
    [key: string]: unknown;
  };
  app_id: number;
  app_slug: string;
  target_id: number;
  target_type: string;
  permissions: {
    [key: string]: string;
  };
  events: string[];
  created_at: string;
  updated_at: string;
  single_file_name: string | null;
  repository_selection: string;
  [key: string]: unknown;
}

export interface UIConfigState {
  // LABEL - auto_label.issue / pull_request
  autoLabelIssue: boolean;
  autoLabelPullRequest: boolean;

  // ASSIGN - không có sẵn trong YAML nên sẽ cần mapping lại
  assign: boolean;

  // WELCOME MESSAGE
  welcomeCommentIssueEnabled: boolean;
  welcomeCommentIssueMessage: string;
  welcomeCommentPullRequestEnabled: boolean;
  welcomeCommentPullRequestMessage: string;

  // PR SUMMARY
  prSummaryEnabled: boolean;

  // DISCORD
  discordEnabled: boolean;
}

export interface ConfigOptions {
  enabled: boolean;

  welcome_comment: {
    enabled: boolean;
    issue: {
      enabled: boolean;
      message: string;
    };
    pull_request: {
      enabled: boolean;
      message: string;
    };
  };

  auto_label: {
    enabled: boolean;
    ai_model: string;
    issue: {
      enabled: boolean;
      labels: string[];
    };
    pull_request: {
      enabled: boolean;
      labels: string[];
    };
  };

  auto_assign: {
    enabled: boolean;
  };

  discord_notifications: {
    enabled: boolean;
    webhook_url: string;
    events: string[];
  };

  pr_summary: {
    enabled: boolean;
    ai_model: string;
    max_length: number;
  };

  scan: {
    enabled: boolean;
    issue: {
      enabled: boolean;
      prompt: string;
    };
    pull_request: {
      enabled: boolean;
      prompt: string;
    };
  };
}

export interface Notification {
  id: number;
  message: string;
  type?: "success" | "error" | "info";
}

export interface NotificationContextType {
  notify: (message: string, type?: Notification["type"]) => void;
}

export interface modeRepository {
  type: string;
  api: string;
}

export interface RepositoryContextType {
  currentRepos: Repository[];
  handleCheck: (repoPrams: TempRepository) => void;
  isCheckMode: boolean;
}

interface Pagination {
  currentPage: number;
  perPage: number;
  totalPages: number;
}
export interface RepositoryPageReponse {
  repos: Repository[];
  pagination: Pagination;
}

export interface BotInfo {
  user: User;
  githubAppId: String; // ID GitHub App
  githubAppName: String;
  githubAppSlug: String;
  privateKey: String;
  webhookSecret: String;
  installationId: Number;
  createdAt: Date;
  updatedAt: Date;
}

export interface BotConfig {
  _id: string;
  botAppId: string; // Tham chiếu đến BotApp
  configName: String; // Tên bản cấu hình
  configOptions: ConfigOptions; // Nội dung rule/config cụ thể
  createdAt: Date;
  updatedAt: Date;
  enabled: boolean;
}

interface ConfigSummary {
  configName: string; // Tên config (theo timestamp hoặc người dùng đặt)
  updatedAt: Date;
  enabled: boolean;
  summaryFeatures: string[]; // Các tính năng đang bật như ["auto_label", "discord_notifications"]
}

export interface Result {
  isSucess: boolean;

  message: string;
}
