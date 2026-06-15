import { useState } from "react";
import { Link } from "react-router-dom";
import { api, ApiError, type ComposerDetail, type ExportFormat } from "../../services/api";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { FormatSelector } from "./FormatSelector";
import { ExportProgress } from "./ExportProgress";
import { useExportJob } from "../../hooks/useExportJob";
import { useLicense } from "../../hooks/useLicense";

export function ExportPanel({
  composer,
  linkedDatabaseId,
}: {
  composer: ComposerDetail;
  linkedDatabaseId: number;
}) {
  const [format, setFormat] = useState<ExportFormat>("markdown");
  const [exportId, setExportId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [forbidden, setForbidden] = useState(false);
  const { exportJob } = useExportJob(exportId);
  const { license } = useLicense();

  async function handleExport() {
    setLoading(true);
    setError(null);
    setForbidden(false);
    try {
      const created = await api.exports.create({
        linked_database_id: linkedDatabaseId,
        composer_id: composer.id,
        format,
      });
      setExportId(created.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Export failed");
      setForbidden(err instanceof ApiError && err.status === 403);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <h2 className="mb-4 text-lg font-semibold">Export</h2>
      <FormatSelector
        value={format}
        onChange={setFormat}
        showAgentClone={license?.pro ?? false}
      />
      {format === "agent_clone" && composer.same_name_session_count > 1 && (
        <p className="mt-3 text-sm text-ch-accent">
          Bundles {composer.same_name_session_count} sessions · PRIMARY: {composer.mode}
          {composer.is_primary ? " (this session)" : ""}
        </p>
      )}
      <Button
        className="mt-4"
        variant={format === "agent_clone" ? "violet" : "primary"}
        onClick={handleExport}
        disabled={loading || exportJob?.status === "running"}
      >
        {loading ? "Starting…" : "Export"}
      </Button>
      {error && (
        <p className="mt-3 text-sm text-red-400">
          {error}
          {forbidden && (
            <>
              {" "}
              <Link to="/app/billing" className="text-ch-primary hover:underline">
                Upgrade to Pro
              </Link>
            </>
          )}
        </p>
      )}
      <ExportProgress job={exportJob} />
    </Card>
  );
}
