import type { ReactNode } from "react";

export function AuthChrome({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-ch-bg px-4 py-12">
      {children}
    </div>
  );
}

export function AuthCard({ children }: { children: ReactNode }) {
  return (
    <div className="w-full max-w-md rounded-xl border border-ch-border bg-ch-surface p-8">
      {children}
    </div>
  );
}
