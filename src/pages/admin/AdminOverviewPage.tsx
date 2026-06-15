import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { api, type AdminStats } from "../../services/api";
import { AdminPageHeader } from "../../components/admin/AdminPageHeader";
import { AdminStatCard } from "../../components/admin/AdminStatCard";
import { AdminListRow } from "../../components/admin/AdminListRow";
import { AdminEmptyState } from "../../components/admin/AdminEmptyState";
import { LicenseTierBadge } from "../../components/admin/LicenseTierBadge";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { PAGE_TRANSITION } from "../../lib/motion";

export function AdminOverviewPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    api.admin
      .stats()
      .then(setStats)
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Failed to load stats");
        setStats(null);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <motion.div {...PAGE_TRANSITION} className="space-y-8">
      <AdminPageHeader
        title="Overview"
        subtitle="Platform metrics and recent activity."
      />

      {error ? <p className="text-sm text-red-400">{error}</p> : null}
      {loading ? <p className="text-sm text-ch-text-secondary">Loading stats…</p> : null}

      {stats ? (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <AdminStatCard label="Users" value={stats.users_count} to="/admin/users" />
            <AdminStatCard label="Teams" value={stats.teams_count} to="/admin/teams" />
            <AdminStatCard label="Pro teams" value={stats.pro_teams_count} to="/admin/licenses?tier=pro" />
            <AdminStatCard label="Total exports" value={stats.total_exports} to="/admin/teams" />
          </div>

          <div className="flex flex-wrap gap-3">
            <Link to="/admin/users">
              <Button variant="secondary">Manage users</Button>
            </Link>
            <Link to="/admin/teams">
              <Button variant="secondary">Manage teams</Button>
            </Link>
            <Link to="/admin/licenses">
              <Button variant="secondary">View licenses</Button>
            </Link>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <h2 className="text-lg font-medium">Recent signups</h2>
              {stats.recent_users.length === 0 ? (
                <div className="mt-4">
                  <AdminEmptyState title="No users yet" />
                </div>
              ) : (
                <ul className="mt-4 space-y-2">
                  {stats.recent_users.map((user) => (
                    <AdminListRow
                      key={user.id}
                      to={`/admin/users/${user.id}`}
                      meta={
                        <Badge variant={user.role === "admin" ? "primary" : "muted"}>
                          {user.role}
                        </Badge>
                      }
                    >
                      <p className="truncate font-medium">{user.email}</p>
                      {user.created_at ? (
                        <p className="text-ch-text-secondary">
                          {new Date(user.created_at).toLocaleDateString()}
                        </p>
                      ) : null}
                    </AdminListRow>
                  ))}
                </ul>
              )}
            </Card>

            <Card>
              <h2 className="text-lg font-medium">Recent teams</h2>
              {stats.recent_teams.length === 0 ? (
                <div className="mt-4">
                  <AdminEmptyState title="No teams yet" />
                </div>
              ) : (
                <ul className="mt-4 space-y-2">
                  {stats.recent_teams.map((team) => (
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
                      <p className="text-ch-text-secondary">{team.slug}</p>
                    </AdminListRow>
                  ))}
                </ul>
              )}
            </Card>
          </div>
        </>
      ) : null}
    </motion.div>
  );
}
