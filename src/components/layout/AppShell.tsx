import { Link, NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useTeam } from "../../contexts/TeamContext";
import { useLicense } from "../../hooks/useLicense";
import { TeamSwitcher } from "../teams/TeamSwitcher";
import { WorkspaceSwitcher } from "../workspaces/WorkspaceSwitcher";

const nav = [
  { to: "/app", label: "Dashboard", end: true },
  { to: "/app/composers", label: "Composers" },
  { to: "/app/exports", label: "Exports" },
];

export function AppShell() {
  const { user, signOut } = useAuth();
  const { team, isOwner } = useTeam();
  const { license } = useLicense();

  return (
    <div className="flex min-h-screen bg-zinc-950">
      <aside className="hidden w-56 flex-col border-r border-zinc-800/80 bg-zinc-900/40 p-4 backdrop-blur md:flex">
        <Link to="/" className="mb-2 block text-lg font-semibold text-emerald-400">
          Cursor Help
        </Link>
        <div className="mb-4">
          <WorkspaceSwitcher />
        </div>
        <nav className="space-y-1">
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `block rounded-lg px-3 py-2 text-sm transition ${
                  isActive
                    ? "bg-emerald-500/15 font-medium text-emerald-300"
                    : "text-zinc-400 hover:bg-zinc-800/80 hover:text-white"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
          {team && isOwner && (
            <NavLink
              to={`/app/teams/${team.id}/settings`}
              className={({ isActive }) =>
                `block rounded-lg px-3 py-2 text-sm transition ${
                  isActive
                    ? "bg-emerald-500/15 font-medium text-emerald-300"
                    : "text-zinc-400 hover:bg-zinc-800/80 hover:text-white"
                }`
              }
            >
              Team
            </NavLink>
          )}
        </nav>
        <div className="mt-auto space-y-3">
          <Hint />
          <button
            type="button"
            onClick={signOut}
            className="text-xs text-zinc-500 hover:text-zinc-300"
          >
            Sign out
          </button>
        </div>
      </aside>

      <div className="flex flex-1 flex-col pb-16 md:pb-0">
        <header className="flex items-center justify-between border-b border-zinc-800/80 px-4 py-3 md:px-6">
          <div className="flex items-center gap-3">
            <TeamSwitcher />
            <span className="hidden text-xs text-zinc-500 md:inline">
              Local-first · DB stays on your machine
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/app/settings"
              className="flex items-center gap-2 rounded-md px-1 py-0.5 transition hover:bg-zinc-800/80"
              title="Account settings"
            >
              {user?.avatar_url ? (
                <img
                  src={user.avatar_url}
                  alt=""
                  className="h-8 w-8 rounded-full border border-zinc-700 object-cover"
                />
              ) : (
                <span className="flex h-8 w-8 items-center justify-center rounded-full border border-zinc-700 bg-zinc-800 text-xs text-zinc-400">
                  {(user?.name?.[0] ?? user?.email?.[0] ?? "?").toUpperCase()}
                </span>
              )}
              <span className="hidden text-xs text-zinc-500 md:inline">{user?.email}</span>
            </Link>
            <span
              className={`rounded-md px-2 py-1 text-xs font-medium ${
                license?.pro
                  ? "bg-emerald-500/15 text-emerald-400"
                  : "bg-zinc-800 text-zinc-400"
              }`}
            >
              {license?.pro ? "Pro" : "Free"}
            </span>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6">
          <Outlet />
        </main>
      </div>

      <nav className="fixed inset-x-0 bottom-0 flex border-t border-zinc-800/80 bg-zinc-950/95 backdrop-blur md:hidden">
        {nav.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `flex flex-1 flex-col items-center py-2 text-[10px] ${
                isActive ? "text-emerald-400" : "text-zinc-500"
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}

function Hint() {
  return (
    <div className="rounded-lg border border-zinc-800/80 bg-zinc-950/60 p-3 text-xs text-zinc-500">
      Close Cursor before linking your database.
    </div>
  );
}
