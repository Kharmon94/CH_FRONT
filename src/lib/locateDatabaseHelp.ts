export type LocatePlatform = "windows" | "mac" | "linux" | "wsl";

export const CURSOR_DATABASE_FILENAME = "state.vscdb";

export const LOCATE_DATABASE_RECOMMENDATIONS = [
  "Close Cursor completely before linking or refreshing the index.",
  "Large databases index most reliably when Cursor is not writing to state.vscdb.",
  "Use Browse on the Dashboard to select state.vscdb, or paste the full path if auto-locate fails.",
] as const;

export const LOCATE_DATABASE_STEPS: Record<
  LocatePlatform,
  { title: string; paths: string[]; notes: string[] }
> = {
  windows: {
    title: "Windows",
    paths: ["%APPDATA%\\Cursor\\User\\globalStorage\\state.vscdb"],
    notes: [
      "In File Explorer, paste the path into the address bar and press Enter.",
      "If you run Cursor Help via WSL, use the /mnt/c/… path instead (see WSL tab).",
    ],
  },
  mac: {
    title: "macOS",
    paths: ["~/Library/Application Support/Cursor/User/globalStorage/state.vscdb"],
    notes: ["In Finder, press Cmd+Shift+G and paste the folder path."],
  },
  linux: {
    title: "Linux",
    paths: ["~/.config/Cursor/User/globalStorage/state.vscdb"],
    notes: [],
  },
  wsl: {
    title: "WSL (Windows Cursor)",
    paths: [
      "/mnt/c/Users/<you>/AppData/Roaming/Cursor/User/globalStorage/state.vscdb",
    ],
    notes: [
      "The API reads files from the Linux side — use /mnt/c/… paths, not C:\\…",
      "Browse can auto-fill the path when the file size matches on this machine.",
    ],
  },
};
