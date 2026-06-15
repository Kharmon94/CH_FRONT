import { useRef, useState } from "react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { api } from "../../services/api";
import {
  BROWSER_PICKER_MESSAGE,
  isAbsoluteDatabasePath,
  isLocalLinkingEnvironment,
  LOCAL_LINKING_MESSAGE,
} from "../../lib/localLinking";

type FileWithPath = File & { path?: string };

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  const units = ["KB", "MB", "GB", "TB"];
  let size = bytes / 1024;
  let unitIndex = 0;
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex += 1;
  }
  return `${size.toFixed(size >= 10 ? 0 : 1)} ${units[unitIndex]}`;
}

export function LinkDatabaseForm({ onLinked }: { onLinked: () => void }) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const localLinking = isLocalLinkingEnvironment();
  const [path, setPath] = useState("");
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [pickerNote, setPickerNote] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [locating, setLocating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function resolvePathFromFile(file: FileWithPath) {
    setSelectedFileName(file.name);
    setPickerNote(null);
    setError(null);

    if (!localLinking) {
      setPickerNote(BROWSER_PICKER_MESSAGE);
      return;
    }

    const electronPath = file.path?.trim();
    if (electronPath && isAbsoluteDatabasePath(electronPath)) {
      setPath(electronPath);
      setPickerNote(`Using path from your system: ${file.name}`);
      return;
    }

    setLocating(true);
    try {
      const result = await api.linkedDatabases.locate({
        filename: file.name,
        byte_size: file.size,
        last_modified_ms: file.lastModified,
      });
      if (!isAbsoluteDatabasePath(result.path)) {
        throw new Error("Auto-locate returned an invalid path. Paste the full path manually.");
      }
      setPath(result.path);
      setPickerNote(`Found ${file.name} on this machine. Confirm the path, then link.`);
    } catch (err) {
      setPickerNote(
        `Selected ${file.name} (${formatFileSize(file.size)}). ${BROWSER_PICKER_MESSAGE}`
      );
      if (err instanceof Error && err.message) {
        setError(err.message);
      }
    } finally {
      setLocating(false);
    }
  }

  function openFilePicker() {
    if (!localLinking) {
      setError(LOCAL_LINKING_MESSAGE);
      return;
    }
    setError(null);
    fileInputRef.current?.click();
  }

  async function handleFileInputChange(file: File | null) {
    if (!file) return;
    await resolvePathFromFile(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!localLinking) {
      setError(LOCAL_LINKING_MESSAGE);
      return;
    }

    const trimmed = path.trim();
    if (!isAbsoluteDatabasePath(trimmed)) {
      setError(
        "Enter the full absolute path to state.vscdb (for example /mnt/c/Users/you/AppData/Roaming/Cursor/User/globalStorage/state.vscdb)."
      );
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await api.linkedDatabases.create(trimmed);
      onLinked();
      setPath("");
      setSelectedFileName(null);
      setPickerNote(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to link database");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {!localLinking ? (
        <div className="rounded-lg border border-ch-border bg-ch-surface-elevated px-4 py-3 text-sm text-ch-text-secondary">
          {LOCAL_LINKING_MESSAGE}
        </div>
      ) : null}

      <div>
        <label className="mb-2 block text-sm text-ch-text-secondary">Path to Cursor database</label>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Input
            value={path}
            onChange={(e) => setPath(e.target.value)}
            placeholder="/mnt/c/Users/you/AppData/Roaming/Cursor/User/globalStorage/state.vscdb"
            className="font-mono text-xs"
            disabled={!localLinking}
          />
          <Button
            type="button"
            variant="secondary"
            className="shrink-0"
            onClick={openFilePicker}
            disabled={!localLinking || locating}
          >
            {locating ? "Locating…" : "Browse…"}
          </Button>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept=".vscdb,application/x-sqlite3,application/octet-stream"
          className="hidden"
          onChange={(e) => void handleFileInputChange(e.target.files?.[0] ?? null)}
        />
        {selectedFileName && pickerNote ? (
          <p className="mt-2 text-xs text-ch-text-secondary">{pickerNote}</p>
        ) : (
          <p className="mt-2 text-xs text-ch-text-secondary">
            {localLinking
              ? "Browse confirms the file, then auto-fills the path when possible. If Browse fails, paste the full path manually. Close Cursor first."
              : "Run bin/dev locally to link your database."}
          </p>
        )}
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
      <Button type="submit" disabled={!localLinking || loading || locating || !path.trim()}>
        {loading ? "Linking…" : "Link database"}
      </Button>
    </form>
  );
}
