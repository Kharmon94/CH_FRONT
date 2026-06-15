import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ch-bg text-ch-text-secondary">
        Loading…
      </div>
    );
  }

  if (!user || user.role !== "user") {
    return <Navigate to="/app/login" replace />;
  }

  return children;
}
