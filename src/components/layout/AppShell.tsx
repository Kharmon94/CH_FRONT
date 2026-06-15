import { Link, Outlet } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useTeam } from "../../contexts/TeamContext";
import { useDesktopAuthBridge } from "../../hooks/useDesktopAuth";
import { useLicense } from "../../hooks/useLicense";
import { TeamSwitcher } from "../teams/TeamSwitcher";
import { WorkspaceSwitcher } from "../workspaces/WorkspaceSwitcher";
import { ShellLayout } from "./ShellLayout";
import { Badge } from "../ui/Badge";

export function AppShell() {
  const { user } = useAuth();
  const { team, isOwner } = useTeam();
  const { license } = useLicense();
  useDesktopAuthBridge();

  return (
    <ShellLayout
      context="app"
      moreMenuConfig={
        team && isOwner
          ? {
              billingPath: `/app/teams/${team.id}/billing`,
              teamSettingsPath: `/app/teams/${team.id}/settings`,
            }
          : undefined
      }
    >
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
          <TeamSwitcher />
          <div className="hidden sm:block">
            <WorkspaceSwitcher />
          </div>
          <span className="hidden text-xs text-ch-text-secondary lg:inline">
            Local-first · DB stays on your machine
          </span>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Link
            to="/app/settings"
            className="flex items-center gap-2 rounded-full px-1 py-0.5 transition hover:bg-ch-surface-elevated"
            title="Account settings"
          >
            {user?.avatar_url ? (
              <img
                src={user.avatar_url}
                alt=""
                className="h-8 w-8 rounded-full border border-ch-border object-cover"
              />
            ) : (
              <span className="flex h-8 w-8 items-center justify-center rounded-full border border-ch-border bg-ch-surface-elevated text-xs text-ch-text-secondary">
                {(user?.name?.[0] ?? user?.email?.[0] ?? "?").toUpperCase()}
              </span>
            )}
            <span className="hidden text-xs text-ch-text-secondary md:inline">{user?.email}</span>
          </Link>
          <Badge variant={license?.pro ? "primary" : "muted"}>
            {license?.pro ? "Pro" : "Free"}
          </Badge>
        </div>
      </div>
      <Outlet />
    </ShellLayout>
  );
}
