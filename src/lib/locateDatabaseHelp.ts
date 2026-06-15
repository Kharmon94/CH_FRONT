export type LocatePlatform = "windows" | "mac" | "linux" | "wsl";

export const CURSOR_DATABASE_FILENAME = "state.vscdb";

export const LOCATE_DATABASE_STEPS: Record<
  LocatePlatform,
  { title: string; paths: string[]; notes: string[] }
> = {
  windows: {
    title: "Windows",
    paths: ["%APPDATA%\\Cursor\\User\\globalStorage\\state.vscdb"],
    notes: [
      "Close Cursor before linking.",
      "In File Explorer, paste the path into the address bar and press Enter.",
      "If you run Cursor Help via WSL, use the /mnt/c/… path instead (see WSL tab).",
    ],
  },
  mac: {
    title: "macOS",
    paths: ["~/Library/Application Support/Cursor/User/globalStorage/state.vscdb"],
    notes: [
      "Close Cursor before linking.",
      "In Finder, press Cmd+Shift+G and paste the folder path.",
    ],
  },
  linux: {
    title: "Linux",
    paths: ["~/.config/Cursor/User/globalStorage/state.vscdb"],
    notes: ["Close Cursor before linking."],
  },
  wsl: {
    title: "WSL (Windows Cursor)",
    paths: [
      "/mnt/c/Users/<you>/AppData/Roaming/Cursor/User/globalStorage/state.vscdb",
    ],
    notes: [
      "Close Cursor on Windows before linking.",
      "The API reads files from the Linux side — use /mnt/c/… paths, not C:\\…",
      "Browse can auto-fill the path when the file size matches on this machine.",
    ],
  },
};
