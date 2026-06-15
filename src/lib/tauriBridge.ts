type TauriCore = {
  invoke: <T>(cmd: string, args?: Record<string, unknown>) => Promise<T>;
};

type TauriEvent = {
  listen: (event: string, cb: (payload: { payload: unknown }) => void) => Promise<() => void>;
};

type TauriDeepLink = {
  getCurrent?: () => Promise<string[] | null>;
  onOpenUrl?: (handler: (urls: string[]) => void) => Promise<() => void>;
};

function tauriGlobals(): {
  core?: TauriCore;
  event?: TauriEvent;
  deepLink?: TauriDeepLink;
} | null {
  if (typeof window === "undefined" || !("__TAURI__" in window)) return null;
  return (window as Window & { __TAURI__?: { core?: TauriCore; event?: TauriEvent; deepLink?: TauriDeepLink } })
    .__TAURI__ ?? null;
}

export function isTauriAvailable(): boolean {
  return tauriGlobals()?.core?.invoke != null;
}

/** Native file picker for state.vscdb (Tauri shell only). */
export async function pickDatabaseFile(): Promise<string | null> {
  const tauri = tauriGlobals();
  if (!tauri?.core?.invoke) return null;
  try {
    const path = await tauri.core.invoke<string | null>("pick_database_file");
    return path?.trim() || null;
  } catch {
    return null;
  }
}

function emitDeepLinkUrls(onUrl: (url: string) => void, payload: unknown) {
  if (Array.isArray(payload)) payload.forEach((url) => typeof url === "string" && onUrl(url));
  else if (typeof payload === "string") onUrl(payload);
}

/** Subscribe to cursorhelp:// deep links emitted by the Tauri shell. */
export async function listenDeepLinks(onUrl: (url: string) => void): Promise<() => void> {
  const tauri = tauriGlobals();
  if (!tauri) return () => {};

  if (tauri.deepLink?.getCurrent) {
    const current = await tauri.deepLink.getCurrent();
    current?.forEach(onUrl);
  }

  if (tauri.deepLink?.onOpenUrl) {
    return tauri.deepLink.onOpenUrl((urls) => urls.forEach(onUrl));
  }

  if (!tauri.event?.listen) return () => {};

  return tauri.event.listen("deep-link://new-url", (event) => {
    emitDeepLinkUrls(onUrl, event.payload);
  });
}
