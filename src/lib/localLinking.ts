import { resolveApiBase } from "../services/api";

/** True when the API runs on the same machine as the browser (local bin/dev). */
export function isLocalLinkingEnvironment(): boolean {
  if (import.meta.env.DEV) return true;

  const raw = (import.meta.env.VITE_API_URL ?? "").trim();
  if (!raw) {
    const host = window.location.hostname;
    return host === "localhost" || host === "127.0.0.1";
  }

  try {
    const base = resolveApiBase(raw);
    const url = new URL(base, window.location.origin);
    return url.hostname === "localhost" || url.hostname === "127.0.0.1";
  } catch {
    return false;
  }
}

export function isAbsoluteDatabasePath(path: string): boolean {
  const trimmed = path.trim();
  if (!trimmed) return false;
  if (trimmed.startsWith("/")) return true;
  if (/^[A-Za-z]:[\\/]/.test(trimmed)) return true;
  return false;
}

export const LOCAL_LINKING_MESSAGE =
  "Linking your Cursor database only works with local bin/dev — the API must read state.vscdb on your machine. Sign in here for billing and account management, then run bin/dev locally to link, search, and export.";

export const BROWSER_PICKER_MESSAGE =
  "Browsers cannot open AppData or other protected folders directly. Paste the full path to state.vscdb below (WSL: /mnt/c/Users/you/AppData/Roaming/Cursor/User/globalStorage/state.vscdb).";
