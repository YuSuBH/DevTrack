import { useState } from 'react';
import { ProjectProvider, useProjects } from './context/ProjectContext';
import { IssueProvider, useIssues } from './context/IssueContext';
import type { Issue } from './types/issue';

import { ProjectList }       from './components/ProjectList';
import { DashboardStats }    from './components/DashboardStats';
import { IssueFilters }      from './components/IssueFilters';
import { IssueList }         from './components/IssueList';
import { InsightsPanel }     from './components/InsightsPanel';
import { CreateIssueModal }  from './components/CreateIssueModal';
import { EditIssueModal }    from './components/EditIssueModal';
import { EditProjectModal }  from './components/EditProjectModal';
import { Spinner }           from './components/ui/Spinner';

// ── Inline stat chips in the project header ─────────────────────────────────

function ProjectHeaderStats() {
  const { stats, isLoadingStats } = useIssues();
  if (isLoadingStats || !stats) return null;

  const chips: Array<{ label: string; cls: string }> = [
    { label: `${stats.total} issues`,          cls: 'bg-neutral-800 text-neutral-300 ring-neutral-700'  },
    { label: `${stats.open} open`,             cls: 'bg-blue-900/60 text-blue-300 ring-blue-700'        },
    { label: `${stats.inProgress} in progress`,cls: 'bg-amber-900/50 text-amber-300 ring-amber-700'     },
    { label: `${stats.closed} closed`,         cls: 'bg-neutral-800 text-neutral-400 ring-neutral-700'  },
  ];

  return (
    <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
      {chips.map(({ label, cls }) => (
        <span key={label} className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-medium ring-1 ${cls}`}>
          {label}
        </span>
      ))}
    </div>
  );
}

// ── Project workspace ───────────────────────────────────────────────────────

function ProjectShell() {
  const { activeProject, isLoading, projects } = useProjects();

  const [createOpen,     setCreateOpen]     = useState(false);
  const [editingIssue,   setEditingIssue]   = useState<Issue | null>(null);
  const [editingProject, setEditingProject] = useState(false);

  if (isLoading) {
    return (
      <main className="flex flex-1 items-center justify-center">
        <div className="flex items-center gap-2 text-sm text-neutral-500">
          <Spinner size="md" /> Loading projects…
        </div>
      </main>
    );
  }

  if (projects.length === 0 || !activeProject) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center gap-3 text-center px-6">
        <svg className="h-10 w-10 text-neutral-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="3" y="5" width="18" height="16" rx="2" />
          <path d="M3 10h18M8 3v4M16 3v4" strokeLinecap="round" />
        </svg>
        <p className="text-sm font-medium text-neutral-400">No projects yet</p>
        <p className="text-xs text-neutral-600">Create a project using the sidebar to get started.</p>
      </main>
    );
  }

  return (
    <IssueProvider projectId={activeProject._id}>
      <main className="flex flex-1 flex-col min-w-0 overflow-hidden">

        {/* Header */}
        <header className="border-b border-neutral-800 bg-neutral-950 px-6 py-4">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-semibold text-neutral-100 truncate">
                  {activeProject.name}
                </h1>
                <button
                  onClick={() => setEditingProject(true)}
                  aria-label={`Edit project: ${activeProject.name}`}
                  className="shrink-0 rounded p-1 text-neutral-600 hover:bg-neutral-800 hover:text-neutral-300 transition-colors"
                >
                  <svg className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M11 2l3 3-8 8H3v-3l8-8z" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
              {activeProject.description && (
                <p className="text-xs text-neutral-500 mt-0.5 truncate">{activeProject.description}</p>
              )}
              <ProjectHeaderStats />
            </div>
          </div>
        </header>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-4">
          <DashboardStats />
          <div className="flex gap-5 items-start">
            <div className="flex flex-1 flex-col gap-3 min-w-0">
              <IssueFilters onCreateClick={() => setCreateOpen(true)} />
              <IssueList onEdit={(issue) => setEditingIssue(issue)} />
            </div>
            <InsightsPanel />
          </div>
        </div>
      </main>

      <CreateIssueModal open={createOpen}    onClose={() => setCreateOpen(false)} />
      <EditIssueModal   issue={editingIssue} onClose={() => setEditingIssue(null)} />
      <EditProjectModal
        project={editingProject ? activeProject : null}
        onClose={() => setEditingProject(false)}
      />
    </IssueProvider>
  );
}

// ── Root ────────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <ProjectProvider>
      <div className="flex h-screen overflow-hidden bg-neutral-950 font-sans text-neutral-100 antialiased">

        {/* Sidebar */}
        <aside className="hidden md:flex fixed inset-y-0 left-0 w-52 flex-col bg-neutral-900 text-neutral-300 z-30">
          <div className="flex items-center gap-2 border-b border-neutral-800 px-5 py-4">
            <svg className="h-5 w-5 text-neutral-400" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6">
              <rect x="2" y="4" width="16" height="13" rx="2" />
              <path d="M2 8h16M7 4V2M13 4V2" strokeLinecap="round" />
            </svg>
            <span className="text-sm font-semibold tracking-tight text-white">DevTrack</span>
          </div>
          <div className="flex-1 overflow-y-auto">
            <ProjectList />
          </div>
          <div className="border-t border-neutral-800 px-5 py-3 text-xs text-neutral-600">
            MVP v0.1
          </div>
        </aside>

        {/* Main */}
        <div className="flex flex-1 flex-col min-w-0 md:ml-52">
          <ProjectShell />
        </div>

      </div>
    </ProjectProvider>
  );
}
