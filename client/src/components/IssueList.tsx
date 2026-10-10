import type { Issue } from '../types/issue';
import { useIssues } from '../context/IssueContext';
import { IssueCard } from './IssueCard';
import { Spinner } from './ui/Spinner';

interface IssueListProps {
  onEdit: (issue: Issue) => void;
}

export function IssueList({ onEdit }: IssueListProps) {
  const { issues, isLoadingIssues, error } = useIssues();

  if (isLoadingIssues) {
    return (
      <div className="flex items-center justify-center gap-2 py-16 text-sm text-neutral-500">
        <Spinner size="md" />
        <span>Loading issues…</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-900 bg-red-950/50 px-5 py-4 text-sm text-red-400">
        <span className="font-medium">Error:</span> {error}
      </div>
    );
  }

  if (issues.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-16 text-sm text-neutral-600">
        <svg className="h-8 w-8 text-neutral-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="3" y="5" width="18" height="16" rx="2" />
          <path d="M3 10h18M8 3v4M16 3v4" strokeLinecap="round" />
        </svg>
        <span>No issues found</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1.5">
      {issues.map((issue) => (
        <IssueCard key={issue._id} issue={issue} onEdit={onEdit} />
      ))}
    </div>
  );
}
