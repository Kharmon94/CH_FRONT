import { Link, Outlet } from "react-router-dom";
import { ShellLayout } from "./ShellLayout";

const footerLinks = [
  { label: "About", to: "/about" },
  { label: "Download", to: "/download" },
  { label: "Blog", to: "/blog" },
  { label: "Help", to: "/help" },
  { label: "Contact", to: "/contact" },
  { label: "Privacy", to: "/privacy" },
] as const;

export function MarketingLayout() {
  return (
    <ShellLayout
      context="public"
      footerSlot={
        <footer className="border-t border-ch-border py-8 text-center text-sm text-ch-text-secondary">
          <nav aria-label="Footer" className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
            {footerLinks.map((link) => (
              <Link key={link.to} to={link.to} className="transition hover:text-ch-primary">
                {link.label}
              </Link>
            ))}
          </nav>
          <p className="mt-4">cursorhelp.com</p>
          <p className="mx-auto mt-2 max-w-2xl px-4">
            Cursor Help is not affiliated with, endorsed by, or sponsored by Cursor or Anysphere.
          </p>
        </footer>
      }
    >
      <Outlet />
    </ShellLayout>
  );
}
