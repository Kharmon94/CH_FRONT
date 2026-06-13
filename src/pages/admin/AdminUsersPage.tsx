import { useEffect, useState } from "react";

type AdminUser = { id: number; email: string; name: string | null; role: string };

export function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL ?? "/api/v1"}/admin/users`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${localStorage.getItem("cursorhelp_jwt")}`,
      },
    })
      .then((r) => r.json())
      .then(setUsers)
      .catch(() => setUsers([]));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-semibold">Users</h1>
      <ul className="mt-4 space-y-2 text-sm">
        {users.map((u) => (
          <li key={u.id} className="rounded-md border border-zinc-800 px-3 py-2">
            {u.email} <span className="text-zinc-500">({u.role})</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
