import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { setToken } from "../services/api";

export function OAuthGoogleCallbackPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = params.get("token");
    const next = params.get("next") || "/app";
    if (token) {
      setToken(token);
      navigate(next, { replace: true });
    } else {
      navigate("/app/login?oauth_error=Google+sign-in+failed", { replace: true });
    }
  }, [params, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-zinc-400">
      Completing sign-in…
    </div>
  );
}
