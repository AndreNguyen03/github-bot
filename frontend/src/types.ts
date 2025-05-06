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
