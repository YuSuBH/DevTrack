import { useState } from 'react';
import { ProjectProvider, useProjects } from './context/ProjectContext';
import { IssueProvider } from './context/IssueContext';
import type { Issue } from './types/issue';

import { ProjectList }       from './components/ProjectList';
import { DashboardStats }    from './components/DashboardStats';
import { IssueFilters }      from './components/IssueFilters';
import { IssueList }         from './components/IssueList';
import { CreateIssueModal }  from './components/CreateIssueModal';
import { EditIssueModal }    from './components/EditIssueModal';
import { EditProjectModal }  from './components/EditProjectModal';
import { Spinner }           from './components/ui/Spinner';

// ── Inner shell — rendered once we know the active project ─────────────────

function ProjectShell() {
  const { activeProject, isLoading, projects } = useProjects();

  const [createOpen,    setCreateOpen]    = useState(false);
  const [editingIssue,  setEditingIssue]  = useState<Issue | null>(null);
  const [editingProject, setEditingProject] = useState(false);

  // Loading state — projects still being fetched
  if (isLoading) {
    return (
      <main className="flex flex-1 items-center justify-center">
        <div className="flex items-center gap-2 text-sm text-neutral-500">
          <Spinner size="md" />
          Loading projects…
        </div>
      </main>
    );
  }

  // No projects at all
  if (projects.length === 0 || !activeProject) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center gap-3 text-center px-6">
        <svg className="h-10 w-10 text-neutral-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="3" y="5" width="18" height="16" rx="2" />
          <path d="M3 10h18M8 3v4M16 3v4" strokeLinecap="round" />
        </svg>
        <p className="text-sm font-medium text-neutral-600">No projects yet</p>
        <p className="text-xs text-neutral-400">Create a project using the sidebar to get started.</p>
      </main>
    );
  }

  return (
    <IssueProvider projectId={activeProject._id}>
      <main className="flex flex-1 flex-col min-w-0">
        {/* Top bar */}
        <header className="border-b border-neutral-200 bg-white px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-base font-semibold text-neutral-800 truncate">
                  {activeProject.name}
                </h1>
                <button
                  onClick={() => setEditingProject(true)}
                  aria-label={`Edit project: ${activeProject.name}`}
                  className="shrink-0 rounded p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600 transition-colors"
                >
                  <svg className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M11 2l3 3-8 8H3v-3l8-8z" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
              {activeProject.description ? (
                <p className="text-xs text-neutral-500 mt-0.5 truncate">
                  {activeProject.description}
                </p>
              ) : (
                <p className="text-xs text-neutral-400 mt-0.5">
                  Track, triage, and resolve issues.
                </p>
              )}
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex flex-col gap-5 px-6 py-5">
          <DashboardStats />
          <IssueFilters onCreateClick={() => setCreateOpen(true)} />
          <IssueList onEdit={(issue) => setEditingIssue(issue)} />
        </div>
      </main>

      {/* Issue modals */}
      <CreateIssueModal open={createOpen}    onClose={() => setCreateOpen(false)} />
      <EditIssueModal   issue={editingIssue} onClose={() => setEditingIssue(null)} />

      {/* Project edit modal */}
      <EditProjectModal
        project={editingProject ? activeProject : null}
        onClose={() => setEditingProject(false)}
      />
    </IssueProvider>
  );
}

// ── Root ───────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <ProjectProvider>
      <div className="flex min-h-screen bg-neutral-50 font-sans text-neutral-800 antialiased">

        {/* ── Sidebar ── */}
        <aside className="hidden md:flex w-52 shrink-0 flex-col bg-neutral-900 text-neutral-300">
          {/* Brand */}
          <div className="flex items-center gap-2 border-b border-neutral-800 px-5 py-4">
            <svg className="h-5 w-5 text-neutral-400" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6">
              <rect x="2" y="4" width="16" height="13" rx="2" />
              <path d="M2 8h16M7 4V2M13 4V2" strokeLinecap="round" />
            </svg>
            <span className="text-sm font-semibold tracking-tight text-white">DevTrack</span>
          </div>

          {/* Project list */}
          <div className="flex-1 overflow-y-auto">
            <ProjectList />
          </div>

          {/* Footer */}
          <div className="border-t border-neutral-800 px-5 py-3 text-xs text-neutral-600">
            MVP v0.1
          </div>
        </aside>

        {/* ── Main area ── */}
        <ProjectShell />

      </div>
    </ProjectProvider>
  );
}
