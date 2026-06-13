import type { ExportStatus } from "../../services/api";

export function ExportProgress({ job }: { job: ExportStatus | null }) {
  if (!job) return null;

  return (
    <div className="mt-4 space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-zinc-400 capitalize">{job.status}</span>
        <span className="font-mono text-xs text-zinc-500">
          {job.phase ? job.phase.replace(/_/g, " ") : ""} {job.progress_pct}%
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-zinc-800">
        <div
          className={`h-full transition-all ${
            job.format === "agent_clone" ? "bg-violet-500" : "bg-emerald-500"
          }`}
          style={{ width: `${job.progress_pct}%` }}
        />
      </div>
      {job.error && <p className="text-sm text-red-400">{job.error}</p>}
      {job.status === "completed" && job.download_url && (
        <a
          href={job.download_url}
          className="inline-block text-sm text-emerald-400 hover:underline"
          download
        >
          Download export
        </a>
      )}
    </div>
  );
}
