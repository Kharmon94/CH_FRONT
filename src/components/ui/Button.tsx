import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost" | "violet";

const variants: Record<Variant, string> = {
  primary:
    "bg-ch-primary text-ch-on-primary hover:brightness-110 motion-safe:hover:scale-105 motion-reduce:hover:scale-100",
  secondary:
    "border border-ch-border bg-ch-surface-elevated text-ch-text hover:bg-ch-surface motion-safe:hover:scale-105 motion-reduce:hover:scale-100",
  ghost: "bg-transparent text-ch-text-secondary hover:bg-ch-surface-elevated hover:text-ch-text",
  violet:
    "bg-ch-accent text-white hover:brightness-110 motion-safe:hover:scale-105 motion-reduce:hover:scale-100",
};

export function Button({
  variant = "primary",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-medium tracking-wider transition disabled:opacity-50 ${variants[variant]} ${className}`}
      {...props}
    />
  );
}
