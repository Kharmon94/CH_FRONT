import { useWorkspace } from "../../contexts/WorkspaceContext";

export function WorkspaceSwitcher() {
  const { workspace, workspaces, setActiveWorkspace } = useWorkspace();

  if (workspaces.length <= 1) {
    return (
      <span className="text-xs text-zinc-500">{workspace?.name ?? "Workspace"}</span>
    );
  }

  return (
    <select
      value={workspace?.id ?? ""}
      onChange={(e) => setActiveWorkspace(Number(e.target.value))}
      className="w-full rounded-md border border-zinc-800 bg-zinc-950 px-2 py-1.5 text-xs text-zinc-300"
      aria-label="Select workspace"
    >
      {workspaces.map((w) => (
        <option key={w.id} value={w.id}>
          {w.name}
        </option>
      ))}
    </select>
  );
}
