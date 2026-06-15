export type DeepLinkAction = "auth" | "open";

export function parseDeepLink(url: string): { action: DeepLinkAction | null; token?: string } {
  try {
    const normalized = url.includes("://") ? url : `cursorhelp://${url}`;
    const parsed = new URL(normalized);
    if (parsed.protocol !== "cursorhelp:") return { action: null };

    const action = (parsed.hostname || parsed.pathname.replace(/^\//, "")) as DeepLinkAction;
    const token = parsed.searchParams.get("token") ?? undefined;
    return { action, token };
  } catch {
    return { action: null };
  }
}

export function isAuthDeepLink(url: string): boolean {
  const { action } = parseDeepLink(url);
  return action === "auth";
}

export function buildDesktopAuthCallbackUrl(token: string, siteOrigin: string): string {
  const webCallback = `${siteOrigin}/app/oauth/desktop/callback?token=${encodeURIComponent(token)}`;
  return webCallback;
}

export function buildDesktopDeepLink(token: string): string {
  return `cursorhelp://auth?token=${encodeURIComponent(token)}`;
}
