import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { api, type AdminTeam } from "../../services/api";
import { AdminPageHeader } from "../../components/admin/AdminPageHeader";
import { AdminSearchInput } from "../../components/admin/AdminSearchInput";
import { AdminListRow } from "../../components/admin/AdminListRow";
import { AdminEmptyState } from "../../components/admin/AdminEmptyState";
import { LicenseTierBadge } from "../../components/admin/LicenseTierBadge";
import { PAGE_TRANSITION } from "../../lib/motion";

export function AdminTeamsPage() {
  const [teams, setTeams] = useState<AdminTeam[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    api.admin.teams
      .list()
      .then(setTeams)
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Failed to load teams");
        setTeams([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return teams;
    return teams.filter(
      (team) =>
        team.name.toLowerCase().includes(q) || team.slug.toLowerCase().includes(q)
    );
  }, [teams, query]);

  return (
    <motion.div {...PAGE_TRANSITION} className="space-y-6">
      <AdminPageHeader
        title="Teams"
        subtitle="Browse teams and open detail pages to manage licenses."
        breadcrumbs={[
          { label: "Overview", to: "/admin" },
          { label: "Teams" },
        ]}
      />

      <AdminSearchInput
        value={query}
        onChange={setQuery}
        placeholder="Search by name or slug…"
      />

      {error ? <p className="text-sm text-red-400">{error}</p> : null}
      {loading ? <p className="text-sm text-ch-text-secondary">Loading teams…</p> : null}

      {!loading && filtered.length === 0 ? (
        <AdminEmptyState
          title={query ? "No matching teams" : "No teams found"}
          description={query ? "Try a different search term." : undefined}
        />
      ) : null}

      {!loading && filtered.length > 0 ? (
        <ul className="space-y-2">
          {filtered.map((team) => (
            <AdminListRow
              key={team.id}
              to={`/admin/teams/${team.id}`}
              meta={
                <LicenseTierBadge
                  tier={team.license.tier}
                  status={team.license.status}
                />
              }
            >
              <p className="truncate font-medium">{team.name}</p>
              <p className="text-ch-text-secondary">
                {team.slug} · {team.member_count} members · {team.export_count} exports
              </p>
            </AdminListRow>
          ))}
        </ul>
      ) : null}
    </motion.div>
  );
}
