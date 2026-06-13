import { Link, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { setToken } from "../../services/api";

const nav = [
  { to: "/admin", label: "Overview" },
  { to: "/admin/users", label: "Users" },
  { to: "/admin/teams", label: "Teams" },
];

export function AdminLayout() {
  const { user, signOut } = useAuth();
  const location = useLocation();

  function handleSignOut() {
    setToken(null);
    signOut();
  }

  return (
    <div className="flex min-h-screen bg-zinc-950">
      <aside className="w-56 border-r border-zinc-800/80 bg-zinc-900/50 p-4 backdrop-blur">
        <div className="mb-6 flex items-center gap-2">
          <span className="text-lg font-semibold text-emerald-400">Cursor Help</span>
          <span className="rounded bg-amber-500/15 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-amber-400">
            Admin
          </span>
        </div>
        <nav className="space-y-1">
          {nav.map((item) => {
            const active = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`block rounded-lg px-3 py-2 text-sm transition ${
                  active
                    ? "bg-emerald-500/15 font-medium text-emerald-300"
                    : "text-zinc-400 hover:bg-zinc-800/80 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <button
          type="button"
          onClick={handleSignOut}
          className="mt-8 text-xs text-zinc-500 hover:text-zinc-300"
        >
          Sign out ({user?.email})
        </button>
      </aside>
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}
