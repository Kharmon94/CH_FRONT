import { useWorkspace } from "../../contexts/WorkspaceContext";

export function WorkspaceSwitcher() {
  const { workspace, workspaces, setActiveWorkspace } = useWorkspace();

  if (workspaces.length <= 1) {
    return <span className="text-xs text-ch-text-secondary">{workspace?.name ?? "Workspace"}</span>;
  }

  return (
    <select
      value={workspace?.id ?? ""}
      onChange={(e) => setActiveWorkspace(Number(e.target.value))}
      className="w-full rounded-xl border border-ch-border bg-ch-surface px-2 py-1.5 text-xs text-ch-text"
    >
      {workspaces.map((w) => (
        <option key={w.id} value={w.id}>
          {w.name}
        </option>
      ))}
    </select>
  );
}
