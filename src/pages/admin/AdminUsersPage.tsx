import { useEffect, useState } from "react";
import { api, type AdminUser } from "../../services/api";

export function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [selected, setSelected] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
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

  async function selectUser(user: AdminUser) {
    setSelected(user);
    setDetailLoading(true);
    setError(null);
    try {
      const detail = await api.admin.users.show(user.id);
      setSelected(detail);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load user");
    } finally {
      setDetailLoading(false);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold">Users</h1>

      {error && <p className="mt-4 text-sm text-red-400">{error}</p>}
      {loading && <p className="mt-4 text-sm text-ch-text-secondary">Loading users…</p>}

      {!loading && users.length === 0 && !error && (
        <p className="mt-4 text-sm text-ch-text-secondary">No users found.</p>
      )}

      <div className="mt-4 grid gap-6 lg:grid-cols-2">
        <ul className="space-y-2 text-sm">
          {users.map((u) => (
            <li key={u.id}>
              <button
                type="button"
                onClick={() => selectUser(u)}
                className={`w-full rounded-md border px-3 py-2 text-left transition ${
                  selected?.id === u.id
                    ? "border-ch-primary/50 bg-ch-primary/10"
                    : "border-ch-border hover:border-ch-border"
                }`}
              >
                <span className="font-medium">{u.email}</span>
                <span className="ml-2 text-ch-text-secondary">({u.role})</span>
              </button>
            </li>
          ))}
        </ul>

        {selected && (
          <div className="rounded-md border border-ch-border p-4 text-sm">
            {detailLoading ? (
              <p className="text-ch-text-secondary">Loading details…</p>
            ) : (
              <>
                <h2 className="text-lg font-semibold">{selected.email}</h2>
                {selected.name && <p className="mt-1 text-ch-text-secondary">{selected.name}</p>}
                <p className="mt-2 text-ch-text-secondary">Role: {selected.role}</p>
                {selected.created_at && (
                  <p className="text-ch-text-secondary">Joined: {new Date(selected.created_at).toLocaleDateString()}</p>
                )}
                <h3 className="mt-4 font-medium text-ch-text">Teams</h3>
                {selected.teams && selected.teams.length > 0 ? (
                  <ul className="mt-2 space-y-1 text-ch-text-secondary">
                    {selected.teams.map((t) => (
                      <li key={t.id}>
                        {t.name} <span className="text-ch-text-secondary">({t.slug})</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-2 text-ch-text-secondary">No teams</p>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
