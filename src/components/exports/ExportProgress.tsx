import type { ExportStatus } from "../../services/api";

export function ExportProgress({ job }: { job: ExportStatus | null }) {
  if (!job) return null;

  return (
    <div className="mt-4 space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="capitalize text-ch-text-secondary">{job.status}</span>
        <span className="font-mono text-xs text-ch-text-secondary">
          {job.phase ? job.phase.replace(/_/g, " ") : ""} {job.progress_pct}%
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-ch-surface-elevated">
        <div
          className={`h-full transition-all ${
            job.format === "agent_clone" ? "bg-ch-accent" : "bg-ch-primary"
          }`}
          style={{ width: `${job.progress_pct}%` }}
        />
      </div>
      {job.error && <p className="text-sm text-red-500">{job.error}</p>}
      {job.status === "completed" && job.download_url && (
        <a
          href={job.download_url}
          className="inline-block text-sm text-ch-primary hover:underline"
          download
        >
          Download export
        </a>
      )}
    </div>
  );
}
