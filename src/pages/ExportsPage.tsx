import { useEffect, useState } from "react";
import { api, type ExportStatus } from "../services/api";
import { Badge } from "../components/ui/Badge";
import { DownloadDesktopPanel } from "../components/desktop/DownloadDesktopPanel";
import { isLocalEngineReachable } from "../lib/localEngine";

export function ExportsPage() {
  const [localReady, setLocalReady] = useState(false);
  const [exports, setExports] = useState<ExportStatus[]>([]);

  useEffect(() => {
    void isLocalEngineReachable().then(setLocalReady);
  }, []);

  useEffect(() => {
    if (!localReady) return;
    api.exports.list().then(setExports).catch(() => setExports([]));
  }, [localReady]);

  if (!localReady) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold">Export history</h1>
        <DownloadDesktopPanel />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Export history</h1>
      {!exports.length ? (
        <p className="text-sm text-ch-text-secondary">No exports yet. Export a composer from the Composers page.</p>
      ) : (
        <div className="overflow-hidden rounded-lg border border-ch-border">
          <table className="min-w-full text-sm">
            <thead className="bg-ch-surface-elevated text-ch-text-secondary">
              <tr>
                <th className="px-4 py-3 text-left">Chat</th>
                <th className="px-4 py-3 text-left">Format</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Created</th>
                <th className="px-4 py-3 text-left" />
              </tr>
            </thead>
            <tbody>
              {exports.map((item) => (
                <tr key={item.id} className="border-t border-ch-border">
                  <td className="px-4 py-3">{item.composer_name}</td>
                  <td className="px-4 py-3">
                    <Badge variant={item.format === "agent_clone" ? "accent" : "primary"}>
                      {item.format}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 capitalize text-ch-text-secondary">{item.status}</td>
                  <td className="px-4 py-3 text-ch-text-secondary">
                    {new Date(item.created_at).toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    {item.status === "completed" && (
                      <a
                        href={api.exports.downloadUrl(item.id)}
                        className="text-ch-primary hover:underline"
                        download
                      >
                        Download
                      </a>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
