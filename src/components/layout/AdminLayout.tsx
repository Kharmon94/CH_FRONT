import { Outlet } from "react-router-dom";
import { ShellLayout } from "./ShellLayout";
import { Badge } from "../ui/Badge";

export function AdminLayout() {
  return (
    <ShellLayout
      context="admin"
      headerSlot={
        <div className="mx-auto flex max-w-6xl items-center gap-2">
          <span className="text-sm font-medium text-ch-text">Admin console</span>
          <Badge variant="accent">Admin</Badge>
        </div>
      }
    >
      <Outlet />
    </ShellLayout>
  );
}
