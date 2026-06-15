import type { ReactNode } from "react";
import { Link } from "react-router-dom";

export function AdminListRow({
  to,
  children,
  meta,
}: {
  to: string;
  children: ReactNode;
  meta?: ReactNode;
}) {
  return (
    <Link
      to={to}
      className="flex items-center justify-between gap-4 rounded-2xl border border-ch-border px-4 py-3 text-sm transition-colors hover:border-ch-primary/30 hover:bg-ch-surface-elevated"
    >
      <div className="min-w-0 flex-1">{children}</div>
      {meta ? <div className="shrink-0">{meta}</div> : null}
    </Link>
  );
}
