/** Cloud control plane — auth, billing, teams, license. */
export function resolveApiBase(envUrl?: string, fallback = "/api/v1"): string {
  const raw = (envUrl ?? "").trim().replace(/\/$/, "");
  if (!raw) return fallback;
  if (raw.endsWith("/api/v1")) return raw;
  return `${raw}/api/v1`;
}

export const CLOUD_API_BASE = resolveApiBase(
  import.meta.env.VITE_CLOUD_API_URL || import.meta.env.VITE_API_URL,
  import.meta.env.DEV ? "/api/v1" : "https://api.cursorhelp.com/api/v1"
);

export const LOCAL_API_BASE = resolveApiBase(
  import.meta.env.VITE_LOCAL_API_URL ||
    (import.meta.env.DEV ? import.meta.env.VITE_CLOUD_API_URL || import.meta.env.VITE_API_URL : undefined),
  import.meta.env.DEV ? "/api/v1" : "http://127.0.0.1:3847/api/v1"
);

export const LOCAL_ENGINE_PORT = Number(import.meta.env.VITE_LOCAL_ENGINE_PORT || 3847);
export const DESKTOP_UI_PORT = Number(import.meta.env.VITE_DESKTOP_UI_PORT || 3848);

const TOKEN_KEY = "cursorhelp_jwt";
const TEAM_KEY = "cursorhelp_team_id";
const WORKSPACE_KEY = "cursorhelp_workspace_id";

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

export function scopeHeaders(extra?: Record<string, string>): Record<string, string> {
  const headers: Record<string, string> = { ...extra };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  const teamId = getTeamId();
  if (teamId) headers["X-Team-Id"] = String(teamId);
  const workspaceId = getWorkspaceId();
  if (workspaceId) headers["X-Workspace-Id"] = String(workspaceId);
  return headers;
}

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export async function apiRequest<T>(
  base: string,
  path: string,
  init?: RequestInit,
  options?: { unreachableHint?: string }
): Promise<T> {
  const isForm = init?.body instanceof FormData;
  const headers = scopeHeaders(
    isForm
      ? { Accept: "application/json" }
      : { "Content-Type": "application/json", Accept: "application/json" }
  );

  let response: Response;
  try {
    response = await fetch(`${base}${path}`, {
      ...init,
      headers: { ...headers, ...(init?.headers as Record<string, string>) },
    });
  } catch {
    const hint =
      options?.unreachableHint ??
      " Install the desktop app or run the local launcher from cursorhelp.com/download.";
    throw new ApiError(`Cannot reach the API.${hint}`, 0);
  }

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new ApiError(body.error ?? `Request failed (${response.status})`, response.status);
  }

  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

function get<T>(base: string, path: string, params?: Record<string, string | number | undefined>) {
  const query = params
    ? "?" +
      new URLSearchParams(
        Object.entries(params)
          .filter(([, v]) => v !== undefined && v !== "")
          .map(([k, v]) => [k, String(v)])
      ).toString()
    : "";
  return apiRequest<T>(base, `${path}${query}`);
}

function post<T>(base: string, path: string, body?: unknown) {
  return apiRequest<T>(base, path, { method: "POST", body: body ? JSON.stringify(body) : undefined });
}

function patch<T>(base: string, path: string, body?: unknown) {
  return apiRequest<T>(base, path, { method: "PATCH", body: body ? JSON.stringify(body) : undefined });
}

function del<T>(base: string, path: string) {
  return apiRequest<T>(base, path, { method: "DELETE" });
}

let localReachableCache: { value: boolean; at: number } | null = null;

/** Ping the local Rails engine (desktop / launcher). In dev, same-origin API counts as local. */
export async function isLocalEngineReachable(force = false): Promise<boolean> {
  if (import.meta.env.DEV) return true;

  const now = Date.now();
  if (!force && localReachableCache && now - localReachableCache.at < 5000) {
    return localReachableCache.value;
  }
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 2000);
    const res = await fetch(`${LOCAL_API_BASE}/health`, { signal: controller.signal });
    clearTimeout(timer);
    const value = res.ok;
    localReachableCache = { value, at: now };
    return value;
  } catch {
    localReachableCache = { value: false, at: now };
    return false;
  }
}

/** True when running inside the Tauri desktop shell or the launcher UI ports. */
export function isDesktopApp(): boolean {
  if (import.meta.env.VITE_DESKTOP_APP === "true") return true;
  if (typeof window !== "undefined" && "__TAURI__" in window) return true;
  const port = window.location.port;
  return port === String(DESKTOP_UI_PORT) || port === String(LOCAL_ENGINE_PORT);
}

const localHint =
  " Install the desktop app or run the local launcher from cursorhelp.com/download.";

