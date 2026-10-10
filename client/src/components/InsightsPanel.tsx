import { useIssues } from '../context/IssueContext';
import type { IssueStatus, IssuePriority } from '../types/issue';
import { StatusBadge, PriorityBadge } from './ui/Badge';
import { Spinner } from './ui/Spinner';

// ── Status breakdown ────────────────────────────────────────────────────────

const STATUS_BAR: Array<{ key: 'open' | 'inProgress' | 'closed'; label: IssueStatus; bar: string }> = [
  { key: 'open',       label: 'Open',        bar: 'bg-blue-500'    },
  { key: 'inProgress', label: 'In Progress', bar: 'bg-amber-500'   },
  { key: 'closed',     label: 'Closed',      bar: 'bg-neutral-500' },
];

function StatusBreakdown() {
  const { stats } = useIssues();
  const total      = stats?.total      ?? 0;
  const data       = { open: stats?.open ?? 0, inProgress: stats?.inProgress ?? 0, closed: stats?.closed ?? 0 };

  return (
    <section>
      <h3 className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-neutral-500">
        Status breakdown
      </h3>
      <div className="flex flex-col gap-3">
        {STATUS_BAR.map(({ key, label, bar }) => {
          const count = data[key];
          const pct   = total > 0 ? Math.round((count / total) * 100) : 0;
          return (
            <div key={key}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-neutral-400">{label}</span>
                <span className="text-xs tabular-nums text-neutral-500">{pct}%</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-neutral-800">
                <div
                  className={`h-1.5 rounded-full ${bar} transition-all duration-500`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

// ── Priority distribution ───────────────────────────────────────────────────

const PRIORITY_ORDER: IssuePriority[] = ['Critical', 'High', 'Medium', 'Low'];

function PriorityDistribution() {
  const { issues, isLoadingIssues } = useIssues();
  if (isLoadingIssues) return null;

  const counts = PRIORITY_ORDER.map((p) => ({
    priority: p,
    count: issues.filter((i) => i.priority === p).length,
  }));

  return (
    <section>
      <h3 className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-neutral-500">
        Priority overview
      </h3>
      <div className="flex flex-col gap-2">
        {counts.map(({ priority, count }) => (
          <div key={priority} className="flex items-center justify-between">
            <PriorityBadge priority={priority} />
            <span className="text-xs tabular-nums font-medium text-neutral-400">{count}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

// ── Recent activity ─────────────────────────────────────────────────────────

function formatRelative(iso: string) {
  const diff  = Date.now() - new Date(iso).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins  < 1)  return 'just now';
  if (mins  < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

function RecentActivity() {
  const { issues, isLoadingIssues } = useIssues();

  const recent = [...issues]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  if (isLoadingIssues) {
    return (
      <section>
        <h3 className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-neutral-500">
          Recent activity
        </h3>
        <div className="flex items-center gap-2 text-xs text-neutral-600">
          <Spinner size="sm" className="border-neutral-700 border-t-neutral-500" /> Loading…
        </div>
      </section>
    );
  }

  if (recent.length === 0) return null;

  return (
    <section>
      <h3 className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-neutral-500">
        Recent activity
      </h3>
      <div className="flex flex-col gap-3">
        {recent.map((issue) => (
          <div key={issue._id} className="flex flex-col gap-1">
            <p className="text-xs font-medium text-neutral-300 line-clamp-1">{issue.title}</p>
            <div className="flex items-center gap-1.5">
              <StatusBadge status={issue.status} />
              <span className="text-[11px] text-neutral-600">{formatRelative(issue.createdAt)}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ── Composed panel ──────────────────────────────────────────────────────────

export function InsightsPanel() {
  const { isLoadingStats } = useIssues();

  return (
    <aside className="flex flex-col gap-4 w-60 shrink-0">
      <div className="rounded-lg bg-neutral-900 ring-1 ring-neutral-800 px-4 py-4 flex flex-col gap-5">
        {isLoadingStats ? (
          <div className="flex items-center gap-2 text-xs text-neutral-600 py-2">
            <Spinner size="sm" className="border-neutral-700 border-t-neutral-500" /> Loading…
          </div>
        ) : (
          <>
            <StatusBreakdown />
            <div className="border-t border-neutral-800" />
            <PriorityDistribution />
          </>
        )}
      </div>
      <div className="rounded-lg bg-neutral-900 ring-1 ring-neutral-800 px-4 py-4">
        <RecentActivity />
      </div>
    </aside>
  );
}
