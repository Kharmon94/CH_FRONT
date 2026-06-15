import { useTeam } from "../../contexts/TeamContext";

export function TeamSwitcher() {
  const { team, teams, setActiveTeam } = useTeam();

  if (teams.length <= 1) {
    return <span className="truncate text-sm font-medium text-ch-text">{team?.name ?? "Team"}</span>;
  }

  return (
    <select
      value={team?.id ?? ""}
      onChange={(e) => setActiveTeam(Number(e.target.value))}
      className="max-w-[180px] truncate rounded-xl border border-ch-border bg-ch-surface px-2 py-1.5 text-sm text-ch-text"
    >
      {teams.map((t) => (
        <option key={t.id} value={t.id}>
          {t.name}
        </option>
      ))}
    </select>
  );
}