export const cloudApi = {
  health: () => get<{ status: string }>(CLOUD_API_BASE, "/health"),

  authSignIn: (email: string, password: string) =>
    post<{ token: string; user: import("./api").CurrentUser }>(CLOUD_API_BASE, "/auth/sign_in", {
      email,
      password,
    }),
  authSignUp: (email: string, password: string, name?: string) =>
    post<{ token: string; user: import("./api").CurrentUser }>(CLOUD_API_BASE, "/auth/sign_up", {
      email,
      password,
      name,
    }),
  authMe: () => get<{ user: import("./api").CurrentUser }>(CLOUD_API_BASE, "/auth/me"),
  authUpdateMe: (body: { name?: string; avatar_signed_id?: string }) =>
    patch<{ user: import("./api").CurrentUser }>(CLOUD_API_BASE, "/auth/me", body),
  authForgotPassword: (email: string) =>
    post<{ message: string }>(CLOUD_API_BASE, "/auth/forgot_password", { email }),
  authResetPassword: (reset_token: string, password: string) =>
    post<{ message: string }>(CLOUD_API_BASE, "/auth/reset_password", {
      reset_password_token: reset_token,
      password,
      password_confirmation: password,
    }),
  authGoogleStart: (next?: string) =>
    get<{ authorize_url: string }>(CLOUD_API_BASE, "/auth/google", next ? { next } : undefined),
  adminSignIn: (email: string, password: string) =>
    post<{ token: string; user: import("./api").CurrentUser }>(CLOUD_API_BASE, "/admin/sign_in", {
      email,
      password,
    }),

  teams: {
    list: () => get<import("./api").TeamDetail[]>(CLOUD_API_BASE, "/teams"),
    show: (id: number) => get<import("./api").TeamDetail>(CLOUD_API_BASE, `/teams/${id}`),
    create: (name: string) => post<import("./api").TeamDetail>(CLOUD_API_BASE, "/teams", { name }),
    update: (id: number, name: string) =>
      patch<import("./api").TeamDetail>(CLOUD_API_BASE, `/teams/${id}`, { name }),
    invite: (teamId: number, email: string, role: "member" | "owner" = "member") =>
      post<{ message: string }>(CLOUD_API_BASE, `/teams/${teamId}/memberships`, { email, role }),
    members: (teamId: number) =>
      get<Array<{ id: number; email: string; name: string | null; role: string }>>(
        CLOUD_API_BASE,
        `/teams/${teamId}/memberships`
      ),
    acceptInvite: (token: string) =>
      post<{ message: string; team: { id: number; name: string } }>(
        CLOUD_API_BASE,
        `/team_invites/${token}/accept`
      ),
  },

  workspaces: {
    list: (teamId: number) =>
      get<import("./api").Workspace[]>(CLOUD_API_BASE, `/teams/${teamId}/workspaces`),
    create: (teamId: number, body: { name: string; root_path?: string }) =>
      post<import("./api").Workspace>(CLOUD_API_BASE, `/teams/${teamId}/workspaces`, body),
  },

  license: () => get<import("./api").License>(CLOUD_API_BASE, "/license"),
  stripe: {
    status: () =>
      get<{
        mode: string;
        enabled: boolean;
        checkout_ready: boolean;
        missing: string[];
        webhook_secrets_configured: boolean;
      }>(CLOUD_API_BASE, "/stripe/status"),
  },
  billing: {
    checkout: (plan: "monthly" | "annual", teamId?: number) => {
      const id = teamId ?? getTeamId();
      return post<{ url: string }>(CLOUD_API_BASE, `/teams/${id}/billing/checkout`, { plan });
    },
    confirm: (session_id: string, teamId?: number) => {
      const id = teamId ?? getTeamId();
      return post<import("./api").License>(CLOUD_API_BASE, `/teams/${id}/billing/confirm`, { session_id });
    },
    portal: (teamId?: number) => {
      const id = teamId ?? getTeamId();
      return post<{ url: string }>(CLOUD_API_BASE, `/teams/${id}/billing/portal`, {});
    },
  },
  upload: async (file: File) => {
    const form = new FormData();
    form.append("file", file);
    const res = await apiRequest<{ signed_id: string }>(CLOUD_API_BASE, "/uploads", {
      method: "POST",
      body: form,
    });
    return res.signed_id;
  },
  blogPosts: {
    list: () => get<import("./api").BlogPostSummary[]>(CLOUD_API_BASE, "/blog_posts"),
    show: (slug: string) => get<import("./api").BlogPost>(CLOUD_API_BASE, `/blog_posts/${slug}`),
  },
  admin: {
    stats: () => get<import("./api").AdminStats>(CLOUD_API_BASE, "/admin/stats"),
    users: {
      list: () => get<import("./api").AdminUser[]>(CLOUD_API_BASE, "/admin/users"),
      show: (id: number) => get<import("./api").AdminUser>(CLOUD_API_BASE, `/admin/users/${id}`),
      update: (id: number, body: { name?: string; role?: "admin" | "user" }) =>
        patch<import("./api").AdminUser>(CLOUD_API_BASE, `/admin/users/${id}`, body),
    },
    teams: {
      list: () => get<import("./api").AdminTeam[]>(CLOUD_API_BASE, "/admin/teams"),
      show: (id: number) => get<import("./api").AdminTeam>(CLOUD_API_BASE, `/admin/teams/${id}`),
      update: (id: number, body: { license_tier?: string; name?: string }) =>
        patch<import("./api").AdminTeam>(CLOUD_API_BASE, `/admin/teams/${id}`, body),
    },
    licenses: {
      list: (params?: { tier?: string }) =>
        get<import("./api").AdminLicense[]>(CLOUD_API_BASE, "/admin/licenses", params),
    },
    blogPosts: {
      list: () => get<import("./api").BlogPostSummary[]>(CLOUD_API_BASE, "/admin/blog_posts"),
      show: (id: number) => get<import("./api").BlogPost>(CLOUD_API_BASE, `/admin/blog_posts/${id}`),
      create: (body: import("./api").BlogPostPayload) =>
        post<import("./api").BlogPost>(CLOUD_API_BASE, "/admin/blog_posts", body),
      update: (id: number, body: import("./api").BlogPostPayload) =>
        patch<import("./api").BlogPost>(CLOUD_API_BASE, `/admin/blog_posts/${id}`, body),
      destroy: (id: number) => del<void>(CLOUD_API_BASE, `/admin/blog_posts/${id}`),
    },
  },
};

