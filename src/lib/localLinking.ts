import { isDesktopApp, isLocalEngineReachable } from "./localEngine";

export function isAbsoluteDatabasePath(path: string): boolean {
  const trimmed = path.trim();
  if (!trimmed) return false;
  if (trimmed.startsWith("/")) return true;
  if (/^[A-Za-z]:[\\/]/.test(trimmed)) return true;
  return false;
}

export const DESKTOP_DOWNLOAD_MESSAGE =
  "Search and export require the Cursor Help desktop app on your computer. Sign in here for billing and account settings, then install the app from the Download page to link your database.";

export const BROWSER_PICKER_MESSAGE =
  "Browsers cannot open AppData or other protected folders directly. Paste the full path to state.vscdb below, or use Browse in the desktop app.";

/** @deprecated Use isLocalEngineReachable from lib/localEngine */
export function isLocalLinkingEnvironment(): boolean {
  if (import.meta.env.DEV) return true;
  return isDesktopApp();
}

/** @deprecated Use DESKTOP_DOWNLOAD_MESSAGE */
export const LOCAL_LINKING_MESSAGE = DESKTOP_DOWNLOAD_MESSAGE;

export { isDesktopApp, isLocalEngineReachable };
