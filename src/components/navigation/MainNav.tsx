import { Link, useLocation } from "react-router-dom";
import {
  Download,
  Home,
  LayoutDashboard,
  MoreHorizontal,
  Settings,
  Shield,
  Users,
  Building2,
  CreditCard,
  DollarSign,
  HelpCircle,
  LogIn,
  AppWindow,
  Bot,
} from "lucide-react";
import { useMemo } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useIsMobile } from "../../hooks/use-mobile";
import type { NavContext } from "../../lib/navContext";
import { ViewportFixedFooter } from "./ViewportFixedFooter";

type Tab = {
  key: string;
  label: string;
  to: string;
  icon: React.ComponentType<{ className?: string }>;
  end?: boolean;
};

function isTabActive(pathname: string, tab: Tab): boolean {
  if (tab.to.includes("#")) {
    return pathname === "/" || pathname === "";
  }
  if (tab.end) return pathname === tab.to || pathname === `${tab.to}/`;
  return pathname === tab.to || pathname.startsWith(`${tab.to}/`);
}

export function MainNav({
  context,
  onMoreClick,
}: {
  context: NavContext;
  onMoreClick: () => void;
}) {
  const location = useLocation();
  const isMobile = useIsMobile();
  const { user } = useAuth();

  const tabs = useMemo<Tab[]>(() => {
    if (context === "app") {
      return [
        { key: "dashboard", label: "Dashboard", to: "/app", icon: LayoutDashboard, end: true },
        { key: "composers", label: "Composers", to: "/app/composers", icon: Bot },
        { key: "exports", label: "Exports", to: "/app/exports", icon: Download },
        { key: "settings", label: "Settings", to: "/app/settings", icon: Settings, end: true },
      ];
    }
    if (context === "admin") {
      return [
        { key: "overview", label: "Overview", to: "/admin", icon: Shield, end: true },
        { key: "users", label: "Users", to: "/admin/users", icon: Users },
        { key: "teams", label: "Teams", to: "/admin/teams", icon: Building2 },
        { key: "licenses", label: "Licenses", to: "/admin/licenses", icon: CreditCard, end: true },
      ];
    }
    const fourth: Tab =
      user?.role === "user"
        ? { key: "open-app", label: "Open App", to: "/app", icon: AppWindow, end: true }
        : { key: "sign-in", label: "Sign in", to: "/app/login", icon: LogIn, end: true };
    return [
      { key: "home", label: "Home", to: "/", icon: Home, end: true },
      { key: "pricing", label: "Pricing", to: "/pricing", icon: DollarSign, end: true },
      { key: "how-it-works", label: "How it works", to: "/#how-it-works", icon: HelpCircle },
      fourth,
    ];
  }, [context, user?.role]);

  if (isMobile) {
    return (
      <ViewportFixedFooter
        className="border-t border-ch-border bg-ch-surface/90 backdrop-blur-xl md:hidden"
        style={{ paddingBottom: "max(0.75rem, calc(env(safe-area-inset-bottom, 0px) + 0.25rem))" }}
      >
        <nav aria-label="Main" className="flex items-center justify-around px-2 pt-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = isTabActive(location.pathname, tab);
            return (
              <Link
                key={tab.key}
                to={tab.to}
                className="flex min-w-[60px] flex-col items-center gap-1 px-3 py-2 transition-transform active:scale-95 motion-reduce:active:scale-100"
              >
                <Icon
                  className={`h-6 w-6 transition-all ${active ? "scale-110 text-ch-primary" : "text-ch-text-secondary"}`}
                />
                <span className={`text-[10px] ${active ? "text-ch-primary" : "text-ch-text-secondary"}`}>
                  {tab.label}
                </span>
                {active ? <div className="mt-0.5 h-1 w-1 rounded-full bg-ch-primary" /> : null}
              </Link>
            );
          })}
          <button
            type="button"
            onClick={onMoreClick}
            className="flex min-w-[60px] flex-col items-center gap-1 px-3 py-2 transition-transform active:scale-95 motion-reduce:active:scale-100"
          >
            <MoreHorizontal className="h-6 w-6 text-ch-text-secondary" />
            <span className="text-[10px] text-ch-text-secondary">More</span>
          </button>
        </nav>
      </ViewportFixedFooter>
    );
  }

  return (
    <nav className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2">
      <div className="rounded-full border border-ch-border bg-ch-surface/85 px-3 py-2 shadow-lg backdrop-blur-xl">
        <div className="flex items-center gap-1">
          {tabs.map((tab) => {
            const active = isTabActive(location.pathname, tab);
            const Icon = tab.icon;
            return (
              <Link
                key={tab.key}
                to={tab.to}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm tracking-wider transition-colors ${
                  active
                    ? "bg-ch-primary/15 text-ch-primary"
                    : "text-ch-text-secondary hover:text-ch-text"
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </Link>
            );
          })}
          <button
            type="button"
            onClick={onMoreClick}
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm tracking-wider text-ch-text-secondary transition-colors hover:text-ch-text"
          >
            <MoreHorizontal className="h-4 w-4" />
            More
          </button>
        </div>
      </div>
    </nav>
  );
}
