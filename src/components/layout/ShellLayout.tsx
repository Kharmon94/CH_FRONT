import { useEffect, useState, type ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { ThemeToggleHost } from "../ThemeToggleHost";
import { PageTransition } from "../loading/PageTransition";
import { MainNav } from "../navigation/MainNav";
import { MoreMenu, type MoreMenuConfig } from "../navigation/MoreMenu";
import { TopLogo } from "../navigation/TopLogo";
import type { NavContext } from "../../lib/navContext";

export function ShellLayout({
  context,
  children,
  headerSlot,
  footerSlot,
  hideNav = false,
  moreMenuConfig,
}: {
  context: NavContext;
  children: ReactNode;
  headerSlot?: ReactNode;
  footerSlot?: ReactNode;
  hideNav?: boolean;
  moreMenuConfig?: MoreMenuConfig;
}) {
  const location = useLocation();
  const [moreOpen, setMoreOpen] = useState(false);

  useEffect(() => {
    setMoreOpen(false);
    window.scrollTo({ top: 0, behavior: location.pathname === "/" ? "auto" : "smooth" });
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-ch-bg text-ch-text">
      <TopLogo to={context === "app" ? "/app" : context === "admin" ? "/admin" : "/"} />
      <ThemeToggleHost />

      {headerSlot ? (
        <div className="border-b border-ch-border bg-ch-surface/70 px-4 py-3 pt-20 backdrop-blur sm:px-6">
          {headerSlot}
        </div>
      ) : null}

      <main className={`mx-auto w-full max-w-6xl px-4 sm:px-6 ${headerSlot ? "py-6" : "pb-28 pt-20 sm:pt-24"} ${hideNav ? "pb-12" : "pb-28"}`}>
        <PageTransition>{children}</PageTransition>
      </main>

      {footerSlot}

      {!hideNav ? (
        <>
          <MainNav context={context} onMoreClick={() => setMoreOpen(true)} />
          <MoreMenu
            isOpen={moreOpen}
            onClose={() => setMoreOpen(false)}
            context={context}
            config={moreMenuConfig}
          />
        </>
      ) : null}
    </div>
  );
}
