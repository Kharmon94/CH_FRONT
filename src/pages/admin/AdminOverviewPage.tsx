import { Link } from "react-router-dom";

export function AdminOverviewPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold">Admin overview</h1>
      <p className="mt-2 text-sm text-zinc-400">Manage users, teams, and licenses.</p>
      <div className="mt-6 flex gap-4">
        <Link to="/admin/users" className="text-emerald-400 hover:text-emerald-300">
          Users
        </Link>
        <Link to="/admin/teams" className="text-emerald-400 hover:text-emerald-300">
          Teams
        </Link>
      </div>
    </div>
  );
}
