import { useCallback, useEffect, useState } from "react";
import { api, type LinkedDatabase } from "../services/api";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { LinkDatabaseForm } from "../components/databases/LinkDatabaseForm";
import { LocateDatabaseHelpButton } from "../components/databases/LocateDatabaseHelp";

export function DashboardPage() {
  const [databases, setDatabases] = useState<LinkedDatabase[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setDatabases(await api.linkedDatabases.list());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
    const timer = setInterval(load, 3000);
    return () => clearInterval(timer);
  }, [load]);

  const active = databases[0];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>

      <Card>
        <div className="mb-4 flex items-start justify-between gap-4">
          <h2 className="text-lg font-medium">Link database</h2>
          <LocateDatabaseHelpButton className="shrink-0" />
        </div>
        <LinkDatabaseForm onLinked={load} />
      </Card>

      {loading && !active ? (
        <p className="text-sm text-ch-text-secondary">Loading…</p>
      ) : active ? (
        <Card>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-medium">Linked database</h2>
              <p className="mt-2 font-mono text-xs text-ch-text-secondary break-all">{active.path}</p>
              <dl className="mt-4 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <dt className="text-ch-text-secondary">Composers</dt>
                  <dd className="text-xl font-semibold">{active.composer_count}</dd>
                </div>
                <div>
                  <dt className="text-ch-text-secondary">Index status</dt>
                  <dd className="capitalize">{active.index_status}</dd>
                </div>
              </dl>
            </div>
            <Button
              variant="secondary"
              onClick={() => api.linkedDatabases.refresh(active.id).then(load)}
              disabled={active.index_status === "indexing"}
            >
              Refresh index
            </Button>
          </div>
        </Card>
      ) : null}
    </div>
  );
}
