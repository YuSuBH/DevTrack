import { useIssues } from '../context/IssueContext';
import { Spinner } from './ui/Spinner';

interface StatCardProps {
  label: string;
  value: number | string;
  accent: string;
}

function StatCard({ label, value, accent }: StatCardProps) {
  return (
    <div className={`flex flex-col gap-0.5 rounded-lg bg-neutral-900 px-4 py-3 ring-1 ring-neutral-800 border-t-2 ${accent}`}>
      <span className="text-[11px] font-medium uppercase tracking-wide text-neutral-500">{label}</span>
      <span className="text-xl font-semibold text-neutral-100 tabular-nums leading-tight">{value}</span>
    </div>
  );
}

export function DashboardStats() {
  const { stats, isLoadingStats } = useIssues();
  const dash = '—';

  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      {isLoadingStats ? (
        <div className="col-span-full flex items-center gap-2 py-2 text-sm text-neutral-500">
          <Spinner size="sm" /> Loading stats…
        </div>
      ) : (
        <>
          <StatCard label="Total Issues" value={stats?.total      ?? dash} accent="border-t-neutral-600" />
          <StatCard label="Open"         value={stats?.open       ?? dash} accent="border-t-blue-500"    />
          <StatCard label="In Progress"  value={stats?.inProgress ?? dash} accent="border-t-amber-500"   />
          <StatCard label="Closed"       value={stats?.closed     ?? dash} accent="border-t-neutral-500" />
        </>
      )}
    </div>
  );
}
