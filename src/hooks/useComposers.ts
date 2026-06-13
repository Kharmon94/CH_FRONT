import { useCallback, useEffect, useState } from "react";
import { api, type Composer } from "../services/api";

export function useComposers(linkedDatabaseId: number | null, query: string, mode: string) {
  const [composers, setComposers] = useState<Composer[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!linkedDatabaseId) return;
    setLoading(true);
    setError(null);
    try {
      const result = await api.composers.list({
        linked_database_id: linkedDatabaseId,
        q: query || undefined,
        mode: mode || undefined,
      });
      setComposers(result.data);
      setTotal(result.meta.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load composers");
    } finally {
      setLoading(false);
    }
  }, [linkedDatabaseId, query, mode]);

  useEffect(() => {
    void load();
  }, [load]);

  return { composers, total, loading, error, reload: load };
}
