import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { api, type ComposerDetail } from "../services/api";
import { Badge } from "../components/ui/Badge";
import { ExportPanel } from "../components/exports/ExportPanel";

export function ComposerDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [search] = useSearchParams();
  const linkedDatabaseId = Number(search.get("db"));
  const [composer, setComposer] = useState<ComposerDetail | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id || !linkedDatabaseId) return;
    api.composers
      .show(id, linkedDatabaseId)
      .then(setComposer)
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load"));
  }, [id, linkedDatabaseId]);

  if (error) return <p className="text-red-400">{error}</p>;
  if (!composer) return <p className="text-zinc-500">Loading…</p>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">{composer.name}</h1>
        <div className="mt-3 flex flex-wrap gap-2">
          <Badge variant="emerald">{composer.mode}</Badge>
          <Badge>{composer.status}</Badge>
          <Badge variant="muted">{composer.message_count} messages</Badge>
          {composer.is_primary && <Badge variant="violet">PRIMARY</Badge>}
        </div>
        <p className="mt-2 font-mono text-xs text-zinc-500">{composer.id}</p>
      </div>
      <ExportPanel composer={composer} linkedDatabaseId={linkedDatabaseId} />
    </div>
  );
}
