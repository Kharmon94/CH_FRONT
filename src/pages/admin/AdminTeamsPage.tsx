import { useEffect, useState } from "react";
import { api, type AdminTeam } from "../../services/api";
import { Button } from "../../components/ui/Button";

export function AdminTeamsPage() {
  const [teams, setTeams] = useState<AdminTeam[]>([]);
  const [tiers, setTiers] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    api.admin.teams
      .list()
      .then((rows) => {
        setTeams(rows);
        setTiers(Object.fromEntries(rows.map((t) => [t.id, t.license.tier])));
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Failed to load teams");
        setTeams([]);
      })
      .finally(() => setLoading(false));
  }, []);

  async function saveTier(teamId: number) {
    const tier = tiers[teamId];
    if (!tier) return;
    setSavingId(teamId);
    setError(null);
    setMessage(null);
    try {
      const updated = await api.admin.teams.update(teamId, { license_tier: tier });
      setTeams((prev) => prev.map((t) => (t.id === teamId ? updated : t)));
      setMessage(`Updated ${updated.name} to ${tier}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update team");
    } finally {
      setSavingId(null);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold">Teams</h1>

      {error && <p className="mt-4 text-sm text-red-400">{error}</p>}
      {message && <p className="mt-4 text-sm text-emerald-400">{message}</p>}
      {loading && <p className="mt-4 text-sm text-zinc-500">Loading teams…</p>}

      {!loading && teams.length === 0 && !error && (
        <p className="mt-4 text-sm text-zinc-500">No teams found.</p>
      )}

      <ul className="mt-4 space-y-3 text-sm">
        {teams.map((t) => (
          <li
            key={t.id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-zinc-800 px-3 py-3"
          >
            <div>
              <span className="font-medium">{t.name}</span>
              <span className="ml-2 text-zinc-500">
                {t.member_count} members · {t.export_count} exports
              </span>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={tiers[t.id] ?? t.license.tier}
                onChange={(e) => setTiers((prev) => ({ ...prev, [t.id]: e.target.value }))}
                className="rounded-md border border-zinc-700 bg-zinc-900 px-2 py-1 text-sm text-zinc-200"
              >
                <option value="free">Free</option>
                <option value="pro">Pro</option>
              </select>
              <Button
                variant="secondary"
                disabled={savingId === t.id || tiers[t.id] === t.license.tier}
                onClick={() => saveTier(t.id)}
              >
                {savingId === t.id ? "Saving…" : "Save"}
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
