export type NavContext = "public" | "app" | "admin";

const MINIMAL_CHROME_PATHS = new Set([
  "/app/login",
  "/app/sign-up",
  "/app/forgot-password",
  "/app/reset-password",
  "/app/oauth/google/callback",
  "/admin/login",
]);

export function isMinimalChromePath(pathname: string): boolean {
  return MINIMAL_CHROME_PATHS.has(pathname);
}

export function resolveNavContext(pathname: string): NavContext {
  if (pathname.startsWith("/app") && !isMinimalChromePath(pathname)) return "app";
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") return "admin";
  return "public";
}

export function shouldShowShellNav(pathname: string): boolean {
  return !isMinimalChromePath(pathname);
}
