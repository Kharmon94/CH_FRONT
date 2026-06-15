import { Link } from "react-router-dom";
import { Download, Monitor, Apple, Terminal } from "lucide-react";
import { PageMeta } from "../components/seo/PageMeta";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import {
  detectPlatform,
  getDownloadUrl,
  isDesktopDeepLinkAvailable,
  openDesktopApp,
  type DownloadPlatform,
} from "../lib/downloads";

const PLATFORMS: Array<{
  id: DownloadPlatform;
  label: string;
  hint: string;
  icon: React.ComponentType<{ className?: string }>;
}> = [
  { id: "windows", label: "Windows", hint: "x64 installer", icon: Monitor },
  { id: "mac", label: "macOS", hint: "Apple Silicon & Intel", icon: Apple },
  { id: "linux", label: "Linux / WSL", hint: "AppImage or launcher", icon: Terminal },
];

export function DownloadPage() {
  const detected = detectPlatform();

  return (
    <main className="py-8">
      <PageMeta
        title="Download"
        description="Download Cursor Help for Windows, macOS, or Linux. Link your local Cursor database, search every chat, and export Agent Clone handoffs — privately on your machine."
        path="/download"
      />

      <h1 className="text-4xl font-bold" style={{ fontFamily: "var(--font-display)" }}>
        Download Cursor Help
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-ch-text-secondary">
        The desktop app reads <code className="font-mono text-sm">state.vscdb</code> on your computer. The website handles
        your account and billing — search and export require the local app.
      </p>

      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {PLATFORMS.map((platform) => {
          const Icon = platform.icon;
          const url = getDownloadUrl(platform.id);
          const highlighted = detected === platform.id;
          return (
            <Card
              key={platform.id}
              className={highlighted ? "border-ch-primary/50 ring-1 ring-ch-primary/30" : undefined}
            >
              <div className="flex items-center gap-3">
                <Icon className="h-6 w-6 text-ch-primary" />
                <div>
                  <h2 className="text-lg font-semibold">{platform.label}</h2>
                  <p className="text-xs text-ch-text-secondary">{platform.hint}</p>
                </div>
              </div>
              {url ? (
                <a href={url} className="mt-6 inline-block" target="_blank" rel="noopener noreferrer">
                  <Button className="w-full">
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                </a>
              ) : (
                <p className="mt-6 text-sm text-ch-text-secondary">
                  Coming soon.{" "}
                  <Link to="/help" className="text-ch-primary hover:underline">
                    Get notified via Help
                  </Link>
                </p>
              )}
              {highlighted ? (
                <p className="mt-2 text-xs font-medium text-ch-primary">Detected for your device</p>
              ) : null}
            </Card>
          );
        })}
      </div>

      <Card className="mt-10 space-y-3 text-sm text-ch-text-secondary">
        <h2 className="text-lg font-semibold text-ch-text">Before you install</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>Close Cursor before linking your database</li>
          <li>Sign in with the same Google or email account you use on cursorhelp.com</li>
          <li>Your chat database stays local — only license checks hit the cloud</li>
        </ul>
      </Card>

      <div className="mt-8 flex flex-wrap gap-4">
        {isDesktopDeepLinkAvailable() ? (
          <Button variant="secondary" type="button" onClick={openDesktopApp}>
            Already installed? Open Cursor Help
          </Button>
        ) : (
          <p className="self-center text-sm text-ch-text-secondary">
            Already installed? Launch Cursor Help from your Start Menu or Applications folder.
          </p>
        )}
        <Link to="/app/login" className="self-center text-sm font-medium text-ch-primary hover:underline">
          Sign in on the web →
        </Link>
      </div>
    </main>
  );
}
