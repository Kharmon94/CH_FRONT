import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { buildDesktopDeepLink } from "../lib/deepLink";
import { isDesktopApp } from "../lib/localEngine";
import { cloudApi, localApi, setToken } from "../services/api";

/** Web callback after cloud OAuth — forwards JWT to cursorhelp:// or stores for web/desktop. */
export function OAuthDesktopCallbackPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { refreshMe } = useAuth();
  const token = params.get("token");

  useEffect(() => {
    let cancelled = false;
    let timer: number | undefined;

    async function finish(storedToken: string) {
      setToken(storedToken);

      if (isDesktopApp()) {
        try {
          const me = await cloudApi.authMe();
          await localApi.authSync({
            user: {
              id: me.user.id,
              email: me.user.email,
              role: me.user.role,
              name: me.user.name,
              avatar_url: me.user.avatar_url,
              teams: me.user.teams,
            },
            teams: me.user.teams,
          });
        } catch {
          // Local sync is best-effort.
        }
        await refreshMe();
        if (!cancelled) void navigate("/app", { replace: true });
        return;
      }

      window.location.href = buildDesktopDeepLink(storedToken);
      timer = window.setTimeout(async () => {
        await refreshMe();
        if (!cancelled) void navigate("/app", { replace: true });
      }, 2500);
    }

    if (!token) {
      void navigate("/app/login?oauth_error=Desktop+sign-in+failed", { replace: true });
      return;
    }

    void finish(token);
    return () => {
      cancelled = true;
      if (timer) window.clearTimeout(timer);
    };
  }, [token, navigate, refreshMe]);

  return (
    <main className="mx-auto max-w-md px-4 py-16 text-center">
      <h1 className="text-xl font-semibold">Opening Cursor Help…</h1>
      <p className="mt-3 text-sm text-ch-text-secondary">
        If the desktop app does not open,{" "}
        <button
          type="button"
          className="text-ch-primary hover:underline"
          onClick={() => {
            void refreshMe().then(() => navigate("/app", { replace: true }));
          }}
        >
          continue in the browser
        </button>
        .
      </p>
    </main>
  );
}
