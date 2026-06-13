import type { ExportFormat } from "../../services/api";

export function FormatSelector({
  value,
  onChange,
  showAgentClone = true,
}: {
  value: ExportFormat;
  onChange: (format: ExportFormat) => void;
  showAgentClone?: boolean;
}) {
  return (
    <div className="flex gap-2">
      <button
        type="button"
        onClick={() => onChange("markdown")}
        className={`rounded-md border px-4 py-2 text-sm ${
          value === "markdown"
            ? "border-emerald-500 bg-emerald-500/10 text-emerald-400"
            : "border-zinc-700 text-zinc-300 hover:border-zinc-600"
        }`}
      >
        Markdown
      </button>
      {showAgentClone && (
        <button
          type="button"
          onClick={() => onChange("agent_clone")}
          className={`rounded-md border px-4 py-2 text-sm ${
            value === "agent_clone"
              ? "border-violet-500 bg-violet-500/10 text-violet-400"
              : "border-zinc-700 text-zinc-300 hover:border-zinc-600"
          }`}
        >
          Agent Clone
        </button>
      )}
    </div>
  );
}
