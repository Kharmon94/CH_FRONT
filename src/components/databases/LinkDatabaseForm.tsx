import { useRef, useState } from "react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { api } from "../../services/api";

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

    if (file.path?.trim()) {
      setPath(file.path.trim());
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
      setPath(result.path);
      setPickerNote(`Found ${file.name} on this machine. Confirm the path, then link.`);
    } catch (err) {
      setPickerNote(
        `Selected ${file.name} (${formatFileSize(file.size)}). Paste the full server path below — browsers cannot share file paths automatically.`
      );
      if (err instanceof Error && err.message) {
        setError(err.message);
      }
    } finally {
      setLocating(false);
    }
  }

  async function openFilePicker() {
    setError(null);

    const openPicker = (
      window as Window & {
        showOpenFilePicker?: (options: {
          multiple?: boolean;
          types?: Array<{
            description: string;
            accept: Record<string, string[]>;
          }>;
        }) => Promise<FileSystemFileHandle[]>;
      }
    ).showOpenFilePicker;

    if (openPicker) {
      try {
        const [handle] = await openPicker({
          multiple: false,
          types: [
            {
              description: "SQLite database",
              accept: {
                "application/x-sqlite3": [".vscdb"],
                "application/octet-stream": [".vscdb"],
              },
            },
          ],
        });
        await resolvePathFromFile(await handle.getFile());
        return;
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
      }
    }

    fileInputRef.current?.click();
  }

  async function handleFileInputChange(file: File | null) {
    if (!file) return;
    await resolvePathFromFile(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await api.linkedDatabases.create(path.trim());
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
      <div>
        <label className="mb-2 block text-sm text-ch-text-secondary">Path to Cursor database</label>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Input
            value={path}
            onChange={(e) => setPath(e.target.value)}
            placeholder="/…/Cursor/User/globalStorage/state.vscdb"
            className="font-mono text-xs"
          />
          <Button
            type="button"
            variant="secondary"
            className="shrink-0"
            onClick={() => void openFilePicker()}
            disabled={locating}
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
            Browse for state.vscdb in globalStorage, or paste the full path. Close Cursor first.
          </p>
        )}
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
      <Button type="submit" disabled={loading || locating || !path.trim()}>
        {loading ? "Linking…" : "Link database"}
      </Button>
    </form>
  );
}
