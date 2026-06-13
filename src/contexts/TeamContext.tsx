import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { api, getTeamId, setTeamId, type TeamDetail } from "../services/api";
import { useAuth } from "./AuthContext";

type TeamContextValue = {
  team: TeamDetail | null;
  teams: TeamDetail[];
  loading: boolean;
  setActiveTeam: (teamId: number) => void;
  refreshTeams: () => Promise<void>;
  isOwner: boolean;
};

const TeamContext = createContext<TeamContextValue | undefined>(undefined);

export function TeamProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [teams, setTeams] = useState<TeamDetail[]>([]);
  const [team, setTeam] = useState<TeamDetail | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshTeams = useCallback(async () => {
    if (!user || user.role !== "user") {
      setTeams([]);
      setTeam(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const list = await api.teams.list();
      setTeams(list);
      const stored = getTeamId();
      const active = list.find((t) => t.id === stored) ?? list[0] ?? null;
      setTeam(active);
      if (active) setTeamId(active.id);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    void refreshTeams();
  }, [refreshTeams]);

  const setActiveTeam = useCallback(
    (teamId: number) => {
      const next = teams.find((t) => t.id === teamId) ?? null;
      setTeam(next);
      if (next) setTeamId(next.id);
    },
    [teams]
  );

  const isOwner = team?.membership_role === "owner";

  const value = useMemo(
    () => ({ team, teams, loading, setActiveTeam, refreshTeams, isOwner }),
    [team, teams, loading, setActiveTeam, refreshTeams, isOwner]
  );

  return <TeamContext.Provider value={value}>{children}</TeamContext.Provider>;
}

export function useTeam(): TeamContextValue {
  const ctx = useContext(TeamContext);
  if (!ctx) throw new Error("useTeam must be used within TeamProvider");
  return ctx;
}
