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

export interface FontendConfig {
  labelIssue: boolean;
  labelPR: boolean;
  assignLeader: boolean;
  assignBest: boolean;
  msgIssue: string;
  msgPR: string;
  changedSummary: boolean;
  discord: boolean;
  customLabel: string;
}

export interface ConfigState {
  enabled: boolean;

  welcome_comment: {
    enabled: boolean;
    issue: { enabled: boolean; message: string };
    pull_request: { enabled: boolean; message: string };
  };

  auto_label: {
    enabled: boolean;
    ai_model: "gpt4omin" | string; // Default option "grok"
    issue: { enabled: boolean; labels: string[] };
    pull_request: { enabled: boolean; labels: string[] };
  };

  auto_assign: { enabled: boolean };

  discord_notifications: {
    enabled: boolean;
    webhook_url: string;
    events: string[];
  };

  pr_summary: { enabled: boolean; ai_model: string; max_length: number };

  scan: {
    enabled: boolean;
    issue: { enabled: boolean; prompt: string };
    pull_request: { enabled: boolean; prompt: string };
  };
}


export interface Owner {
  login: string;
  avatar_url: string;
  html_url: string;
}

export interface Repo {
  id: string;
  full_name: string;
  html_url: string;
  description: string | null;
  owner: Owner;
}


export interface HistoryConfig {
  _id: string;
  name: string;
  usedRepos: Repo[];
  uploadedAt: string;
  uploadedBy: string;
  config: {
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
  };
}
