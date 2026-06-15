const AUTH_ROUTES = [
  "/app/login",
  "/app/sign-up",
  "/app/forgot-password",
  "/app/reset-password",
  "/app/oauth/google/callback",
  "/admin/login",
];

export function shouldShowThemeToggle(pathname: string): boolean {
  const normalized =
    pathname.length > 1 && pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;
  return !AUTH_ROUTES.some(
    (route) => normalized === route || normalized.startsWith(`${route}/`)
  );
}
