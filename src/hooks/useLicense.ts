import { useCallback, useEffect, useState } from "react";
import { api, type License } from "../services/api";
import { useTeam } from "../contexts/TeamContext";

export function useLicense() {
  const { team } = useTeam();
  const [license, setLicense] = useState<License | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!team) {
      setLicense(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await api.license();
      setLicense(data);
    } catch (err) {
      setLicense(null);
      setError(err instanceof Error ? err.message : "Failed to load license");
    } finally {
      setLoading(false);
    }
  }, [team]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { license, loading, error, refresh };
}
