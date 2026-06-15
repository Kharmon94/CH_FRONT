import { type FormEvent, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { AuthCard, AuthChrome } from "../components/layout/AuthChrome";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";

export function AdminLoginPage() {
  const { adminSignIn } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await adminSignIn(email, password);
      navigate(params.get("next") || "/admin");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign in failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthChrome>
      <AuthCard>
        <span className="rounded-full bg-ch-accent/15 px-2.5 py-1 text-xs font-medium text-ch-accent">
          Admin
        </span>
        <h1 className="mt-4 text-2xl font-semibold text-ch-text">Admin sign in</h1>
        {error && <p className="mt-4 text-sm text-red-500">{error}</p>}
        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div>
            <label className="mb-1 block text-xs text-ch-text-secondary">Email</label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <label className="mb-1 block text-xs text-ch-text-secondary">Password</label>
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
      </AuthCard>
    </AuthChrome>
  );
}
