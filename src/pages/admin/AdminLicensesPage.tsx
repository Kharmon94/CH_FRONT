import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "motion/react";
import { api, type AdminLicense } from "../../services/api";
import { AdminPageHeader } from "../../components/admin/AdminPageHeader";
import { AdminListRow } from "../../components/admin/AdminListRow";
import { AdminEmptyState } from "../../components/admin/AdminEmptyState";
import { LicenseTierBadge } from "../../components/admin/LicenseTierBadge";
import { PAGE_TRANSITION } from "../../lib/motion";

type TierFilter = "all" | "free" | "pro";

const FILTERS: { key: TierFilter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "free", label: "Free" },
  { key: "pro", label: "Pro" },
];

export function AdminLicensesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const tierParam = searchParams.get("tier");
  const activeFilter: TierFilter =
    tierParam === "free" || tierParam === "pro" ? tierParam : "all";

  const [licenses, setLicenses] = useState<AdminLicense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    api.admin.licenses
      .list(activeFilter === "all" ? undefined : { tier: activeFilter })
      .then(setLicenses)
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Failed to load licenses");
        setLicenses([]);
      })
      .finally(() => setLoading(false));
  }, [activeFilter]);

  const sorted = useMemo(
    () => [...licenses].sort((a, b) => a.team_name.localeCompare(b.team_name)),
    [licenses]
  );

  function setFilter(filter: TierFilter) {
    if (filter === "all") {
      setSearchParams({});
    } else {
      setSearchParams({ tier: filter });
    }
  }

  return (
    <motion.div {...PAGE_TRANSITION} className="space-y-6">
      <AdminPageHeader
        title="Licenses"
        subtitle="Read-only license overview. Edit tiers on team detail pages."
        breadcrumbs={[
          { label: "Overview", to: "/admin" },
          { label: "Licenses" },
        ]}
      />

      <div className="flex flex-wrap gap-2">
        {FILTERS.map((filter) => (
          <button
            key={filter.key}
            type="button"
            onClick={() => setFilter(filter.key)}
            className={`rounded-full px-4 py-2 text-sm transition-colors ${
              activeFilter === filter.key
                ? "bg-ch-primary/15 text-ch-primary"
                : "border border-ch-border text-ch-text-secondary hover:text-ch-text"
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {error ? <p className="text-sm text-red-400">{error}</p> : null}
      {loading ? <p className="text-sm text-ch-text-secondary">Loading licenses…</p> : null}

      {!loading && sorted.length === 0 ? (
        <AdminEmptyState title="No licenses match this filter" />
      ) : null}

      {!loading && sorted.length > 0 ? (
        <ul className="space-y-2">
          {sorted.map((license) => (
            <AdminListRow
              key={license.team_id}
              to={`/admin/teams/${license.team_id}`}
              meta={
                <LicenseTierBadge tier={license.tier} status={license.status} />
              }
            >
              <p className="truncate font-medium">{license.team_name}</p>
              <p className="text-ch-text-secondary">
                {license.team_slug} · {license.member_count} members · {license.export_count}{" "}
                exports
              </p>
            </AdminListRow>
          ))}
        </ul>
      ) : null}
    </motion.div>
  );
}
