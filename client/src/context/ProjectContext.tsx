import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import type { ReactNode } from 'react';
import type { Project, CreateProjectPayload, UpdateProjectPayload } from '../types/issue';
import * as api from '../api/projects';

interface ProjectState {
  projects: Project[];
  activeProject: Project | null;
  isLoading: boolean;
  error: string | null;
}

interface ProjectActions {
  setActiveProject: (project: Project) => void;
  createProject: (payload: CreateProjectPayload) => Promise<Project>;
  updateProject: (id: string, payload: UpdateProjectPayload) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  refresh: () => void;
}

const ProjectContext = createContext<(ProjectState & ProjectActions) | null>(null);

export function ProjectProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects]           = useState<Project[]>([]);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading]         = useState(true);
  const [error, setError]                 = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await api.fetchProjects();
      setProjects(data);
      // Keep active selection if the project still exists; else default to first
      setActiveProject((prev) => {
        if (prev) {
          const still = data.find((p) => p._id === prev._id);
          return still ?? data[0] ?? null;
        }
        return data[0] ?? null;
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load projects');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const createProject = useCallback(async (payload: CreateProjectPayload): Promise<Project> => {
    const project = await api.createProject(payload);
    await load();
    setActiveProject(project);
    return project;
  }, [load]);

  const updateProject = useCallback(async (id: string, payload: UpdateProjectPayload) => {
    await api.updateProject(id, payload);
    await load();
  }, [load]);

  const deleteProject = useCallback(async (id: string) => {
    await api.deleteProject(id);
    await load();
  }, [load]);

  return (
    <ProjectContext.Provider value={{
      projects, activeProject, isLoading, error,
      setActiveProject, createProject, updateProject, deleteProject,
      refresh: load,
    }}>
      {children}
    </ProjectContext.Provider>
  );
}

export function useProjects(): ProjectState & ProjectActions {
  const ctx = useContext(ProjectContext);
  if (!ctx) throw new Error('useProjects must be used inside ProjectProvider');
  return ctx;
}
