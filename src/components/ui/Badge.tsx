type BadgeVariant = "default" | "primary" | "accent" | "muted";

const styles: Record<BadgeVariant, string> = {
  default: "bg-ch-surface-elevated text-ch-text",
  primary: "bg-ch-primary/15 text-ch-primary",
  accent: "bg-ch-accent/15 text-ch-accent",
  muted: "bg-ch-surface-elevated text-ch-text-secondary",
};

export function Badge({
  children,
  variant = "default",
}: {
  children: React.ReactNode;
  variant?: BadgeVariant;
}) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[variant]}`}>
      {children}
    </span>
  );
}
