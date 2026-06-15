import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../ui/Button";
import { LOCATE_DATABASE_STEPS, LOCATE_DATABASE_RECOMMENDATIONS, type LocatePlatform } from "../../lib/locateDatabaseHelp";

const PLATFORMS: LocatePlatform[] = ["wsl", "windows", "mac", "linux"];

function detectPlatform(): LocatePlatform {
  if (typeof navigator === "undefined") return "wsl";
  const ua = navigator.userAgent.toLowerCase();
  if (ua.includes("win")) return "windows";
  if (ua.includes("mac")) return "mac";
  if (ua.includes("linux")) return "linux";
  return "wsl";
}

export function LocateDatabaseHelpButton({ className = "" }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const [platform, setPlatform] = useState<LocatePlatform>("wsl");
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    setPlatform(detectPlatform());
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  const content = LOCATE_DATABASE_STEPS[platform];

  return (
    <>
      <Button type="button" variant="secondary" className={className} onClick={() => setOpen(true)}>
        How to locate
      </Button>

      <dialog
        ref={dialogRef}
        className="w-[min(100%,32rem)] rounded-xl border border-ch-border bg-ch-surface p-0 text-ch-text shadow-2xl backdrop:bg-black/60"
        onClose={() => setOpen(false)}
      >
        <div className="border-b border-ch-border px-6 py-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold">Locate your Cursor database</h2>
              <p className="mt-1 text-sm text-ch-text-secondary">
                Cursor stores composer sessions in <span className="font-mono">state.vscdb</span> under
                globalStorage. Close Cursor before linking.
              </p>
            </div>
            <button
              type="button"
              className="rounded-full px-2 py-1 text-ch-text-secondary hover:bg-ch-surface-elevated hover:text-ch-text"
              aria-label="Close"
              onClick={() => setOpen(false)}
            >
              ×
            </button>
          </div>
        </div>

        <div className="px-6 pt-4">
          <div className="rounded-xl border border-ch-border bg-ch-surface-elevated px-4 py-3">
            <p className="text-sm font-medium text-ch-text">Recommendation</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-ch-text-secondary">
              {LOCATE_DATABASE_RECOMMENDATIONS.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {PLATFORMS.map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => setPlatform(key)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                  platform === key
                    ? "bg-ch-primary text-ch-on-primary"
                    : "border border-ch-border bg-ch-surface-elevated text-ch-text-secondary hover:text-ch-text"
                }`}
              >
                {LOCATE_DATABASE_STEPS[key].title}
              </button>
            ))}
          </div>

          <div className="mt-4 space-y-3">
            <p className="text-sm font-medium text-ch-text">Typical locations</p>
            <ul className="space-y-2">
              {content.paths.map((path) => (
                <li
                  key={path}
                  className="rounded-xl border border-ch-border bg-ch-surface-elevated px-3 py-2 font-mono text-xs text-ch-text-secondary break-all"
                >
                  {path}
                </li>
              ))}
            </ul>
            {content.notes.length > 0 && (
              <ul className="list-disc space-y-1 pl-5 text-sm text-ch-text-secondary">
                {content.notes.map((note) => (
                  <li key={note}>{note}</li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-ch-border px-6 py-4">
          <Link
            to="/help#locate-database"
            className="text-sm text-ch-primary hover:underline"
            onClick={() => setOpen(false)}
          >
            More in Help & FAQ
          </Link>
          <Button type="button" variant="primary" onClick={() => setOpen(false)}>
            Got it
          </Button>
        </div>
      </dialog>
    </>
  );
}
