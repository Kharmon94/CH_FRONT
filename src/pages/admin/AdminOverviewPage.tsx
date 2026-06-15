import { Link } from "react-router-dom";

export function AdminOverviewPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold">Admin overview</h1>
      <p className="mt-2 text-sm text-ch-text-secondary">Manage users, teams, and licenses.</p>
      <div className="mt-6 flex gap-4">
        <Link to="/admin/users" className="text-ch-primary hover:text-ch-primary">
          Users
        </Link>
        <Link to="/admin/teams" className="text-ch-primary hover:text-ch-primary">
          Teams
        </Link>
      </div>
    </div>
  );
}
