import { cloudApi, localApi, CLOUD_API_BASE } from "./apiClient";

export type TeamSummary = {
  id: number;
  name: string;
  slug: string;
  membership_role?: string;
  license: { tier: string; pro: boolean };
};

export type CurrentUser = {
  id: number;
  email: string;
  role: "admin" | "user";
  name: string | null;
  avatar_url: string | null;
  teams: TeamSummary[];
};

export type Workspace = {
  id: number;
  team_id: number;
  name: string;
  slug: string;
  root_path: string | null;
  linked_database_count?: number;
};

export type TeamDetail = TeamSummary & {
  export_count: number;
  member_count: number;
  workspace_count: number;
};

export type LinkedDatabase = {
  id: number;
  workspace_id: number;
  path: string;
  composer_count: number;
  last_indexed_at: string | null;
  index_status: string;
  index_error: string | null;
};

export type Composer = {
  id: string;
  linked_database_id: number;
  name: string;
  status: string;
  mode: string;
  message_count: number;
  updated_at_ms: number;
  updated_at: string | null;
};

export type ComposerDetail = Composer & {
  same_name_session_count: number;
  primary_composer_id: string;
  is_primary: boolean;
};

export type Paginated<T> = {
  data: T[];
  meta: { total: number; page: number; per_page: number };
};

export type ExportFormat = "markdown" | "agent_clone";

export type ExportStatus = {
  id: number;
  linked_database_id: number;
  composer_id: string;
  composer_name: string;
  format: ExportFormat;
  status: "queued" | "running" | "completed" | "failed";
  progress_pct: number;
  phase: string | null;
  session_count: number | null;
  error: string | null;
  download_url: string | null;
  created_at: string;
};

export type License = {
  tier: string;
  pro: boolean;
  export_count: number;
  exports_remaining: number | null;
};

export type AdminUser = {
  id: number;
  email: string;
  name: string | null;
  role: string;
  created_at?: string;
  teams?: Array<{ id: number; name: string; slug: string }>;
};

export type AdminLicense = {
  team_id: number;
  team_name: string;
  team_slug: string;
  tier: string;
  pro: boolean;
  status: string | null;
  export_count: number;
  member_count: number;
};

export type AdminTeam = {
  id: number;
  name: string;
  slug: string;
  export_count: number;
  member_count: number;
  created_at?: string;
  license: { tier: string; pro: boolean; status?: string | null };
  members?: Array<{ id: number; email: string; name: string | null; role: string }>;
  workspaces?: Array<{ id: number; name: string; slug: string }>;
};

export type AdminStats = {
  users_count: number;
  admins_count: number;
  teams_count: number;
  pro_teams_count: number;
  free_teams_count: number;
  total_exports: number;
  published_posts_count?: number;
  recent_users: AdminUser[];
  recent_teams: AdminTeam[];
};

export type BlogPostAuthor = {
  name: string | null;
  email: string;
};

export type BlogPostSummary = {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  status: "draft" | "published";
  published_at: string | null;
  created_at: string;
  updated_at: string;
  meta_title: string | null;
  meta_description: string | null;
  cover_image_url: string | null;
  author: BlogPostAuthor;
};

export type BlogPost = BlogPostSummary & {
  body: string;
};

export type BlogPostPayload = {
  title: string;
  slug?: string;
  excerpt?: string;
  body?: string;
  status?: "draft" | "published";
  meta_title?: string;
  meta_description?: string;
  cover_image_signed_id?: string;
};

/** Unified API — cloud for auth/billing; local engine for database/composer/export routes. */
export const api = {
  health: () => cloudApi.health(),

  authSignIn: cloudApi.authSignIn,
  authSignUp: cloudApi.authSignUp,
  authMe: cloudApi.authMe,
  authUpdateMe: cloudApi.authUpdateMe,
  authForgotPassword: cloudApi.authForgotPassword,
  authResetPassword: cloudApi.authResetPassword,
  authGoogleStart: cloudApi.authGoogleStart,
  adminSignIn: cloudApi.adminSignIn,

  teams: cloudApi.teams,
  workspaces: localApi.workspaces,
  linkedDatabases: localApi.linkedDatabases,
  composers: localApi.composers,
  exports: localApi.exports,
  license: cloudApi.license,
  stripe: cloudApi.stripe,
  billing: cloudApi.billing,
  upload: cloudApi.upload,
  blogPosts: cloudApi.blogPosts,
  admin: cloudApi.admin,

  /** Sync cloud account into the local SQLite engine after sign-in. */
  authSyncLocal: localApi.authSync,
  discoverDatabase: localApi.discover,
};

export {
  getToken,
  setToken,
  getTeamId,
  setTeamId,
  getWorkspaceId,
  setWorkspaceId,
  ApiError,
  resolveApiBase,
  cloudApi,
  localApi,
} from "./apiClient";

/** @deprecated Use CLOUD_API_BASE from apiClient */
export const API_BASE = CLOUD_API_BASE;
