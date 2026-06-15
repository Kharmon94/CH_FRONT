import { Link } from "react-router-dom";
import type { Composer } from "../../services/api";
import { Badge } from "../ui/Badge";

export function ComposerTable({ composers }: { composers: Composer[] }) {
  if (!composers.length) {
    return <p className="text-sm text-ch-text-secondary">No composers found.</p>;
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-ch-border">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-ch-surface-elevated text-ch-text-secondary">
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
            <tr key={composer.id} className="border-t border-ch-border hover:bg-ch-surface-elevated/50">
              <td className="px-4 py-3">
                <Link
                  to={`/app/composers/${composer.id}?db=${composer.linked_database_id}`}
                  className="text-ch-primary hover:underline"
                >
                  {composer.name}
                </Link>
              </td>
              <td className="px-4 py-3">
                <Badge variant={composer.mode === "agent" ? "primary" : "muted"}>
                  {composer.mode}
                </Badge>
              </td>
              <td className="px-4 py-3 text-ch-text-secondary">{composer.status}</td>
              <td className="px-4 py-3 font-mono text-xs">{composer.message_count}</td>
              <td className="px-4 py-3 text-ch-text-secondary">
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
