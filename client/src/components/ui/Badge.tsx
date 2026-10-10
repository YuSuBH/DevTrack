import type { IssueStatus, IssuePriority } from '../../types/issue';

const STATUS_STYLES: Record<IssueStatus, string> = {
  Open:         'bg-blue-900/50 text-blue-300',
  'In Progress':'bg-amber-900/50 text-amber-300',
  Closed:       'bg-neutral-800 text-neutral-500',
};

const PRIORITY_STYLES: Record<IssuePriority, string> = {
  Low:      'bg-neutral-800 text-neutral-500',
  Medium:   'bg-sky-900/50 text-sky-300',
  High:     'bg-orange-900/50 text-orange-300',
  Critical: 'bg-red-900/50 text-red-400',
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
    <span className="inline-flex items-center rounded px-1.5 py-0.5 text-xs font-medium bg-neutral-800 text-neutral-400">
      {label}
    </span>
  );
}
