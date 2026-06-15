import { Link } from "react-router-dom";
import { Card } from "../ui/Card";

export function AdminStatCard({
  label,
  value,
  to,
}: {
  label: string;
  value: string | number;
  to?: string;
}) {
  const card = (
    <Card className={to ? "transition-colors hover:border-ch-primary/40" : undefined}>
      <p className="text-sm text-ch-text-secondary">{label}</p>
      <p className="mt-1 text-3xl font-semibold tabular-nums">{value}</p>
    </Card>
  );

  if (to) {
    return (
      <Link to={to} className="block">
        {card}
      </Link>
    );
  }

  return card;
}
