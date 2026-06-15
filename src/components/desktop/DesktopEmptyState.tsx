import { Link } from "react-router-dom";
import { Button } from "../ui/Button";
import { detectPlatform, getDownloadUrl, hasDownloadUrl, PLATFORM_LABELS } from "../../lib/downloads";

export function DesktopEmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  const platform = detectPlatform();
  const downloadUrl = getDownloadUrl(platform);

  return (
    <div className="rounded-xl border border-ch-border bg-ch-surface-elevated px-6 py-8 text-center">
      <h2 className="text-lg font-semibold text-ch-text">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-ch-text-secondary">{description}</p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        {hasDownloadUrl(platform) && downloadUrl ? (
          <a href={downloadUrl} target="_blank" rel="noopener noreferrer">
            <Button>Download for {PLATFORM_LABELS[platform]}</Button>
          </a>
        ) : (
          <Link to="/download">
            <Button>Download desktop app</Button>
          </Link>
        )}
        <Link to="/app">
          <Button variant="secondary">Back to Dashboard</Button>
        </Link>
      </div>
    </div>
  );
}
