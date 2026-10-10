import { useState } from 'react';
import type { Issue } from '../types/issue';
import { useIssues } from '../context/IssueContext';
import { StatusBadge, PriorityBadge, LabelChip } from './ui/Badge';
import { Spinner } from './ui/Spinner';

interface IssueCardProps {
  issue: Issue;
  onEdit: (issue: Issue) => void;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric',
  });
}

export function IssueCard({ issue, onEdit }: IssueCardProps) {
  const { deleteIssue } = useIssues();
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!confirm(`Delete "${issue.title}"? This cannot be undone.`)) return;
    setDeleting(true);
    try {
      await deleteIssue(issue._id);
    } catch {
      setDeleting(false);
    }
  }

  return (
    <article className="group flex items-center gap-3 rounded-lg bg-white px-4 py-3 ring-1 ring-neutral-200 hover:ring-neutral-300 transition-colors">
      {/* Title + badges */}
      <div className="flex flex-1 items-center gap-3 min-w-0">
        <h3 className="text-sm font-medium text-neutral-800 truncate">
          {issue.title}
        </h3>
        <div className="flex shrink-0 items-center gap-1.5">
          <StatusBadge status={issue.status} />
          <PriorityBadge priority={issue.priority} />
          {issue.labels.map((l) => <LabelChip key={l} label={l} />)}
        </div>
      </div>

      {/* Date + actions */}
      <div className="flex shrink-0 items-center gap-2">
        <span className="text-xs text-neutral-400 tabular-nums">{formatDate(issue.createdAt)}</span>

        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(issue)}
            aria-label={`Edit issue: ${issue.title}`}
            className="rounded p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 transition-colors"
          >
            <svg className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M11 2l3 3-8 8H3v-3l8-8z" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            aria-label={`Delete issue: ${issue.title}`}
            className="rounded p-1.5 text-neutral-400 hover:bg-red-50 hover:text-red-600 transition-colors disabled:opacity-40"
          >
            {deleting
              ? <Spinner size="sm" />
              : (
                <svg className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M3 4h10M6 4V2h4v2M5 4l.5 9h5l.5-9" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )
            }
          </button>
        </div>
      </div>
    </article>
  );
}
