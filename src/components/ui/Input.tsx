import type { InputHTMLAttributes } from "react";

export function Input({ className = "", ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`w-full rounded-lg border border-ch-border bg-ch-surface px-3 py-2 text-sm text-ch-text placeholder:text-ch-text-secondary focus:border-ch-ring focus:outline-none focus:ring-1 focus:ring-ch-ring ${className}`}
      {...props}
    />
  );
}
