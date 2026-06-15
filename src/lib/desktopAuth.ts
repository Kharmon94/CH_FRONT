import { setToken } from "../services/api";

const AUTH_CALLBACK_PATH = "/app/oauth/desktop/callback";

/** Parse cursorhelp://auth?token=... deep links (Tauri or OS handler). */
export function parseDesktopAuthUrl(url: string): string | null {
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "cursorhelp:") return null;
    if (parsed.hostname !== "auth" && parsed.pathname !== "//auth") return null;
    return parsed.searchParams.get("token");
  } catch {
    return null;
  }
}

export function storeDesktopAuthToken(token: string): void {
  setToken(token);
}

export function desktopOAuthCallbackUrl(next = "/app"): string {
  const origin = window.location.origin;
  const params = new URLSearchParams({ next });
  return `${origin}${AUTH_CALLBACK_PATH}?${params.toString()}`;
}

export function registerDesktopAuthListener(onToken: (token: string) => void): () => void {
  const handler = (event: Event) => {
    const detail = (event as CustomEvent<{ url?: string }>).detail?.url;
    if (!detail) return;
    const token = parseDesktopAuthUrl(detail);
    if (token) onToken(token);
  };

  window.addEventListener("cursorhelp-auth", handler as EventListener);
  return () => window.removeEventListener("cursorhelp-auth", handler as EventListener);
}

export function emitDesktopAuthUrl(url: string): void {
  window.dispatchEvent(new CustomEvent("cursorhelp-auth", { detail: { url } }));
}
