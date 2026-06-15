import { Badge } from "../ui/Badge";

export function LicenseTierBadge({
  tier,
  status,
}: {
  tier: string;
  status?: string | null;
}) {
  const isPro = tier === "pro";

  return (
    <span className="inline-flex flex-wrap items-center gap-2">
      <Badge variant={isPro ? "primary" : "muted"}>{isPro ? "Pro" : "Free"}</Badge>
      {status ? <Badge variant="default">{status}</Badge> : null}
    </span>
  );
}
