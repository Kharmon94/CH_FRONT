import { createBrowserRouter } from "react-router-dom";
import { MarketingLayout } from "../components/layout/MarketingLayout";
import { AppShell } from "../components/layout/AppShell";
import { AdminLayout } from "../components/layout/AdminLayout";
import { ProtectedRoute } from "../components/auth/ProtectedRoute";
import { AdminRoute } from "../components/auth/AdminRoute";
import { HomePage } from "../pages/HomePage";
import { PricingPage } from "../pages/PricingPage";
import { PrivacyPage } from "../pages/PrivacyPage";
import { DashboardPage } from "../pages/DashboardPage";
import { ComposersPage } from "../pages/ComposersPage";
import { ComposerDetailPage } from "../pages/ComposerDetailPage";
import { ExportsPage } from "../pages/ExportsPage";
import { BillingPage } from "../pages/BillingPage";
import { LoginPage } from "../pages/LoginPage";
import { AdminLoginPage } from "../pages/AdminLoginPage";
import { OAuthGoogleCallbackPage } from "../pages/OAuthGoogleCallbackPage";
import { TeamSettingsPage } from "../pages/TeamSettingsPage";
import { TeamInvitePage } from "../pages/TeamInvitePage";
import { AdminOverviewPage } from "../pages/admin/AdminOverviewPage";
import { AdminUsersPage } from "../pages/admin/AdminUsersPage";
import { AdminTeamsPage } from "../pages/admin/AdminTeamsPage";
import { TeamProvider } from "../contexts/TeamContext";
import { WorkspaceProvider } from "../contexts/WorkspaceContext";

function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <TeamProvider>
      <WorkspaceProvider>{children}</WorkspaceProvider>
    </TeamProvider>
  );
}

export const router = createBrowserRouter([
  {
    element: <MarketingLayout />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/pricing", element: <PricingPage /> },
      { path: "/privacy", element: <PrivacyPage /> },
    ],
  },
  { path: "/app/login", element: <LoginPage /> },
  { path: "/app/oauth/google/callback", element: <OAuthGoogleCallbackPage /> },
  { path: "/admin/login", element: <AdminLoginPage /> },
  {
    path: "/app",
    element: (
      <ProtectedRoute>
        <AppProviders>
          <AppShell />
        </AppProviders>
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <DashboardPage /> },
      { path: "composers", element: <ComposersPage /> },
      { path: "composers/:id", element: <ComposerDetailPage /> },
      { path: "exports", element: <ExportsPage /> },
      { path: "billing", element: <BillingPage /> },
      { path: "teams/:id/settings", element: <TeamSettingsPage /> },
      { path: "teams/:teamId/billing", element: <BillingPage /> },
      { path: "invite/:token", element: <TeamInvitePage /> },
    ],
  },
  {
    path: "/admin",
    element: (
      <AdminRoute>
        <AdminLayout />
      </AdminRoute>
    ),
    children: [
      { index: true, element: <AdminOverviewPage /> },
      { path: "users", element: <AdminUsersPage /> },
      { path: "teams", element: <AdminTeamsPage /> },
    ],
  },
]);
