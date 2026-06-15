import type { HTMLAttributes } from "react";

export function Card({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`rounded-xl border border-ch-border bg-ch-surface p-6 ${className}`}
      {...props}
    />
  );
}
