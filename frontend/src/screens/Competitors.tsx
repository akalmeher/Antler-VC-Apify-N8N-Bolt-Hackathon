import { useMemo, useState } from 'react';
import { ExternalLink, RefreshCw, Store, AlertTriangle } from 'lucide-react';
import { useRadar } from '@/lib/RadarContext';
import { useNav } from '@/lib/nav';
import { relativeTime } from '@/lib/format';
import { StatusBadge } from '@/components/Badges';
import { EmptyState, ErrorState, Skeleton } from '@/components/States';
import { ScanNotice } from '@/components/ScanNotice';
import type { Competitor } from '@/lib/types';

function CompetitorRow({
  competitor,
  signalCount,
  onRescan,
}: {
  competitor: Competitor;
  signalCount: number;
  onRescan: (id: string) => Promise<void>;
}) {
  const { scanStates, clearScanState } = useRadar();
  const { navigate } = useNav();
  const [submitting, setSubmitting] = useState(false);
  const scan = scanStates[competitor.id];
  const isScanning = competitor.status === 'scanning' || submitting;

  const handleRescan = async () => {
    setSubmitting(true);
    try {
      await onRescan(competitor.id);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="rounded-[12px] border border-ink-border bg-white p-4 sm:p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-semibold text-navy">{competitor.name}</h3>
            <StatusBadge status={competitor.status} />
          </div>
          <a
            href={competitor.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 inline-flex max-w-full items-center gap-1 truncate text-sm text-brand-blue hover:text-brand-cyan"
          >
            <span className="truncate">{competitor.url}</span>
            <ExternalLink className="h-3.5 w-3.5 shrink-0" />
          </a>

          {competitor.status === 'error' && competitor.last_error && (
            <div className="mt-2 flex items-start gap-2 rounded-[10px] border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
              <span className="break-words">{competitor.last_error}</span>
            </div>
          )}

          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-navy-400">
            <span>
              Last checked:{' '}
              <span className="text-navy-500">{relativeTime(competitor.last_checked_at)}</span>
            </span>
            <button
              onClick={() => navigate('signals', { competitorId: competitor.id })}
              className="text-navy-500 hover:text-brand-blue"
            >
              {signalCount} signal{signalCount === 1 ? '' : 's'}
            </button>
          </div>
        </div>

        <div className="shrink-0">
          <button
            onClick={handleRescan}
            disabled={isScanning}
            className="inline-flex w-full items-center justify-center gap-2 rounded-[10px] border border-ink-border bg-white px-3.5 py-2 text-sm font-medium text-navy-500 transition hover:border-navy-200 hover:bg-navy-50 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
          >
            <RefreshCw className={`h-4 w-4 ${isScanning ? 'animate-spin' : ''}`} />
            {isScanning ? 'Scanning…' : 'Re-scan now'}
          </button>
        </div>
      </div>

      {scan && (
        <div className="mt-3">
          <ScanNotice
            phase={scan.phase}
            message={scan.message}
            onDismiss={
              scan.phase === 'scanning' ? undefined : () => clearScanState(competitor.id)
            }
          />
        </div>
      )}
    </div>
  );
}

export function Competitors() {
  const { competitors, signals, loading, error, startRescan, addScan, clearAddScan } = useRadar();
  const { navigate } = useNav();

  const counts = useMemo(() => {
    const map = new Map<string, number>();
    for (const s of signals) map.set(s.competitor_id, (map.get(s.competitor_id) ?? 0) + 1);
    return map;
  }, [signals]);

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-28" />
        <Skeleton className="h-28" />
      </div>
    );
  }

  if (error) return <ErrorState message={error} />;

  const showAddBanner = addScan && (!addScan.competitorId || addScan.phase === 'searching');

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-[28px] font-bold tracking-tight text-navy">
          Competitors we're watching
        </h1>
        <p className="mt-1.5 text-sm text-navy-400">
          Restaurants we scan for pricing, menu and promotion changes.
        </p>
      </div>

      {showAddBanner && (
        <ScanNotice
          phase={addScan.phase}
          message={addScan.message}
          onDismiss={addScan.phase === 'searching' ? undefined : clearAddScan}
        />
      )}

      {competitors.length === 0 ? (
        <EmptyState
          icon={<Store className="h-6 w-6" />}
          title="No competitors yet."
          description="Add a competitor and we'll start watching their pages for changes worth acting on."
          action={
            <button
              onClick={() => navigate('add')}
              className="rounded-[10px] bg-brand-blue px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-blue/90"
            >
              Add competitor
            </button>
          }
        />
      ) : (
        <div className="space-y-3">
          {competitors.map((c) => (
            <CompetitorRow
              key={c.id}
              competitor={c}
              signalCount={counts.get(c.id) ?? 0}
              onRescan={startRescan}
            />
          ))}
        </div>
      )}
    </div>
  );
}
