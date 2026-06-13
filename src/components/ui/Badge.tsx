type BadgeVariant = "default" | "emerald" | "violet" | "muted";

const styles: Record<BadgeVariant, string> = {
  default: "bg-zinc-800 text-zinc-200",
  emerald: "bg-emerald-500/15 text-emerald-400",
  violet: "bg-violet-500/15 text-violet-400",
  muted: "bg-zinc-800 text-zinc-400",
};

export function Badge({
  children,
  variant = "default",
}: {
  children: React.ReactNode;
  variant?: BadgeVariant;
}) {
  return (
    <span className={`inline-flex rounded-md px-2 py-0.5 text-xs font-medium ${styles[variant]}`}>
      {children}
    </span>
  );
}
