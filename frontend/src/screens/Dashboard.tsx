import { Store, Zap, Clock, ArrowRight, Radar } from 'lucide-react';
import { useRadar } from '@/lib/RadarContext';
import { useNav } from '@/lib/nav';
import { relativeTime, IMPACT_RANK, CATEGORY_LABELS } from '@/lib/format';
import { ImpactBadge, SignalTypeBadge } from '@/components/Badges';
import { EmptyState, ErrorState, Skeleton } from '@/components/States';
import type { SignalWithCompetitor } from '@/lib/types';

function StatCard({
  icon,
  label,
  value,
  hint,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="rounded-[14px] border border-ink-border bg-white p-5">
      <div className="flex items-center gap-2 text-navy-400">
        <span className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-navy-50 text-navy-500">
          {icon}
        </span>
        <span className="text-[11px] font-semibold uppercase tracking-[0.1em]">{label}</span>
      </div>
      <p className="mt-4 text-3xl font-bold tracking-tight text-navy">{value}</p>
      {hint && <p className="mt-1 text-sm text-navy-400">{hint}</p>}
    </div>
  );
}

function topSignals(signals: SignalWithCompetitor[]): SignalWithCompetitor[] {
  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const recent = signals.filter((s) => new Date(s.created_at).getTime() >= weekAgo);
  const pool = recent.length > 0 ? recent : signals;
  return pool
    .slice()
    .sort((a, b) => {
      const rank = IMPACT_RANK[a.impact] - IMPACT_RANK[b.impact];
      if (rank !== 0) return rank;
      return b.created_at.localeCompare(a.created_at);
    })
    .slice(0, 3);
}

export function Dashboard() {
  const { competitors, signals, loading, error } = useRadar();
  const { navigate } = useNav();

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="grid gap-4 sm:grid-cols-3">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
        <Skeleton className="h-64" />
      </div>
    );
  }

  if (error) return <ErrorState message={error} />;

  const competitorCount = competitors.length;
  const unread = signals.filter((s) => s.is_read === false).length;
  const lastChecked = competitors
    .map((c) => c.last_checked_at)
    .filter((v): v is string => Boolean(v))
    .sort((a, b) => b.localeCompare(a))[0];
  const top = topSignals(signals);

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-[28px] font-bold tracking-tight text-navy">Dashboard</h1>
        <p className="mt-1.5 text-sm text-navy-400">
          What your competitors are doing, and what to do about it.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          icon={<Store className="h-4 w-4" />}
          label="Competitors we're watching"
          value={String(competitorCount)}
        />
        <StatCard icon={<Zap className="h-4 w-4" />} label="New signals" value={String(unread)} />
        <StatCard
          icon={<Clock className="h-4 w-4" />}
          label="Last checked"
          value={lastChecked ? relativeTime(lastChecked) : 'No scans yet'}
        />
      </div>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold tracking-tight text-navy">Top signals</h2>
          {top.length > 0 && (
            <button
              onClick={() => navigate('signals')}
              className="inline-flex items-center gap-1 text-sm font-medium text-brand-blue hover:text-brand-cyan"
            >
              See all signals <ArrowRight className="h-4 w-4" />
            </button>
          )}
        </div>

        {top.length === 0 ? (
          <EmptyState
            icon={<Radar className="h-6 w-6" />}
            title="No signals yet"
            description="Run a scan on a competitor and their pricing and menu changes will show up here."
            action={
              <button
                onClick={() => navigate('competitors')}
                className="rounded-[10px] bg-navy px-4 py-2 text-sm font-semibold text-white transition hover:bg-navy-600"
              >
                Go to competitors
              </button>
            }
          />
        ) : (
          <div className="space-y-3">
            {top.map((s) => (
              <button
                key={s.id}
                onClick={() => navigate('signals')}
                className="group flex w-full items-start justify-between gap-4 rounded-[12px] border border-ink-border bg-white p-4 text-left transition hover:border-navy-200"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-medium text-navy-400">
                      {s.competitors?.name ?? 'Unknown competitor'}
                    </span>
                    <span className="text-ink-border">·</span>
                    <span className="text-sm text-navy-200">{CATEGORY_LABELS[s.category]}</span>
                    <span className="text-ink-border">·</span>
                    <span className="text-sm text-navy-200">{relativeTime(s.created_at)}</span>
                  </div>
                  <p className="mt-1 truncate font-semibold text-navy">{s.title}</p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-2">
                  <ImpactBadge impact={s.impact} />
                  <SignalTypeBadge type={s.signal_type} />
                </div>
              </button>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
