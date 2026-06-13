import { useCallback, useEffect, useState } from "react";
import { api, type ExportStatus } from "../services/api";

export function useExportJob(exportId: number | null) {
  const [exportJob, setExportJob] = useState<ExportStatus | null>(null);
  const [error, setError] = useState<string | null>(null);

  const poll = useCallback(async () => {
    if (!exportId) return;
    try {
      const status = await api.exports.poll(exportId);
      setExportJob(status);
      setError(status.error);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Poll failed");
    }
  }, [exportId]);

  useEffect(() => {
    if (!exportId) return;
    poll();
    const timer = setInterval(() => {
      setExportJob((current) => {
        if (current?.status === "completed" || current?.status === "failed") {
          clearInterval(timer);
          return current;
        }
        void poll();
        return current;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [exportId, poll]);

  return { exportJob, error, refresh: poll };
}
