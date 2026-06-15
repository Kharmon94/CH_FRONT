import { type FormEvent, useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "motion/react";
import { api, type AdminUser } from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";
import { AdminPageHeader } from "../../components/admin/AdminPageHeader";
import { AdminEmptyState } from "../../components/admin/AdminEmptyState";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { PAGE_TRANSITION } from "../../lib/motion";

export function AdminUserDetailPage() {
  const { userId } = useParams();
  const { user: currentUser } = useAuth();
  const id = Number(userId);

  const [user, setUser] = useState<AdminUser | null>(null);
  const [name, setName] = useState("");
  const [role, setRole] = useState<"admin" | "user">("user");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!Number.isFinite(id)) {
      setError("Invalid user id");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    api.admin.users
      .show(id)
      .then((detail) => {
        setUser(detail);
        setName(detail.name ?? "");
        setRole(detail.role === "admin" ? "admin" : "user");
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Failed to load user");
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const dirty = useMemo(() => {
    if (!user) return false;
    return name !== (user.name ?? "") || role !== user.role;
  }, [user, name, role]);

  const selfDemotionBlocked =
    currentUser?.id === user?.id && user?.role === "admin" && role === "user";

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (!user || !dirty) return;

    setSaving(true);
    setError(null);
    setMessage(null);
    try {
      const updated = await api.admin.users.update(user.id, { name: name.trim() || undefined, role });
      setUser(updated);
      setName(updated.name ?? "");
      setRole(updated.role === "admin" ? "admin" : "user");
      setMessage("User updated");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update user");
    } finally {
      setSaving(false);
    }
  }

  function onCancel() {
    if (!user) return;
    setName(user.name ?? "");
    setRole(user.role === "admin" ? "admin" : "user");
    setMessage(null);
    setError(null);
  }

  return (
    <motion.div {...PAGE_TRANSITION} className="space-y-6">
      <AdminPageHeader
        title={user?.email ?? "User"}
        subtitle={user?.name ?? undefined}
        breadcrumbs={[
          { label: "Overview", to: "/admin" },
          { label: "Users", to: "/admin/users" },
          { label: user?.email ?? "…" },
        ]}
      />

      {loading ? <p className="text-sm text-ch-text-secondary">Loading user…</p> : null}
      {error && !user ? <p className="text-sm text-red-400">{error}</p> : null}

      {user ? (
        <>
          <Card>
            <h2 className="text-lg font-medium">Account</h2>
            <dl className="mt-4 grid gap-4 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-ch-text-secondary">Email</dt>
                <dd className="mt-1 font-medium">{user.email}</dd>
              </div>
              <div>
                <dt className="text-ch-text-secondary">Joined</dt>
                <dd className="mt-1">
                  {user.created_at
                    ? new Date(user.created_at).toLocaleString()
                    : "—"}
                </dd>
              </div>
              <div>
                <dt className="text-ch-text-secondary">Current role</dt>
                <dd className="mt-1">
                  <Badge variant={user.role === "admin" ? "primary" : "muted"}>
                    {user.role}
                  </Badge>
                </dd>
              </div>
            </dl>
          </Card>

          <Card>
            <h2 className="text-lg font-medium">Edit profile</h2>
            <form onSubmit={onSubmit} className="mt-4 space-y-4">
              <div>
                <label htmlFor="user-name" className="mb-1 block text-sm text-ch-text-secondary">
                  Name
                </label>
                <Input
                  id="user-name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Display name"
                />
              </div>
              <div>
                <label htmlFor="user-role" className="mb-1 block text-sm text-ch-text-secondary">
                  Role
                </label>
                <select
                  id="user-role"
                  value={role}
                  onChange={(event) => setRole(event.target.value as "admin" | "user")}
                  disabled={selfDemotionBlocked}
                  className="w-full max-w-xs rounded-xl border border-ch-border bg-ch-surface px-3 py-2 text-sm text-ch-text focus:border-ch-primary focus:outline-none focus:ring-1 focus:ring-ch-primary disabled:opacity-50"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
                {selfDemotionBlocked ? (
                  <p className="mt-2 text-xs text-ch-text-secondary">
                    You cannot demote your own admin account.
                  </p>
                ) : null}
              </div>

              {message ? <p className="text-sm text-ch-primary">{message}</p> : null}
              {error ? <p className="text-sm text-red-400">{error}</p> : null}

              <div className="flex flex-wrap gap-3">
                <Button type="submit" disabled={!dirty || saving}>
                  {saving ? "Saving…" : "Save changes"}
                </Button>
                <Button type="button" variant="secondary" disabled={!dirty || saving} onClick={onCancel}>
                  Cancel
                </Button>
              </div>
            </form>
          </Card>

          <Card>
            <h2 className="text-lg font-medium">Team memberships</h2>
            {user.teams && user.teams.length > 0 ? (
              <ul className="mt-4 space-y-2 text-sm">
                {user.teams.map((team) => (
                  <li key={team.id}>
                    <Link
                      to={`/admin/teams/${team.id}`}
                      className="inline-flex flex-wrap items-center gap-2 rounded-xl border border-ch-border px-3 py-2 transition-colors hover:border-ch-primary/30 hover:bg-ch-surface-elevated"
                    >
                      <span className="font-medium">{team.name}</span>
                      <span className="text-ch-text-secondary">{team.slug}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="mt-4">
                <AdminEmptyState title="No team memberships" />
              </div>
            )}
          </Card>
        </>
      ) : null}
    </motion.div>
  );
}
