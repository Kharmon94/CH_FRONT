import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { parseDeepLink, isAuthDeepLink } from "../lib/deepLink";
import { registerDesktopAuthListener } from "../lib/desktopAuth";
import { isDesktopApp, isLocalEngineReachable } from "../lib/localEngine";
import { listenDeepLinks } from "../lib/tauriBridge";
import { cloudApi, localApi, setToken } from "../services/api";

/** Listens for cursorhelp://auth deep links when the local engine or Tauri shell is active. */
export function useDesktopAuthBridge() {
  const navigate = useNavigate();
  const { refreshMe } = useAuth();
  const [bridgeActive, setBridgeActive] = useState(isDesktopApp());

  useEffect(() => {
    let cancelled = false;
    if (!bridgeActive) {
      void isLocalEngineReachable().then((reachable) => {
        if (!cancelled && reachable) setBridgeActive(true);
      });
    }
    return () => {
      cancelled = true;
    };
  }, [bridgeActive]);

  useEffect(() => {
    if (!bridgeActive) return;

    let cancelled = false;
    let unlistenTauri: (() => void) | undefined;
    let unlistenCustom: (() => void) | undefined;

    async function finishAuth(token: string) {
      setToken(token);
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
        // Local sync is best-effort until the engine is running.
      }
      await refreshMe();
      if (!cancelled) void navigate("/app", { replace: true });
    }

    function handleDeepLink(url: string) {
      if (!isAuthDeepLink(url)) return;
      const parsed = parseDeepLink(url);
      if (parsed.token) void finishAuth(parsed.token);
    }

    const initial = new URLSearchParams(window.location.search).get("desktop_token");
    if (initial) {
      window.history.replaceState({}, "", window.location.pathname);
      void finishAuth(initial);
    }

    void listenDeepLinks(handleDeepLink).then((unlisten) => {
      if (cancelled) {
        unlisten();
        return;
      }
      unlistenTauri = unlisten;
    });

    unlistenCustom = registerDesktopAuthListener((token) => {
      void finishAuth(token);
    });

    function onHash() {
      const hash = window.location.hash.replace(/^#/, "");
      if (hash.startsWith("auth")) handleDeepLink(`cursorhelp://${hash}`);
    }
    window.addEventListener("hashchange", onHash);
    onHash();

    return () => {
      cancelled = true;
      unlistenTauri?.();
      unlistenCustom?.();
      window.removeEventListener("hashchange", onHash);
    };
  }, [bridgeActive, navigate, refreshMe]);
}
