import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { api, getWorkspaceId, setWorkspaceId, type Workspace } from "../services/api";
import { useTeam } from "./TeamContext";

type WorkspaceContextValue = {
  workspace: Workspace | null;
  workspaces: Workspace[];
  loading: boolean;
  setActiveWorkspace: (workspaceId: number) => void;
  refreshWorkspaces: () => Promise<void>;
};

const WorkspaceContext = createContext<WorkspaceContextValue | undefined>(undefined);

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const { team } = useTeam();
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshWorkspaces = useCallback(async () => {
    if (!team) {
      setWorkspaces([]);
      setWorkspace(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const list = await api.workspaces.list(team.id);
      setWorkspaces(list);
      const stored = getWorkspaceId();
      const active = list.find((w) => w.id === stored) ?? list[0] ?? null;
      setWorkspace(active);
      if (active) setWorkspaceId(active.id);
    } finally {
      setLoading(false);
    }
  }, [team]);

  useEffect(() => {
    void refreshWorkspaces();
  }, [refreshWorkspaces]);

  const setActiveWorkspace = useCallback(
    (workspaceId: number) => {
      const next = workspaces.find((w) => w.id === workspaceId) ?? null;
      setWorkspace(next);
      if (next) setWorkspaceId(next.id);
    },
    [workspaces]
  );

  const value = useMemo(
    () => ({ workspace, workspaces, loading, setActiveWorkspace, refreshWorkspaces }),
    [workspace, workspaces, loading, setActiveWorkspace, refreshWorkspaces]
  );

  return <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>;
}

export function useWorkspace(): WorkspaceContextValue {
  const ctx = useContext(WorkspaceContext);
  if (!ctx) throw new Error("useWorkspace must be used within WorkspaceProvider");
  return ctx;
}
