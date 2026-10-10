import { useIssues } from '../context/IssueContext';
import { Spinner } from './ui/Spinner';

function StatCard({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="flex flex-col gap-0.5 rounded-lg bg-neutral-900 px-4 py-3 ring-1 ring-neutral-800">
      <span className="text-[11px] font-medium uppercase tracking-wide text-neutral-500">{label}</span>
      <span className="text-xl font-semibold text-neutral-100 tabular-nums leading-tight">{value}</span>
    </div>
  );
}

export function DashboardStats() {
  const { stats, isLoadingStats } = useIssues();
  const dash = '—';

  return (
    <div className="grid grid-cols-4 gap-2">
      {isLoadingStats ? (
        <div className="col-span-full flex items-center gap-2 py-2 text-sm text-neutral-500">
          <Spinner size="sm" /> Loading stats…
        </div>
      ) : (
        <>
          <StatCard label="Total Issues" value={stats?.total      ?? dash} />
          <StatCard label="Open"         value={stats?.open       ?? dash} />
          <StatCard label="In Progress"  value={stats?.inProgress ?? dash} />
          <StatCard label="Closed"       value={stats?.closed     ?? dash} />
        </>
      )}
    </div>
  );
}
