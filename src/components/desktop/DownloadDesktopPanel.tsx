import { Link } from "react-router-dom";
import { Button } from "../ui/Button";
import {
  detectPlatform,
  getDownloadUrl,
  hasDownloadUrl,
  PLATFORM_LABELS,
} from "../../lib/downloads";

export function DownloadDesktopPanel({ compact = false }: { compact?: boolean }) {
  const platform = detectPlatform();
  const downloadUrl = getDownloadUrl(platform);
  const hasUrl = hasDownloadUrl(platform);

  return (
    <div className="space-y-4">
      <div>
        <h2 className={compact ? "text-lg font-medium" : "text-xl font-semibold"}>
          Install Cursor Help on your computer
        </h2>
        <p className="mt-2 text-sm text-ch-text-secondary">
          Linking, search, and export read <span className="font-mono text-ch-text">state.vscdb</span>{" "}
          locally. The web app manages your account and billing; the desktop app does the rest.
        </p>
      </div>

      <ol className="list-decimal space-y-2 pl-5 text-sm text-ch-text-secondary">
        <li>Download for {PLATFORM_LABELS[platform]}</li>
        <li>Sign in with the same account you use here</li>
        <li>The app auto-finds your Cursor database (or pick it manually)</li>
      </ol>

      <div className="flex flex-wrap gap-3">
        {hasUrl && downloadUrl ? (
          <a href={downloadUrl} target="_blank" rel="noopener noreferrer">
            <Button>Download for {PLATFORM_LABELS[platform]}</Button>
          </a>
        ) : (
          <Link to="/download">
            <Button>View download options</Button>
          </Link>
        )}
        <Link to="/help#locate-database">
          <Button variant="secondary">Manual path help</Button>
        </Link>
      </div>
    </div>
  );
}
