import { Link } from "react-router-dom";

export function TopLogo({ to = "/" }: { to?: string }) {
  return (
    <div
      className="fixed top-0 left-0 right-0 z-40 pointer-events-none"
      style={{ paddingTop: "env(safe-area-inset-top)" }}
    >
      <div className="relative flex items-center justify-center py-3.5 px-4">
        <Link
          to={to}
          aria-label="Cursor Help home"
          className="pointer-events-auto shrink-0 text-lg font-semibold tracking-tight text-ch-primary sm:text-xl"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Cursor Help
        </Link>
      </div>
    </div>
  );
}
