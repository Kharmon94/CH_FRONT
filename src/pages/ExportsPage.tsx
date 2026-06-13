import { useEffect, useState } from "react";
import { api, type ExportStatus } from "../services/api";
import { Badge } from "../components/ui/Badge";

export function ExportsPage() {
  const [exports, setExports] = useState<ExportStatus[]>([]);

  useEffect(() => {
    api.exports.list().then(setExports).catch(() => setExports([]));
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Export history</h1>
      {!exports.length ? (
        <p className="text-sm text-zinc-500">No exports yet.</p>
      ) : (
        <div className="overflow-hidden rounded-lg border border-zinc-800">
          <table className="min-w-full text-sm">
            <thead className="bg-zinc-900 text-zinc-400">
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
                <tr key={item.id} className="border-t border-zinc-800">
                  <td className="px-4 py-3">{item.composer_name}</td>
                  <td className="px-4 py-3">
                    <Badge variant={item.format === "agent_clone" ? "violet" : "emerald"}>
                      {item.format}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 capitalize text-zinc-400">{item.status}</td>
                  <td className="px-4 py-3 text-zinc-400">
                    {new Date(item.created_at).toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    {item.status === "completed" && (
                      <a
                        href={api.exports.downloadUrl(item.id)}
                        className="text-emerald-400 hover:underline"
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
