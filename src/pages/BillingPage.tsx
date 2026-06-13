import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { api } from "../services/api";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { useLicense } from "../hooks/useLicense";
import { useTeam } from "../contexts/TeamContext";

export function BillingPage() {
  const { teamId } = useParams();
  const { team, isOwner } = useTeam();
  const activeTeamId = teamId ? Number(teamId) : team?.id;
  const { license, loading, refresh } = useLicense();
  const [searchParams, setSearchParams] = useSearchParams();
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const sessionId = searchParams.get("session_id");
    if (!sessionId || !activeTeamId) return;

    setMessage("Confirming your subscription…");
    api.billing
      .confirm(sessionId, activeTeamId)
      .then(() => {
        setMessage("Welcome to Pro! Agent Clone and unlimited exports are now unlocked for your team.");
        setSearchParams({});
        refresh();
      })
      .catch((err: Error) => {
        setError(err.message);
        setSearchParams({});
      });
  }, [searchParams, setSearchParams, refresh, activeTeamId]);

  async function startCheckout(plan: "monthly" | "annual") {
    if (!activeTeamId) return;
    setCheckoutLoading(plan);
    setError(null);
    try {
      const { url } = await api.billing.checkout(plan, activeTeamId);
      window.location.href = url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Checkout failed");
      setCheckoutLoading(null);
    }
  }

  if (loading && !license) {
    return <p className="text-sm text-zinc-500">Loading billing…</p>;
  }

  if (!isOwner) {
    return (
      <p className="text-sm text-zinc-400">
        Only team owners can manage billing. Ask your team owner to upgrade {team?.name}.
      </p>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-semibold">Billing — {team?.name}</h1>

      {message && (
        <div className="rounded-md border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
          {message}
        </div>
      )}
      {error && (
        <div className="rounded-md border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      <Card>
        <h2 className="text-lg font-semibold">Current plan</h2>
        <p className="mt-2 text-3xl font-bold capitalize">{license?.tier ?? "free"}</p>
        {license?.pro ? (
          <p className="mt-2 text-sm text-emerald-400">Pro — unlimited exports + Agent Clone for all team members</p>
        ) : (
          <p className="mt-2 text-sm text-zinc-400">
            Free — {license?.exports_remaining ?? 0} markdown export
            {(license?.exports_remaining ?? 0) === 1 ? "" : "s"} remaining for this team
          </p>
        )}
      </Card>

      {!license?.pro && (
        <Card className="border-emerald-500/40">
          <h2 className="text-lg font-semibold text-emerald-400">Upgrade team to Pro</h2>
          <p className="mt-2 text-sm text-zinc-400">
            $7/month or $50/year — Agent Clone + unlimited exports for everyone on the team
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Button
              variant="primary"
              disabled={checkoutLoading !== null}
              onClick={() => startCheckout("monthly")}
            >
              {checkoutLoading === "monthly" ? "Redirecting…" : "$7 / month"}
            </Button>
            <Button
              variant="primary"
              disabled={checkoutLoading !== null}
              onClick={() => startCheckout("annual")}
            >
              {checkoutLoading === "annual" ? "Redirecting…" : "$50 / year"}
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
