const DEFAULT_SITE_URL = "https://www.cursorhelp.com";

export function siteUrl(): string {
  const raw = (import.meta.env.VITE_SITE_URL ?? DEFAULT_SITE_URL).trim().replace(/\/$/, "");
  return raw || DEFAULT_SITE_URL;
}

/** Alias used across marketing pages */
export function getSiteUrl(): string {
  return siteUrl();
}

export function absoluteUrl(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${siteUrl()}${normalized}`;
}
