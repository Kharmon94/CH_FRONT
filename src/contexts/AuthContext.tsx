import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { api, getToken, setToken, type CurrentUser } from "../services/api";

type AuthContextValue = {
  user: CurrentUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<CurrentUser>;
  signUp: (email: string, password: string, name?: string) => Promise<CurrentUser>;
  adminSignIn: (email: string, password: string) => Promise<CurrentUser>;
  signOut: () => void;
  refreshMe: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshMe = useCallback(async () => {
    const t = getToken();
    if (!t) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const res = await api.authMe();
      setUser(res.user);
    } catch {
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshMe();
  }, [refreshMe]);

  const signIn = useCallback(async (email: string, password: string) => {
    const res = await api.authSignIn(email, password);
    setToken(res.token);
    setUser(res.user);
    return res.user;
  }, []);

  const signUp = useCallback(async (email: string, password: string, name?: string) => {
    const res = await api.authSignUp(email, password, name);
    setToken(res.token);
    setUser(res.user);
    return res.user;
  }, []);

  const adminSignIn = useCallback(async (email: string, password: string) => {
    const res = await api.adminSignIn(email, password);
    setToken(res.token);
    setUser(res.user);
    return res.user;
  }, []);

  const signOut = useCallback(() => {
    setToken(null);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, loading, signIn, signUp, adminSignIn, signOut, refreshMe }),
    [user, loading, signIn, signUp, adminSignIn, signOut, refreshMe]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
