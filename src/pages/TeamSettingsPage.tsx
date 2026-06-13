import { type FormEvent, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../services/api";
import { useTeam } from "../contexts/TeamContext";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";

export function TeamSettingsPage() {
  const { id } = useParams();
  const { team, isOwner, refreshTeams } = useTeam();
  const teamId = Number(id);
  const [members, setMembers] = useState<Array<{ id: number; email: string; role: string }>>([]);
  const [inviteEmail, setInviteEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!teamId) return;
    api.teams.members(teamId).then(setMembers).catch(() => setMembers([]));
  }, [teamId]);

  async function sendInvite(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setMessage(null);
    try {
      await api.teams.invite(teamId, inviteEmail);
      setMessage("Invite sent");
      setInviteEmail("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invite failed");
    }
  }

  if (!team || team.id !== teamId) {
    return <p className="text-sm text-zinc-500">Loading team…</p>;
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-semibold">{team.name}</h1>

      {message && <p className="text-sm text-emerald-400">{message}</p>}
      {error && <p className="text-sm text-red-400">{error}</p>}

      <Card>
        <h2 className="text-lg font-semibold">Members</h2>
        <ul className="mt-3 space-y-2 text-sm text-zinc-300">
          {members.map((m) => (
            <li key={m.id} className="flex justify-between">
              <span>{m.email}</span>
              <span className="text-zinc-500">{m.role}</span>
            </li>
          ))}
        </ul>
      </Card>

      {isOwner && (
        <>
          <Card>
            <h2 className="text-lg font-semibold">Invite member</h2>
            <form onSubmit={sendInvite} className="mt-3 flex gap-2">
              <Input
                type="email"
                placeholder="email@example.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                required
              />
              <Button type="submit" variant="primary">
                Invite
              </Button>
            </form>
          </Card>
          <Link
            to={`/app/teams/${teamId}/billing`}
            className="inline-block text-sm text-emerald-400 hover:text-emerald-300"
            onClick={() => refreshTeams()}
          >
            Team billing →
          </Link>
        </>
      )}
    </div>
  );
}
