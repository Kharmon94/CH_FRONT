import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost" | "violet";

const variants: Record<Variant, string> = {
  primary:
    "bg-ch-primary text-ch-on-primary hover:opacity-90 motion-safe:hover:scale-[1.02] motion-reduce:hover:scale-100",
  secondary:
    "border border-ch-border bg-transparent text-ch-text hover:bg-ch-surface-elevated motion-safe:hover:scale-[1.02] motion-reduce:hover:scale-100",
  ghost: "bg-transparent text-ch-text-secondary hover:bg-ch-surface-elevated hover:text-ch-text",
  violet:
    "bg-ch-accent text-white hover:opacity-90 motion-safe:hover:scale-[1.02] motion-reduce:hover:scale-100",
};

export function Button({
  variant = "primary",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition disabled:opacity-50 ${variants[variant]} ${className}`}
      {...props}
    />
  );
}
