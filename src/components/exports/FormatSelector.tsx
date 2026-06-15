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
        className={`rounded-xl border px-4 py-2 text-sm transition ${
          value === "markdown"
            ? "border-ch-primary bg-ch-primary/10 text-ch-primary"
            : "border-ch-border text-ch-text-secondary hover:border-ch-primary/50"
        }`}
      >
        Markdown
      </button>
      {showAgentClone && (
        <button
          type="button"
          onClick={() => onChange("agent_clone")}
          className={`rounded-xl border px-4 py-2 text-sm transition ${
            value === "agent_clone"
              ? "border-ch-accent bg-ch-accent/10 text-ch-accent"
              : "border-ch-border text-ch-text-secondary hover:border-ch-accent/50"
          }`}
        >
          Agent Clone
        </button>
      )}
    </div>
  );
}
