import { useIssues } from '../context/IssueContext';
import type { IssueStatus, IssuePriority } from '../types/issue';
import { inputCls } from './ui/FormField';

const STATUS_OPTIONS: IssueStatus[] = ['Open', 'In Progress', 'Closed'];
const PRIORITY_OPTIONS: IssuePriority[] = ['Low', 'Medium', 'High', 'Critical'];

const selectCls = `${inputCls} cursor-pointer`;

interface IssueFiltersProps {
  onCreateClick: () => void;
}

export function IssueFilters({ onCreateClick }: IssueFiltersProps) {
  const { filters, setFilters } = useIssues();

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Search */}
      <div className="relative flex-1 min-w-[180px]">
        <svg
          className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-400"
          viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2"
        >
          <circle cx="6.5" cy="6.5" r="4.5" />
          <path d="M10 10l3.5 3.5" strokeLinecap="round" />
        </svg>
        <input
          type="search"
          placeholder="Search titles…"
          value={filters.search}
          onChange={(e) => setFilters({ search: e.target.value })}
          className={`${inputCls} pl-8`}
          aria-label="Search issues by title"
        />
      </div>

      {/* Status */}
      <select
        value={filters.status}
        onChange={(e) => setFilters({ status: e.target.value as IssueStatus | '' })}
        className={`${selectCls} w-36`}
        aria-label="Filter by status"
      >
        <option value="">All statuses</option>
        {STATUS_OPTIONS.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>

      {/* Priority */}
      <select
        value={filters.priority}
        onChange={(e) => setFilters({ priority: e.target.value as IssuePriority | '' })}
        className={`${selectCls} w-36`}
        aria-label="Filter by priority"
      >
        <option value="">All priorities</option>
        {PRIORITY_OPTIONS.map((p) => (
          <option key={p} value={p}>{p}</option>
        ))}
      </select>

      {/* Create button */}
      <button
        onClick={onCreateClick}
        className="ml-auto flex items-center gap-1.5 rounded bg-neutral-800 px-3 py-2 text-sm font-medium text-white hover:bg-neutral-700 transition-colors"
      >
        <svg className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M8 3v10M3 8h10" strokeLinecap="round" />
        </svg>
        New Issue
      </button>
    </div>
  );
}
