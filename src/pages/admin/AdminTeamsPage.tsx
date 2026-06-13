import { useEffect, useState } from "react";

type AdminTeam = {
  id: number;
  name: string;
  member_count: number;
  license: { tier: string; pro: boolean };
};

export function AdminTeamsPage() {
  const [teams, setTeams] = useState<AdminTeam[]>([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL ?? "/api/v1"}/admin/teams`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${localStorage.getItem("cursorhelp_jwt")}`,
      },
    })
      .then((r) => r.json())
      .then(setTeams)
      .catch(() => setTeams([]));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-semibold">Teams</h1>
      <ul className="mt-4 space-y-2 text-sm">
        {teams.map((t) => (
          <li key={t.id} className="rounded-md border border-zinc-800 px-3 py-2">
            {t.name} — {t.license.tier} ({t.member_count} members)
          </li>
        ))}
      </ul>
    </div>
  );
}
