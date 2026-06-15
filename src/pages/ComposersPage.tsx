import { useEffect, useState } from "react";
import { api, type LinkedDatabase } from "../services/api";
import { useComposers } from "../hooks/useComposers";
import { ComposerFilters } from "../components/composers/ComposerFilters";
import { ComposerTable } from "../components/composers/ComposerTable";

export function ComposersPage() {
  const [db, setDb] = useState<LinkedDatabase | null>(null);
  const [query, setQuery] = useState("");
  const [mode, setMode] = useState("");
  const { composers, total, loading, error } = useComposers(db?.id ?? null, query, mode);

  useEffect(() => {
    api.linkedDatabases.list().then((list) => setDb(list[0] ?? null));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Composers</h1>
        {db && <span className="text-sm text-ch-text-secondary">{total} total</span>}
      </div>

      {!db ? (
        <p className="text-sm text-ch-text-secondary">Link a database on the Dashboard first.</p>
      ) : (
        <>
          <ComposerFilters
            query={query}
            mode={mode}
            onQueryChange={setQuery}
            onModeChange={setMode}
          />
          {error && <p className="text-sm text-red-400">{error}</p>}
          {loading ? <p className="text-sm text-ch-text-secondary">Loading…</p> : <ComposerTable composers={composers} />}
        </>
      )}
    </div>
  );
}
