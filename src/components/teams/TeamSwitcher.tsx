import { useTeam } from "../../contexts/TeamContext";

export function TeamSwitcher() {
  const { team, teams, setActiveTeam } = useTeam();

  if (teams.length <= 1) {
    return (
      <span className="truncate text-sm font-medium text-zinc-200">{team?.name ?? "Team"}</span>
    );
  }

  return (
    <select
      value={team?.id ?? ""}
      onChange={(e) => setActiveTeam(Number(e.target.value))}
      className="max-w-[180px] truncate rounded-md border border-zinc-700 bg-zinc-900 px-2 py-1.5 text-sm text-zinc-200"
      aria-label="Select team"
    >
      {teams.map((t) => (
        <option key={t.id} value={t.id}>
          {t.name}
        </option>
      ))}
    </select>
  );
}
