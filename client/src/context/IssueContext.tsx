import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import type { ReactNode } from 'react';
import type { Issue, IssueFilters, IssueStats, CreateIssuePayload, UpdateIssuePayload } from '../types/issue';
import * as api from '../api/issues';

interface IssueState {
  issues: Issue[];
  stats: IssueStats | null;
  filters: IssueFilters;
  isLoadingIssues: boolean;
  isLoadingStats: boolean;
  error: string | null;
}

interface IssueActions {
  setFilters: (filters: Partial<IssueFilters>) => void;
  createIssue: (payload: CreateIssuePayload) => Promise<void>;
  updateIssue: (id: string, payload: UpdateIssuePayload) => Promise<void>;
  deleteIssue: (id: string) => Promise<void>;
  refreshAll: () => void;
}

const IssueContext = createContext<(IssueState & IssueActions) | null>(null);

const DEFAULT_FILTERS: IssueFilters = { search: '', status: '', priority: '' };
const DEBOUNCE_MS = 400;

interface IssueProviderProps {
  projectId: string;
  children: ReactNode;
}

export function IssueProvider({ projectId, children }: IssueProviderProps) {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [stats, setStats] = useState<IssueStats | null>(null);
  const [filters, setFiltersState] = useState<IssueFilters>(DEFAULT_FILTERS);
  const [isLoadingIssues, setIsLoadingIssues] = useState(true);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const loadIssues = useCallback(async (f: IssueFilters) => {
    setIsLoadingIssues(true);
    setError(null);
    try {
      const data = await api.fetchIssues(projectId, f);
      setIssues(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load issues');
      setIssues([]);
    } finally {
      setIsLoadingIssues(false);
    }
  }, [projectId]);

  const loadStats = useCallback(async () => {
    setIsLoadingStats(true);
    try {
      const data = await api.fetchStats(projectId);
      setStats(data);
    } catch {
      setStats(null);
    } finally {
      setIsLoadingStats(false);
    }
  }, [projectId]);

  // Debounce search; fire immediately for status/priority changes
  const setFilters = useCallback(
    (partial: Partial<IssueFilters>) => {
      setFiltersState((prev) => {
        const next = { ...prev, ...partial };
        const searchChanged = partial.search !== undefined && partial.search !== prev.search;

        if (searchChanged) {
          if (debounceRef.current) clearTimeout(debounceRef.current);
          debounceRef.current = setTimeout(() => loadIssues(next), DEBOUNCE_MS);
        } else {
          if (debounceRef.current) clearTimeout(debounceRef.current);
          loadIssues(next);
        }

        return next;
      });
    },
    [loadIssues]
  );

  const refreshAll = useCallback(() => {
    loadIssues(filters);
    loadStats();
  }, [filters, loadIssues, loadStats]);

  // Reset and reload when project changes
  useEffect(() => {
    setFiltersState(DEFAULT_FILTERS);
    setIssues([]);
    setStats(null);
    loadIssues(DEFAULT_FILTERS);
    loadStats();
  }, [projectId, loadIssues, loadStats]);

  const createIssue = useCallback(
    async (payload: CreateIssuePayload) => {
      await api.createIssue(projectId, payload);
      refreshAll();
    },
    [projectId, refreshAll]
  );

  const updateIssue = useCallback(
    async (id: string, payload: UpdateIssuePayload) => {
      await api.updateIssue(projectId, id, payload);
      refreshAll();
    },
    [projectId, refreshAll]
  );

  const deleteIssue = useCallback(
    async (id: string) => {
      await api.deleteIssue(projectId, id);
      refreshAll();
    },
    [projectId, refreshAll]
  );

  return (
    <IssueContext.Provider
      value={{
        issues,
        stats,
        filters,
        isLoadingIssues,
        isLoadingStats,
        error,
        setFilters,
        createIssue,
        updateIssue,
        deleteIssue,
        refreshAll,
      }}
    >
      {children}
    </IssueContext.Provider>
  );
}

export function useIssues(): IssueState & IssueActions {
  const ctx = useContext(IssueContext);
  if (!ctx) throw new Error('useIssues must be used inside IssueProvider');
  return ctx;
}
