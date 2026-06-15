import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { setToken } from "../services/api";

const DESKTOP_OAUTH_CALLBACK = "/app/oauth/desktop/callback";

export function OAuthGoogleCallbackPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { refreshMe } = useAuth();

  useEffect(() => {
    let cancelled = false;

    async function completeOAuth() {
      const token = params.get("token");
      const next = params.get("next") || "/app";
      if (token) {
        setToken(token);
        await refreshMe();
        if (cancelled) return;
        if (next.startsWith(DESKTOP_OAUTH_CALLBACK)) {
          const joiner = next.includes("?") ? "&" : "?";
          navigate(`${next}${joiner}token=${encodeURIComponent(token)}`, { replace: true });
          return;
        }
        navigate(next, { replace: true });
      } else {
        navigate("/app/login?oauth_error=Google+sign-in+failed", { replace: true });
      }
    }

    void completeOAuth();
    return () => {
      cancelled = true;
    };
  }, [params, navigate, refreshMe]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-ch-bg text-ch-text-secondary">
      Completing sign-in…
    </div>
  );
}
