import { Outlet } from "react-router-dom";
import { ShellLayout } from "./ShellLayout";

export function AdminLayout() {
  return (
    <ShellLayout context="admin">
      <Outlet />
    </ShellLayout>
  );
}
