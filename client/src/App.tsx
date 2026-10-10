import { useState } from 'react';
import { IssueProvider } from './context/IssueContext';
import type { Issue } from './types/issue';

import { DashboardStats }    from './components/DashboardStats';
import { IssueFilters }      from './components/IssueFilters';
import { IssueList }         from './components/IssueList';
import { CreateIssueModal }  from './components/CreateIssueModal';
import { EditIssueModal }    from './components/EditIssueModal';

function AppShell() {
  const [createOpen,  setCreateOpen]  = useState(false);
  const [editingIssue, setEditingIssue] = useState<Issue | null>(null);

  return (
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

        {/* Nav */}
        <nav className="flex flex-col gap-0.5 px-3 py-3">
          <span className="flex items-center gap-2.5 rounded px-3 py-2 text-sm font-medium bg-neutral-800 text-white">
            <svg className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8">
              <rect x="1" y="3" width="14" height="11" rx="1.5" />
              <path d="M1 6h14M5 3V1M11 3V1" strokeLinecap="round" />
            </svg>
            Issues
          </span>
        </nav>

        {/* Footer */}
        <div className="mt-auto border-t border-neutral-800 px-5 py-3 text-xs text-neutral-600">
          MVP v0.1
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="flex flex-1 flex-col min-w-0">
        {/* Top bar */}
        <header className="border-b border-neutral-200 bg-white px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-base font-semibold text-neutral-800">Issues</h1>
              <p className="text-xs text-neutral-500 mt-0.5">Track, triage, and resolve project issues.</p>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex flex-col gap-5 px-6 py-5">
          {/* Stats */}
          <DashboardStats />

          {/* Filters + create */}
          <IssueFilters onCreateClick={() => setCreateOpen(true)} />

          {/* List */}
          <IssueList onEdit={(issue) => setEditingIssue(issue)} />
        </div>
      </main>

      {/* Modals */}
      <CreateIssueModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
      />
      <EditIssueModal
        issue={editingIssue}
        onClose={() => setEditingIssue(null)}
      />
    </div>
  );
}

export default function App() {
  return (
    <IssueProvider>
      <AppShell />
    </IssueProvider>
  );
}
