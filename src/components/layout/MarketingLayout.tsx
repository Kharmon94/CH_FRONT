import { Link, Outlet } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Button } from "../ui/Button";

export function MarketingLayout() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <header className="sticky top-0 z-10 border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link to="/" className="text-lg font-semibold text-emerald-400">
            Cursor Help
          </Link>
          <nav className="flex items-center gap-6 text-sm">
            <Link to="/pricing" className="text-zinc-400 transition hover:text-white">
              Pricing
            </Link>
            <Link to="/privacy" className="text-zinc-400 transition hover:text-white">
              Privacy
            </Link>
            {user?.role === "user" ? (
              <Link to="/app">
                <Button>Open App</Button>
              </Link>
            ) : (
              <Link to="/app/login" className="text-zinc-300 hover:text-white">
                Sign in
              </Link>
            )}
          </nav>
        </div>
      </header>
      <Outlet />
      <footer className="border-t border-zinc-800/80 py-8 text-center text-sm text-zinc-500">
        <p>cursorhelp.com</p>
        <p className="mx-auto mt-2 max-w-2xl">
          Cursor Help is not affiliated with, endorsed by, or sponsored by Cursor or Anysphere.
        </p>
      </footer>
    </div>
  );
}
