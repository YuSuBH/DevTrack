import type { IssueStatus, IssuePriority } from '../../types/issue';

const STATUS_STYLES: Record<IssueStatus, string> = {
  Open:         'bg-blue-900/50 text-blue-300 ring-1 ring-blue-700',
  'In Progress':'bg-amber-900/50 text-amber-300 ring-1 ring-amber-700',
  Closed:       'bg-neutral-800 text-neutral-500 ring-1 ring-neutral-700',
};

const PRIORITY_STYLES: Record<IssuePriority, string> = {
  Low:      'bg-neutral-800 text-neutral-500 ring-1 ring-neutral-700',
  Medium:   'bg-sky-900/50 text-sky-300 ring-1 ring-sky-700',
  High:     'bg-orange-900/50 text-orange-300 ring-1 ring-orange-700',
  Critical: 'bg-red-900/50 text-red-400 ring-1 ring-red-700',
};

const base = 'inline-flex items-center rounded px-1.5 py-0.5 text-xs font-medium tracking-wide';

export function StatusBadge({ status }: { status: IssueStatus }) {
  return <span className={`${base} ${STATUS_STYLES[status]}`}>{status}</span>;
}

export function PriorityBadge({ priority }: { priority: IssuePriority }) {
  return <span className={`${base} ${PRIORITY_STYLES[priority]}`}>{priority}</span>;
}

export function LabelChip({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center rounded px-1.5 py-0.5 text-xs font-medium bg-neutral-800 text-neutral-400 ring-1 ring-neutral-700">
      {label}
    </span>
  );
}
