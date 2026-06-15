import { type FormEvent, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "motion/react";
import { api, type AdminTeam } from "../../services/api";
import { AdminPageHeader } from "../../components/admin/AdminPageHeader";
import { AdminEmptyState } from "../../components/admin/AdminEmptyState";
import { LicenseTierBadge } from "../../components/admin/LicenseTierBadge";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { PAGE_TRANSITION } from "../../lib/motion";

export function AdminTeamDetailPage() {
  const { teamId } = useParams();
  const id = Number(teamId);

  const [team, setTeam] = useState<AdminTeam | null>(null);
  const [name, setName] = useState("");
  const [tier, setTier] = useState("free");
  const [loading, setLoading] = useState(true);
  const [savingName, setSavingName] = useState(false);
  const [savingLicense, setSavingLicense] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nameMessage, setNameMessage] = useState<string | null>(null);
  const [licenseMessage, setLicenseMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!Number.isFinite(id)) {
      setError("Invalid team id");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    api.admin.teams
      .show(id)
      .then((detail) => {
        setTeam(detail);
        setName(detail.name);
        setTier(detail.license.tier);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Failed to load team");
        setTeam(null);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const nameDirty = useMemo(() => team != null && name.trim() !== team.name, [team, name]);
  const licenseDirty = useMemo(
    () => team != null && tier !== team.license.tier,
    [team, tier]
  );

  async function saveName(event: FormEvent) {
    event.preventDefault();
    if (!team || !nameDirty) return;

    setSavingName(true);
    setError(null);
    setNameMessage(null);
    try {
      const updated = await api.admin.teams.update(team.id, { name: name.trim() });
      setTeam(updated);
      setName(updated.name);
      setNameMessage("Team name updated");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update team name");
    } finally {
      setSavingName(false);
    }
  }

  async function saveLicense() {
    if (!team || !licenseDirty) return;

    setSavingLicense(true);
    setError(null);
    setLicenseMessage(null);
    try {
      const updated = await api.admin.teams.update(team.id, { license_tier: tier });
      setTeam(updated);
      setTier(updated.license.tier);
      setLicenseMessage("License updated");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update license");
    } finally {
      setSavingLicense(false);
    }
  }

  return (
    <motion.div {...PAGE_TRANSITION} className="space-y-6">
      <AdminPageHeader
        title={team?.name ?? "Team"}
        subtitle={team?.slug}
        breadcrumbs={[
          { label: "Overview", to: "/admin" },
          { label: "Teams", to: "/admin/teams" },
          { label: team?.name ?? "…" },
        ]}
      />

      {loading ? <p className="text-sm text-ch-text-secondary">Loading team…</p> : null}
      {error && !team ? <p className="text-sm text-red-400">{error}</p> : null}

      {team ? (
        <>
          <Card>
            <h2 className="text-lg font-medium">Overview</h2>
            <dl className="mt-4 grid gap-4 text-sm sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <dt className="text-ch-text-secondary">Slug</dt>
                <dd className="mt-1 font-mono text-xs">{team.slug}</dd>
              </div>
              <div>
                <dt className="text-ch-text-secondary">Created</dt>
                <dd className="mt-1">
                  {team.created_at
                    ? new Date(team.created_at).toLocaleString()
                    : "—"}
                </dd>
              </div>
              <div>
                <dt className="text-ch-text-secondary">Members</dt>
                <dd className="mt-1 text-xl font-semibold tabular-nums">{team.member_count}</dd>
              </div>
              <div>
                <dt className="text-ch-text-secondary">Exports</dt>
                <dd className="mt-1 text-xl font-semibold tabular-nums">{team.export_count}</dd>
              </div>
            </dl>
          </Card>

          <Card>
            <h2 className="text-lg font-medium">License</h2>
            <div className="mt-4 flex flex-wrap items-end gap-4">
              <div>
                <label htmlFor="team-tier" className="mb-1 block text-sm text-ch-text-secondary">
                  Tier
                </label>
                <select
                  id="team-tier"
                  value={tier}
                  onChange={(event) => setTier(event.target.value)}
                  className="rounded-xl border border-ch-border bg-ch-surface px-3 py-2 text-sm text-ch-text focus:border-ch-primary focus:outline-none focus:ring-1 focus:ring-ch-primary"
                >
                  <option value="free">Free</option>
                  <option value="pro">Pro</option>
                </select>
              </div>
              <div>
                <p className="mb-1 text-sm text-ch-text-secondary">Status</p>
                <LicenseTierBadge tier={team.license.tier} status={team.license.status} />
              </div>
              <Button
                variant="secondary"
                disabled={!licenseDirty || savingLicense}
                onClick={() => void saveLicense()}
              >
                {savingLicense ? "Saving…" : "Save license"}
              </Button>
            </div>
            {licenseMessage ? <p className="mt-3 text-sm text-ch-primary">{licenseMessage}</p> : null}
          </Card>

          <Card>
            <h2 className="text-lg font-medium">Team name</h2>
            <form onSubmit={saveName} className="mt-4 flex flex-wrap items-end gap-3">
              <div className="min-w-[240px] flex-1">
                <Input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Team name"
                />
              </div>
              <Button type="submit" variant="secondary" disabled={!nameDirty || savingName}>
                {savingName ? "Saving…" : "Save name"}
              </Button>
            </form>
            {nameMessage ? <p className="mt-3 text-sm text-ch-primary">{nameMessage}</p> : null}
          </Card>

          {error ? <p className="text-sm text-red-400">{error}</p> : null}

          <Card>
            <h2 className="text-lg font-medium">Members</h2>
            {team.members && team.members.length > 0 ? (
              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-ch-border text-ch-text-secondary">
                      <th className="pb-2 pr-4 font-medium">Email</th>
                      <th className="pb-2 font-medium">Role</th>
                    </tr>
                  </thead>
                  <tbody>
                    {team.members.map((member) => (
                      <tr key={member.id} className="border-b border-ch-border/60">
                        <td className="py-2 pr-4">{member.email}</td>
                        <td className="py-2 capitalize">{member.role}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="mt-4">
                <AdminEmptyState title="No members" />
              </div>
            )}
          </Card>

          <Card>
            <h2 className="text-lg font-medium">Workspaces</h2>
            {team.workspaces && team.workspaces.length > 0 ? (
              <ul className="mt-4 space-y-2 text-sm">
                {team.workspaces.map((workspace) => (
                  <li
                    key={workspace.id}
                    className="rounded-xl border border-ch-border px-3 py-2"
                  >
                    <p className="font-medium">{workspace.name}</p>
                    <p className="text-ch-text-secondary">{workspace.slug}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="mt-4">
                <AdminEmptyState title="No workspaces" />
              </div>
            )}
          </Card>
        </>
      ) : null}
    </motion.div>
  );
}
