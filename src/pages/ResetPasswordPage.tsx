import { type FormEvent, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { api } from "../services/api";
import { AuthCard, AuthChrome } from "../components/layout/AuthChrome";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";

export function ResetPasswordPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const resetToken = params.get("reset_token") ?? "";
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }
    if (!resetToken) {
      setError("Invalid or missing reset link");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await api.authResetPassword(resetToken, password);
      navigate("/app/login");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not reset password");
    } finally {
      setLoading(false);
    }
  }

  if (!resetToken) {
    return (
      <AuthChrome>
        <AuthCard>
          <p className="text-center text-sm text-red-500">Invalid or expired reset link.</p>
          <Link to="/app/forgot-password" className="mt-4 inline-block text-sm text-ch-primary">
            Request a new link
          </Link>
        </AuthCard>
      </AuthChrome>
    );
  }

  return (
    <AuthChrome>
      <AuthCard>
        <h1 className="text-2xl font-semibold text-ch-text">Reset password</h1>
        <p className="mt-2 text-sm text-ch-text-secondary">Choose a new password for your account.</p>

        {error && (
          <p className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-500">
            {error}
          </p>
        )}

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div>
            <label className="mb-1 block text-xs text-ch-text-secondary">New password</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-ch-text-secondary">Confirm password</label>
            <Input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              minLength={8}
            />
          </div>
          <Button type="submit" variant="primary" className="w-full" disabled={loading}>
            {loading ? "Saving…" : "Reset password"}
          </Button>
        </form>
      </AuthCard>
    </AuthChrome>
  );
}