export const localApi = {
  health: () =>
    apiRequest<{ status: string }>(LOCAL_API_BASE, "/health", undefined, {
      unreachableHint: localHint,
    }),

  authMe: () =>
    apiRequest<{ user: import("./api").CurrentUser }>(LOCAL_API_BASE, "/auth/me", undefined, {
      unreachableHint: localHint,
    }),

  authValidate: () =>
    apiRequest<{ valid: boolean; user: { id: number; email: string } }>(
      LOCAL_API_BASE,
      "/auth/validate",
      undefined,
      { unreachableHint: localHint }
    ),

  authSync: (payload: { user: import("./api").CurrentUser; teams: import("./api").TeamSummary[] }) =>
    post<{ user: import("./api").CurrentUser }>(LOCAL_API_BASE, "/auth/sync", payload),

  discover: () =>
    get<{ found: boolean; path: string | null; count?: number; candidates?: string[] }>(
      LOCAL_API_BASE,
      "/local/discover"
    ),

  linkedDatabases: {
    list: () => get<import("./api").LinkedDatabase[]>(LOCAL_API_BASE, "/linked_databases"),
    locate: (body: { filename: string; byte_size: number; last_modified_ms?: number }) =>
      post<{ path: string }>(LOCAL_API_BASE, "/linked_databases/locate", body),
    create: (path: string) =>
      post<import("./api").LinkedDatabase>(LOCAL_API_BASE, "/linked_databases", { path }),
    refresh: (id: number) =>
      post<import("./api").LinkedDatabase>(LOCAL_API_BASE, `/linked_databases/${id}/refresh`),
    destroy: (id: number) => del<void>(LOCAL_API_BASE, `/linked_databases/${id}`),
  },
  composers: {
    list: (params: {
      linked_database_id: number;
      q?: string;
      mode?: string;
      page?: number;
    }) => get<import("./api").Paginated<import("./api").Composer>>(LOCAL_API_BASE, "/composers", params),
    show: (id: string, linked_database_id: number) =>
      get<import("./api").ComposerDetail>(LOCAL_API_BASE, `/composers/${id}`, { linked_database_id }),
  },
  exports: {
    list: (linked_database_id?: number) =>
      get<import("./api").ExportStatus[]>(
        LOCAL_API_BASE,
        "/exports",
        linked_database_id ? { linked_database_id } : undefined
      ),
    create: (body: {
      linked_database_id: number;
      composer_id: string;
      format: import("./api").ExportFormat;
    }) => post<import("./api").ExportStatus>(LOCAL_API_BASE, "/exports", body),
    poll: (id: number) => get<import("./api").ExportStatus>(LOCAL_API_BASE, `/exports/${id}`),
    downloadUrl: (id: number) => `${LOCAL_API_BASE}/exports/${id}/download`,
  },
  workspaces: {
    list: (teamId: number) =>
      get<import("./api").Workspace[]>(LOCAL_API_BASE, `/teams/${teamId}/workspaces`),
    create: (teamId: number, body: { name: string; root_path?: string }) =>
      post<import("./api").Workspace>(LOCAL_API_BASE, `/teams/${teamId}/workspaces`, body),
  },
};
