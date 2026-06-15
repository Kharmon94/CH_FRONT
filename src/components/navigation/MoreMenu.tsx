import { useEffect } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import {
  CreditCard,
  ExternalLink,
  HelpCircle,
  Home,
  LogOut,
  Mail,
  Shield,
  Users,
  Info,
  Newspaper,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useIsMobile } from "../../hooks/use-mobile";
import type { NavContext } from "../../lib/navContext";
import { setToken } from "../../services/api";

type Item = {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  path?: string;
  onClick?: () => void;
  tone?: "danger";
};

export type MoreMenuConfig = {
  billingPath?: string;
  teamSettingsPath?: string;
};

export function MoreMenu({
  isOpen,
  onClose,
  context,
  config,
}: {
  isOpen: boolean;
  onClose: () => void;
  context: NavContext;
  config?: MoreMenuConfig;
}) {
  const isMobile = useIsMobile();
  const { signOut } = useAuth();

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  function handleSignOut() {
    setToken(null);
    signOut();
    onClose();
  }

  const items: Item[] = (() => {
    if (context === "app") {
      const menu: Item[] = [];
      if (config?.billingPath) {
        menu.push({ icon: CreditCard, label: "Billing", path: config.billingPath });
      }
      if (config?.teamSettingsPath) {
        menu.push({ icon: Users, label: "Team settings", path: config.teamSettingsPath });
      }
      menu.push(
        { icon: LogOut, label: "Sign out", onClick: handleSignOut, tone: "danger" },
        { icon: Home, label: "Marketing home", path: "/" }
      );
      return menu;
    }
    if (context === "admin") {
      return [
        { icon: CreditCard, label: "Licenses", path: "/admin/licenses" },
        { icon: LogOut, label: "Sign out", onClick: handleSignOut, tone: "danger" },
        { icon: ExternalLink, label: "cursorhelp.com", path: "/" },
      ];
    }
    return [
      { icon: Info, label: "About", path: "/about" },
      { icon: Newspaper, label: "Blog", path: "/blog" },
      { icon: HelpCircle, label: "Help & FAQ", path: "/help" },
      { icon: Mail, label: "Contact us", path: "/contact" },
      { icon: Shield, label: "Privacy", path: "/privacy" },
    ];
  })();

  if (!isOpen) return null;

  const panel = (
    <>
      <button
        type="button"
        aria-label="Close menu"
        className="fixed inset-0 z-[110] bg-overlay backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className={`fixed z-[120] flex flex-col border border-ch-border bg-ch-surface shadow-xl ${
          isMobile
            ? "inset-x-0 bottom-0 max-h-[min(85dvh,600px)] rounded-t-3xl"
            : "left-1/2 top-1/2 w-[min(360px,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2 rounded-3xl"
        }`}
        style={{ paddingBottom: isMobile ? "max(1.5rem, env(safe-area-inset-bottom))" : undefined }}
      >
        {isMobile ? <div className="mx-auto mb-4 mt-3 h-1 w-10 shrink-0 rounded-full bg-ch-border" /> : null}
        <div className="overflow-y-auto px-2 py-4 sm:px-4">
          <div className="space-y-1">
            {items.map((item) => {
              const Icon = item.icon;
              const className = `flex w-full items-center gap-4 rounded-2xl p-4 text-left transition-colors hover:bg-ch-surface-elevated ${
                item.tone === "danger" ? "text-red-500" : "text-ch-text"
              }`;
              if (item.path) {
                return (
                  <Link key={item.label} to={item.path} onClick={onClose} className={className}>
                    <Icon className={`h-5 w-5 ${item.tone === "danger" ? "" : "text-ch-primary"}`} />
                    <span className="text-base font-medium">{item.label}</span>
                  </Link>
                );
              }
              return (
                <button key={item.label} type="button" onClick={item.onClick} className={className}>
                  <Icon className="h-5 w-5" />
                  <span className="text-base font-medium">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );

  return createPortal(panel, document.body);
}
