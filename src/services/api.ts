const API_BASE = import.meta.env.VITE_API_URL ?? "/api/v1";
const TOKEN_KEY = "cursorhelp_jwt";
const TEAM_KEY = "cursorhelp_team_id";
const WORKSPACE_KEY = "cursorhelp_workspace_id";

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

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string | null) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

export function getTeamId(): number | null {
  const v = localStorage.getItem(TEAM_KEY);
  return v ? Number(v) : null;
}

export function setTeamId(id: number | null) {
  if (id) localStorage.setItem(TEAM_KEY, String(id));
  else localStorage.removeItem(TEAM_KEY);
}

export function getWorkspaceId(): number | null {
  const v = localStorage.getItem(WORKSPACE_KEY);
  return v ? Number(v) : null;
}

export function setWorkspaceId(id: number | null) {
  if (id) localStorage.setItem(WORKSPACE_KEY, String(id));
  else localStorage.removeItem(WORKSPACE_KEY);
}

function scopeHeaders(extra?: Record<string, string>): Record<string, string> {
  const headers: Record<string, string> = { ...extra };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  const teamId = getTeamId();
  if (teamId) headers["X-Team-Id"] = String(teamId);
  const workspaceId = getWorkspaceId();
  if (workspaceId) headers["X-Workspace-Id"] = String(workspaceId);
  return headers;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const isForm = init?.body instanceof FormData;
  const headers = scopeHeaders(
    isForm
      ? { Accept: "application/json" }
      : { "Content-Type": "application/json", Accept: "application/json" }
  );

  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: { ...headers, ...(init?.headers as Record<string, string>) },
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new ApiError(body.error ?? `Request failed (${response.status})`, response.status);
  }

  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

function get<T>(path: string, params?: Record<string, string | number | undefined>) {
  const query = params
    ? "?" +
      new URLSearchParams(
        Object.entries(params)
          .filter(([, v]) => v !== undefined && v !== "")
          .map(([k, v]) => [k, String(v)])
      ).toString()
    : "";
  return request<T>(`${path}${query}`);
}

function post<T>(path: string, body?: unknown) {
  return request<T>(path, { method: "POST", body: body ? JSON.stringify(body) : undefined });
}

function patch<T>(path: string, body?: unknown) {
  return request<T>(path, { method: "PATCH", body: body ? JSON.stringify(body) : undefined });
}

export async function directUploadFile(file: File): Promise<string> {
  const form = new FormData();
  form.append("file", file);
  const res = await request<{ signed_id: string }>("/uploads", { method: "POST", body: form });
  return res.signed_id;
}

export const api = {
  health: () => get<{ status: string }>("/health"),

  authSignIn: (email: string, password: string) =>
    post<{ token: string; user: CurrentUser }>("/auth/sign_in", { email, password }),
  authSignUp: (email: string, password: string, name?: string) =>
    post<{ token: string; user: CurrentUser }>("/auth/sign_up", { email, password, name }),
  authMe: () => get<{ user: CurrentUser }>("/auth/me"),
  authGoogleStart: (next?: string) =>
    get<{ authorize_url: string }>("/auth/google", next ? { next } : undefined),
  adminSignIn: (email: string, password: string) =>
    post<{ token: string; user: CurrentUser }>("/admin/sign_in", { email, password }),

  teams: {
    list: () => get<TeamDetail[]>("/teams"),
    show: (id: number) => get<TeamDetail>(`/teams/${id}`),
    create: (name: string) => post<TeamDetail>("/teams", { name }),
    update: (id: number, name: string) => patch<TeamDetail>(`/teams/${id}`, { name }),
    invite: (teamId: number, email: string, role: "member" | "owner" = "member") =>
      post<{ message: string }>(`/teams/${teamId}/memberships`, { email, role }),
    members: (teamId: number) =>
      get<Array<{ id: number; email: string; name: string | null; role: string }>>(
        `/teams/${teamId}/memberships`
      ),
    acceptInvite: (token: string) =>
      post<{ message: string; team: { id: number; name: string } }>(`/team_invites/${token}/accept`),
  },

  workspaces: {
    list: (teamId: number) => get<Workspace[]>(`/teams/${teamId}/workspaces`),
    create: (teamId: number, body: { name: string; root_path?: string }) =>
      post<Workspace>(`/teams/${teamId}/workspaces`, body),
  },

  linkedDatabases: {
    list: () => get<LinkedDatabase[]>("/linked_databases"),
    create: (path: string) => post<LinkedDatabase>("/linked_databases", { path }),
    refresh: (id: number) => post<LinkedDatabase>(`/linked_databases/${id}/refresh`),
    destroy: (id: number) => request<void>(`/linked_databases/${id}`, { method: "DELETE" }),
  },
  composers: {
    list: (params: {
      linked_database_id: number;
      q?: string;
      mode?: string;
      page?: number;
    }) => get<Paginated<Composer>>("/composers", params),
    show: (id: string, linked_database_id: number) =>
      get<ComposerDetail>(`/composers/${id}`, { linked_database_id }),
  },
  exports: {
    list: (linked_database_id?: number) =>
      get<ExportStatus[]>("/exports", linked_database_id ? { linked_database_id } : undefined),
    create: (body: {
      linked_database_id: number;
      composer_id: string;
      format: ExportFormat;
    }) => post<ExportStatus>("/exports", body),
    poll: (id: number) => get<ExportStatus>(`/exports/${id}`),
    downloadUrl: (id: number) => `${API_BASE}/exports/${id}/download`,
  },
  license: () => get<License>("/license"),
  billing: {
    checkout: (plan: "monthly" | "annual", teamId?: number) => {
      const id = teamId ?? getTeamId();
      return post<{ url: string }>(`/teams/${id}/billing/checkout`, { plan });
    },
    confirm: (session_id: string, teamId?: number) => {
      const id = teamId ?? getTeamId();
      return post<License>(`/teams/${id}/billing/confirm`, { session_id });
    },
  },
  upload: directUploadFile,
};
