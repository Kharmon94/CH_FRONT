import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { api, type AdminUser } from "../../services/api";
import { AdminPageHeader } from "../../components/admin/AdminPageHeader";
import { AdminSearchInput } from "../../components/admin/AdminSearchInput";
import { AdminListRow } from "../../components/admin/AdminListRow";
import { AdminEmptyState } from "../../components/admin/AdminEmptyState";
import { Badge } from "../../components/ui/Badge";
import { PAGE_TRANSITION } from "../../lib/motion";

export function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    api.admin.users
      .list()
      .then(setUsers)
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Failed to load users");
        setUsers([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return users;
    return users.filter(
      (user) =>
        user.email.toLowerCase().includes(q) ||
        (user.name?.toLowerCase().includes(q) ?? false)
    );
  }, [users, query]);

  return (
    <motion.div {...PAGE_TRANSITION} className="space-y-6">
      <AdminPageHeader
        title="Users"
        subtitle="Browse and manage user accounts."
        breadcrumbs={[
          { label: "Overview", to: "/admin" },
          { label: "Users" },
        ]}
      />

      <AdminSearchInput
        value={query}
        onChange={setQuery}
        placeholder="Search by email or name…"
      />

      {error ? <p className="text-sm text-red-400">{error}</p> : null}
      {loading ? <p className="text-sm text-ch-text-secondary">Loading users…</p> : null}

      {!loading && filtered.length === 0 ? (
        <AdminEmptyState
          title={query ? "No matching users" : "No users found"}
          description={query ? "Try a different search term." : undefined}
        />
      ) : null}

      {!loading && filtered.length > 0 ? (
        <ul className="space-y-2">
          {filtered.map((user) => (
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
              {user.name ? <p className="text-ch-text-secondary">{user.name}</p> : null}
            </AdminListRow>
          ))}
        </ul>
      ) : null}
    </motion.div>
  );
}
