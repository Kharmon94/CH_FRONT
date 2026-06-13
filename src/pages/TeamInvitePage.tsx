import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import { useTeam } from "../contexts/TeamContext";

export function TeamInvitePage() {
  const { token } = useParams();
  const { user } = useAuth();
  const { refreshTeams, setActiveTeam } = useTeam();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token || !user) return;

    api.teams
      .acceptInvite(token)
      .then((res) => {
        void refreshTeams().then(() => {
          setActiveTeam(res.team.id);
          navigate("/app", { replace: true });
        });
      })
      .catch((err: Error) => setError(err.message));
  }, [token, user, navigate, refreshTeams, setActiveTeam]);

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center text-zinc-400">
        Sign in to accept this invite.
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center text-zinc-400">
      {error ? `Invite error: ${error}` : "Accepting invite…"}
    </div>
  );
}
