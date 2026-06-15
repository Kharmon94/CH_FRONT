import { type FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../services/api";
import { AuthCard, AuthChrome } from "../components/layout/AuthChrome";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";

export function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await api.authForgotPassword(email);
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Request failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthChrome>
      <AuthCard>
        <h1 className="text-2xl font-semibold text-ch-text">Forgot password</h1>
        <p className="mt-2 text-sm text-ch-text-secondary">
          Enter your email and we&apos;ll send reset instructions.
        </p>

        {sent ? (
          <p className="mt-6 text-sm text-ch-primary">
            If an account exists for that email, you&apos;ll receive reset instructions shortly.
          </p>
        ) : (
          <>
            {error && (
              <p className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-500">
                {error}
              </p>
            )}
            <form onSubmit={onSubmit} className="mt-6 space-y-4">
              <div>
                <label className="mb-1 block text-xs text-ch-text-secondary">Email</label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" variant="primary" className="w-full" disabled={loading}>
                {loading ? "Sending…" : "Send reset link"}
              </Button>
            </form>
          </>
        )}

        <p className="mt-6 text-center text-sm text-ch-text-secondary">
          <Link to="/app/login" className="text-ch-primary hover:opacity-80">
            Back to sign in
          </Link>
        </p>
      </AuthCard>
    </AuthChrome>
  );
}
