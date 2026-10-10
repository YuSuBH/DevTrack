import type { IssueStatus, IssuePriority } from '../../types/issue';

const STATUS_STYLES: Record<IssueStatus, string> = {
  Open:        'bg-blue-50 text-blue-700 ring-1 ring-blue-200',
  'In Progress':'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
  Closed:      'bg-neutral-100 text-neutral-500 ring-1 ring-neutral-200',
};

const PRIORITY_STYLES: Record<IssuePriority, string> = {
  Low:      'bg-neutral-100 text-neutral-500 ring-1 ring-neutral-200',
  Medium:   'bg-sky-50 text-sky-700 ring-1 ring-sky-200',
  High:     'bg-orange-50 text-orange-700 ring-1 ring-orange-200',
  Critical: 'bg-red-50 text-red-700 ring-1 ring-red-200',
};

interface StatusBadgeProps {
  status: IssueStatus;
}

interface PriorityBadgeProps {
  priority: IssuePriority;
}

const base = 'inline-flex items-center rounded px-1.5 py-0.5 text-xs font-medium tracking-wide';

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span className={`${base} ${STATUS_STYLES[status]}`}>
      {status}
    </span>
  );
}

export function PriorityBadge({ priority }: PriorityBadgeProps) {
  return (
    <span className={`${base} ${PRIORITY_STYLES[priority]}`}>
      {priority}
    </span>
  );
}

/** Generic neutral label chip */
export function LabelChip({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center rounded px-1.5 py-0.5 text-xs font-medium bg-neutral-100 text-neutral-600 ring-1 ring-neutral-200">
      {label}
    </span>
  );
}
