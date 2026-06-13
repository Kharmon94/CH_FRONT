import { Link } from "react-router-dom";
import type { Composer } from "../../services/api";
import { Badge } from "../ui/Badge";

export function ComposerTable({ composers }: { composers: Composer[] }) {
  if (!composers.length) {
    return <p className="text-sm text-zinc-500">No composers found.</p>;
  }

  return (
    <div className="overflow-hidden rounded-lg border border-zinc-800">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-zinc-900 text-zinc-400">
          <tr>
            <th className="px-4 py-3 font-medium">Name</th>
            <th className="px-4 py-3 font-medium">Mode</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Messages</th>
            <th className="px-4 py-3 font-medium">Updated</th>
          </tr>
        </thead>
        <tbody>
          {composers.map((composer) => (
            <tr key={composer.id} className="border-t border-zinc-800 hover:bg-zinc-900/80">
              <td className="px-4 py-3">
                <Link
                  to={`/app/composers/${composer.id}?db=${composer.linked_database_id}`}
                  className="text-emerald-400 hover:underline"
                >
                  {composer.name}
                </Link>
              </td>
              <td className="px-4 py-3">
                <Badge variant={composer.mode === "agent" ? "emerald" : "muted"}>
                  {composer.mode}
                </Badge>
              </td>
              <td className="px-4 py-3 text-zinc-400">{composer.status}</td>
              <td className="px-4 py-3 font-mono text-xs">{composer.message_count}</td>
              <td className="px-4 py-3 text-zinc-400">
                {composer.updated_at
                  ? new Date(composer.updated_at).toLocaleDateString()
                  : "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
