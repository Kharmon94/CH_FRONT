import { type FormEvent, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useDesktopAuthBridge } from "../hooks/useDesktopAuth";
import { api } from "../services/api";
import { isDesktopApp } from "../lib/localEngine";
import { AuthCard, AuthChrome } from "../components/layout/AuthChrome";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";

export function LoginPage() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  useDesktopAuthBridge();
  const [params] = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(params.get("oauth_error"));
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await signIn(email, password);
      const next = params.get("next") || "/app";
      navigate(next);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign in failed");
    } finally {
      setLoading(false);
    }
  }

  async function googleSignIn() {
    setError(null);
    try {
      const requestedNext = params.get("next");
      const next =
        requestedNext ||
        (isDesktopApp() ? "/app/oauth/desktop/callback" : "/app");
      const { authorize_url } = await api.authGoogleStart(next);
      window.location.href = authorize_url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Google sign-in unavailable");
    }
  }

  return (
    <AuthChrome>
      <AuthCard>
        <h1 className="text-2xl font-semibold text-ch-text">Sign in</h1>
        <p className="mt-2 text-sm text-ch-text-secondary">Access your Cursor Help workspace</p>

        {error && (
          <p className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-500">
            {error}
          </p>
        )}

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div>
            <label className="mb-1 block text-xs text-ch-text-secondary">Email</label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <div className="mb-1 flex items-center justify-between">
              <label className="text-xs text-ch-text-secondary">Password</label>
              <Link to="/app/forgot-password" className="text-xs text-ch-primary hover:opacity-80">
                Forgot password?
              </Link>
            </div>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" variant="primary" className="w-full" disabled={loading}>
            {loading ? "Signing in…" : "Sign in"}
          </Button>
        </form>

        <Button variant="secondary" className="mt-3 w-full" onClick={googleSignIn}>
          Continue with Google
        </Button>

        <p className="mt-6 text-center text-sm text-ch-text-secondary">
          No account?{" "}
          <Link to="/app/sign-up" className="text-ch-primary hover:opacity-80">
            Sign up
          </Link>
          {" · "}
          <Link to="/" className="text-ch-primary hover:opacity-80">
            Back to home
          </Link>
        </p>
      </AuthCard>
    </AuthChrome>
  );
}
