export type DownloadPlatform = "windows" | "mac" | "linux" | "unknown";

export const PLATFORM_LABELS: Record<DownloadPlatform, string> = {
  windows: "Windows",
  mac: "macOS",
  linux: "Linux / WSL",
  unknown: "your platform",
};

export function detectPlatform(): DownloadPlatform {
  if (typeof navigator === "undefined") return "unknown";

  const ua = navigator.userAgent.toLowerCase();
  const platform = (navigator.platform || "").toLowerCase();

  if (ua.includes("win") || platform.includes("win")) return "windows";
  if (ua.includes("mac") || platform.includes("mac")) return "mac";
  if (ua.includes("linux") || platform.includes("linux") || ua.includes("android")) return "linux";
  return "unknown";
}

const URLS: Record<DownloadPlatform, string | undefined> = {
  windows: import.meta.env.VITE_DOWNLOAD_URL_WINDOWS,
  mac: import.meta.env.VITE_DOWNLOAD_URL_MAC,
  linux: import.meta.env.VITE_DOWNLOAD_URL_LINUX,
  unknown: import.meta.env.VITE_DOWNLOAD_URL_LAUNCHER,
};

export function getDownloadUrls() {
  return {
    windows: import.meta.env.VITE_DOWNLOAD_URL_WINDOWS,
    mac: import.meta.env.VITE_DOWNLOAD_URL_MAC,
    linux: import.meta.env.VITE_DOWNLOAD_URL_LINUX,
    launcher: import.meta.env.VITE_DOWNLOAD_URL_LAUNCHER,
  };
}

export function getDownloadUrl(platform: DownloadPlatform = detectPlatform()): string | null {
  const direct = URLS[platform]?.trim();
  if (direct) return direct;

  const launcher = import.meta.env.VITE_DOWNLOAD_URL_LAUNCHER?.trim();
  if (launcher) return launcher;

  return null;
}

export function hasDownloadUrl(platform: DownloadPlatform = detectPlatform()): boolean {
  return getDownloadUrl(platform) != null;
}

export function isDesktopDeepLinkAvailable(): boolean {
  return (
    import.meta.env.VITE_DESKTOP_DEEPLINK_ENABLED === "true" ||
    (typeof window !== "undefined" && (window as Window & { __TAURI__?: unknown }).__TAURI__ != null)
  );
}

export function openDesktopDeepLink(action: "open" | "auth", params?: Record<string, string>) {
  const query = params ? `?${new URLSearchParams(params).toString()}` : "";
  window.location.href = `cursorhelp://${action}${query}`;
}

/** @deprecated Use openDesktopDeepLink */
export function openDesktopApp(): void {
  openDesktopDeepLink("open");
}
