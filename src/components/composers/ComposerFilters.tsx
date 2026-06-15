import { Input } from "../ui/Input";

const MODES = ["", "agent", "chat", "plan"];

export function ComposerFilters({
  query,
  mode,
  onQueryChange,
  onModeChange,
}: {
  query: string;
  mode: string;
  onQueryChange: (value: string) => void;
  onModeChange: (value: string) => void;
}) {
  return (
    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
      <Input
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        placeholder="Search composers…"
        className="sm:max-w-md"
      />
      <div className="flex flex-wrap gap-2">
        {MODES.map((item) => (
          <button
            key={item || "all"}
            type="button"
            onClick={() => onModeChange(item)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
              mode === item
                ? "bg-ch-primary text-ch-on-primary"
                : "bg-ch-surface-elevated text-ch-text-secondary hover:text-ch-text"
            }`}
          >
            {item || "all"}
          </button>
        ))}
      </div>
    </div>
  );
}
