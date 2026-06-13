import { useState } from "react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { api } from "../../services/api";

export function LinkDatabaseForm({ onLinked }: { onLinked: () => void }) {
  const [path, setPath] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await api.linkedDatabases.create(path.trim());
      onLinked();
      setPath("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to link database");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="mb-2 block text-sm text-zinc-400">Path to state.db</label>
        <Input
          value={path}
          onChange={(e) => setPath(e.target.value)}
          placeholder="/home/you/.../state.db"
          className="font-mono text-xs"
        />
        <p className="mt-2 text-xs text-zinc-500">
          WSL example: /mnt/c/Users/you/chat history/state.db — close Cursor first.
        </p>
      </div>
      {error && <p className="text-sm text-red-400">{error}</p>}
      <Button type="submit" disabled={loading || !path.trim()}>
        {loading ? "Linking…" : "Link database"}
      </Button>
    </form>
  );
}
