import { type FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../services/api";
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
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-4">
      <div className="w-full max-w-md rounded-xl border border-zinc-800/80 bg-zinc-900/60 p-8 backdrop-blur">
        <h1 className="text-2xl font-semibold text-white">Forgot password</h1>
        <p className="mt-2 text-sm text-zinc-400">
          Enter your email and we&apos;ll send reset instructions.
        </p>

        {sent ? (
          <p className="mt-6 text-sm text-emerald-400">
            If an account exists for that email, you&apos;ll receive reset instructions shortly.
          </p>
        ) : (
          <>
            {error && (
              <p className="mt-4 rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
                {error}
              </p>
            )}
            <form onSubmit={onSubmit} className="mt-6 space-y-4">
              <div>
                <label className="mb-1 block text-xs text-zinc-400">Email</label>
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

        <p className="mt-6 text-center text-sm text-zinc-500">
          <Link to="/app/login" className="text-emerald-400 hover:text-emerald-300">
            Back to sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
