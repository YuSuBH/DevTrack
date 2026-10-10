import { useIssues } from '../context/IssueContext';
import type { IssueStatus, IssuePriority } from '../types/issue';

const STATUS_TABS: Array<{ label: string; value: IssueStatus | '' }> = [
  { label: 'All',         value: ''            },
  { label: 'Open',        value: 'Open'        },
  { label: 'In Progress', value: 'In Progress' },
  { label: 'Closed',      value: 'Closed'      },
];

const PRIORITY_OPTIONS: IssuePriority[] = ['Low', 'Medium', 'High', 'Critical'];

interface IssueFiltersProps {
  onCreateClick: () => void;
}

export function IssueFilters({ onCreateClick }: IssueFiltersProps) {
  const { filters, setFilters } = useIssues();

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-lg bg-neutral-900 px-3 py-2.5 ring-1 ring-neutral-800">
      {/* Search */}
      <div className="relative min-w-[180px] flex-1">
        <svg
          className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-600"
          viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2"
        >
          <circle cx="6.5" cy="6.5" r="4.5" />
          <path d="M10 10l3.5 3.5" strokeLinecap="round" />
        </svg>
        <input
          type="search"
          placeholder="Search issues…"
          value={filters.search}
          onChange={(e) => setFilters({ search: e.target.value })}
          className="w-full rounded border-0 bg-transparent py-1 pl-8 pr-2 text-sm text-neutral-300 placeholder:text-neutral-600 focus:outline-none"
          aria-label="Search issues by title"
        />
      </div>

      {/* Divider */}
      <div className="h-5 w-px bg-neutral-700" />

      {/* Status pill tabs */}
      <div className="flex items-center gap-1">
        {STATUS_TABS.map(({ label, value }) => {
          const active = filters.status === value;
          return (
            <button
              key={label}
              onClick={() => setFilters({ status: value as IssueStatus | '' })}
              className={`rounded px-2.5 py-1 text-xs font-medium transition-colors ${
                active
                  ? 'bg-neutral-700 text-neutral-100'
                  : 'text-neutral-500 hover:bg-neutral-800 hover:text-neutral-300'
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Divider */}
      <div className="h-5 w-px bg-neutral-700" />

      {/* Priority select */}
      <select
        value={filters.priority}
        onChange={(e) => setFilters({ priority: e.target.value as IssuePriority | '' })}
        className="cursor-pointer rounded border-0 bg-neutral-900 py-1 text-xs text-neutral-500 focus:outline-none hover:text-neutral-300 transition-colors"
        aria-label="Filter by priority"
      >
        <option value="">All priorities</option>
        {PRIORITY_OPTIONS.map((p) => (
          <option key={p} value={p}>{p}</option>
        ))}
      </select>

      {/* New Issue */}
      <button
        onClick={onCreateClick}
        className="ml-auto flex items-center gap-1.5 rounded bg-neutral-700 px-3 py-1.5 text-xs font-medium text-neutral-100 hover:bg-neutral-600 transition-colors"
      >
        <svg className="h-3 w-3" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M8 3v10M3 8h10" strokeLinecap="round" />
        </svg>
        New Issue
      </button>
    </div>
  );
}
