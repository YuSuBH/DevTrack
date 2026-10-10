import { useState } from 'react';
import type { Project } from '../types/issue';
import { useProjects } from '../context/ProjectContext';
import { Spinner } from './ui/Spinner';
import { CreateProjectModal } from './CreateProjectModal';
import { EditProjectModal } from './EditProjectModal';

/** Single project row in the sidebar */
function ProjectItem({
  project,
  active,
  onSelect,
  onEdit,
}: {
  project: Project;
  active: boolean;
  onSelect: () => void;
  onEdit: () => void;
}) {
  return (
    <div
      className={`group flex items-center justify-between rounded px-3 py-2 cursor-pointer transition-colors ${
        active
          ? 'bg-neutral-800 text-white'
          : 'text-neutral-400 hover:bg-neutral-800/60 hover:text-neutral-200'
      }`}
      onClick={onSelect}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onSelect(); }}
      aria-current={active ? 'page' : undefined}
    >
      <span className="truncate text-sm font-medium">{project.name}</span>

      {/* Edit button — only visible on hover or when active */}
      <button
        onClick={(e) => { e.stopPropagation(); onEdit(); }}
        aria-label={`Edit project: ${project.name}`}
        className={`ml-1 shrink-0 rounded p-1 transition-colors ${
          active
            ? 'text-neutral-400 hover:bg-neutral-700 hover:text-neutral-200'
            : 'opacity-0 group-hover:opacity-100 text-neutral-500 hover:bg-neutral-700 hover:text-neutral-300'
        }`}
      >
        <svg className="h-3 w-3" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M11 2l3 3-8 8H3v-3l8-8z" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
}

export function ProjectList() {
  const { projects, activeProject, isLoading, error, setActiveProject } = useProjects();
  const [createOpen,      setCreateOpen]      = useState(false);
  const [editingProject,  setEditingProject]  = useState<Project | null>(null);

  return (
    <>
      {/* Section header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-1">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-neutral-500">
          Projects
        </span>
        <button
          onClick={() => setCreateOpen(true)}
          aria-label="New project"
          className="rounded p-1 text-neutral-500 hover:bg-neutral-800 hover:text-neutral-300 transition-colors"
        >
          <svg className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M8 3v10M3 8h10" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {/* List body */}
      <div className="flex flex-col gap-0.5 px-2 pb-2">
        {isLoading ? (
          <div className="flex items-center gap-2 px-3 py-3 text-xs text-neutral-500">
            <Spinner size="sm" className="border-neutral-700 border-t-neutral-400" />
            Loading…
          </div>
        ) : error ? (
          <p className="px-3 py-2 text-xs text-red-400">{error}</p>
        ) : projects.length === 0 ? (
          <p className="px-3 py-2 text-xs text-neutral-600">No projects yet.</p>
        ) : (
          projects.map((p) => (
            <ProjectItem
              key={p._id}
              project={p}
              active={activeProject?._id === p._id}
              onSelect={() => setActiveProject(p)}
              onEdit={() => setEditingProject(p)}
            />
          ))
        )}
      </div>

      <CreateProjectModal open={createOpen}      onClose={() => setCreateOpen(false)} />
      <EditProjectModal   project={editingProject} onClose={() => setEditingProject(null)} />
    </>
  );
}
