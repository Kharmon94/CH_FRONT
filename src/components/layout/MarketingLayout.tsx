import { Outlet } from "react-router-dom";
import { ShellLayout } from "./ShellLayout";

export function MarketingLayout() {
  return (
    <ShellLayout
      context="public"
      footerSlot={
        <footer className="border-t border-ch-border py-8 text-center text-sm text-ch-text-secondary">
          <p>cursorhelp.com</p>
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
