import { useState } from 'react';
import type { Issue } from '../types/issue';
import { useIssues } from '../context/IssueContext';
import { StatusBadge, PriorityBadge, LabelChip } from './ui/Badge';
import { Spinner } from './ui/Spinner';

interface IssueCardProps {
  issue: Issue;
  onEdit: (issue: Issue) => void;
}

/** Short human-readable ID: last 6 chars of ObjectId, uppercased */
function shortId(id: string) {
  return `#${id.slice(-6).toUpperCase()}`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatUpdated(iso: string) {
  const diff  = Date.now() - new Date(iso).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins  < 1)  return 'just now';
  if (mins  < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days  <  7) return `${days}d ago`;
  return formatDate(iso);
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
    <article className="group flex flex-col gap-2.5 rounded-lg bg-neutral-900 px-4 py-4 ring-1 ring-neutral-800 hover:ring-neutral-700 transition-colors">

      {/* Row 1: short ID + timestamp · actions */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <span className="text-xs font-mono font-medium text-neutral-500 tracking-wide">
            {shortId(issue._id)}
          </span>
          <span className="text-neutral-700 text-xs">·</span>
          <span className="text-xs text-neutral-600">
            opened {formatDate(issue.createdAt)}
          </span>
          <span className="text-neutral-700 text-xs">·</span>
          <span className="text-xs text-neutral-600">
            updated {formatUpdated(issue.updatedAt)}
          </span>
        </div>

        {/* Actions — always visible, subtle until hover */}
        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(issue)}
            aria-label={`Edit issue: ${issue.title}`}
            className="rounded p-1.5 text-neutral-600 hover:bg-neutral-800 hover:text-neutral-300 transition-colors"
          >
            <svg className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M11 2l3 3-8 8H3v-3l8-8z" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            aria-label={`Delete issue: ${issue.title}`}
            className="rounded p-1.5 text-neutral-600 hover:bg-red-900/40 hover:text-red-400 transition-colors disabled:opacity-40"
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

      {/* Row 2: title */}
      <h3 className="text-base font-semibold text-neutral-100 leading-snug">
        {issue.title}
      </h3>

      {/* Row 3: badges */}
      <div className="flex flex-wrap items-center gap-1.5">
        <StatusBadge status={issue.status} />
        <PriorityBadge priority={issue.priority} />
        {issue.labels.map((l) => <LabelChip key={l} label={l} />)}
      </div>

    </article>
  );
}
