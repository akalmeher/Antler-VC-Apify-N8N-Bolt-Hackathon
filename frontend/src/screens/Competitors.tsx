import { useMemo, useState } from 'react';
import { ExternalLink, RefreshCw, Store, AlertTriangle, Clock, Zap, ArrowRight, Sparkles, MapPin } from 'lucide-react';
import { useRadar } from '@/lib/RadarContext';
import { useNav } from '@/lib/nav';
import { useUi } from '@/lib/UiContext';
import { displayHost, relativeTime } from '@/lib/format';
import {
  competitorAddress,
  competitorDistance,
  pickBiggestChange,
  pickComplaint,
  pickTopOpportunity,
} from '@/lib/insights';
import { StatusBadge } from '@/components/Badges';
import { EmptyState, ErrorState, Skeleton } from '@/components/States';
import { ScanNotice } from '@/components/ScanNotice';
import { SectionHeader } from '@/components/SectionHeader';
import { LocationContext } from '@/components/LocationContext';
import type { Competitor, SignalWithCompetitor } from '@/lib/types';

function CompetitorCard({
  competitor,
  signals,
  onRescan,
}: {
  competitor: Competitor;
  signals: SignalWithCompetitor[];
  onRescan: (id: string) => Promise<void>;
}) {
  const { scanStates, clearScanState } = useRadar();
  const { openCompetitor } = useUi();
  const [submitting, setSubmitting] = useState(false);
  const scan = scanStates[competitor.id];
  const isScanning = competitor.status === 'scanning' || submitting;
  const distance = competitorDistance(competitor);
  const address = competitorAddress(competitor);
  const complaint = pickComplaint(signals);
  const change = pickBiggestChange(signals);
  const opportunity = pickTopOpportunity(signals);

  const handleRescan = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setSubmitting(true);
    try {
      await onRescan(competitor.id);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <article
      onClick={() => openCompetitor(competitor.id)}
      className="flex cursor-pointer flex-col rounded-2xl border border-ink-border bg-white p-5 transition duration-200 hover:border-brand-blue/35 hover:shadow-[0_12px_32px_-16px_rgba(16,35,52,0.2)]"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base font-bold tracking-tight text-navy">{competitor.name}</h3>
            <StatusBadge status={competitor.status} />
          </div>
          <a
            href={competitor.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="mt-1 inline-flex max-w-full items-center gap-1.5 truncate text-sm font-medium text-brand-blue hover:text-brand-cyan"
          >
            <span className="truncate">{displayHost(competitor.url)}</span>
            <ExternalLink className="h-3.5 w-3.5 shrink-0" />
          </a>
          {(address || distance) && (
            <p className="mt-1 flex items-center gap-1 text-xs text-muted">
              <MapPin className="h-3 w-3" />
              {address}
              {address && distance ? ' · ' : ''}
              {distance}
            </p>
          )}
        </div>
        <button
          onClick={handleRescan}
          disabled={isScanning}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-ink-border bg-white px-3 py-2 text-xs font-semibold text-navy transition hover:bg-navy-50 disabled:opacity-50"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isScanning ? 'animate-spin' : ''}`} />
          {isScanning ? 'Scanning…' : 'Re-scan'}
        </button>
      </div>

      {competitor.status === 'error' && competitor.last_error && (
        <div className="mt-3 flex items-start gap-2 rounded-xl border border-semantic-threatBorder bg-semantic-threatBg px-3 py-2 text-sm text-semantic-threat">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <span className="break-words">{competitor.last_error}</span>
        </div>
      )}

      {complaint && (
        <div className="mt-3 rounded-xl border border-semantic-threatBorder bg-semantic-threatBg p-3">
          <p className="text-[11px] font-bold uppercase tracking-wider text-semantic-threat">
            Reputation weakness
          </p>
          <p className="mt-1 line-clamp-2 text-sm text-navy">{complaint.finding}</p>
        </div>
      )}

      {change && (
        <div className="mt-3 rounded-xl border border-semantic-pricingBorder bg-semantic-pricingBg p-3">
          <p className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-brand-blue">
            <Sparkles className="h-3.5 w-3.5" /> Recent change
          </p>
          <p className="mt-1 line-clamp-2 text-sm text-navy">{change.title}</p>
        </div>
      )}

      {opportunity && opportunity.id !== change?.id && opportunity.id !== complaint?.id && (
        <div className="mt-3 rounded-xl border border-semantic-opportunityBorder bg-semantic-opportunityBg p-3">
          <p className="text-[11px] font-bold uppercase tracking-wider text-semantic-opportunity">
            How to respond
          </p>
          <p className="mt-1 line-clamp-2 text-sm text-navy">{opportunity.recommended_action}</p>
        </div>
      )}

      {signals.length === 0 && (
        <p className="mt-3 text-sm text-muted">No signals yet. Open details or run a scan.</p>
      )}

      <div className="mt-auto flex items-center justify-between border-t border-ink-border pt-3 text-xs text-muted">
        <span className="inline-flex items-center gap-1">
          <Clock className="h-3.5 w-3.5" />
          {relativeTime(competitor.last_checked_at)}
        </span>
        <span className="inline-flex items-center gap-1 font-semibold text-navy">
          <Zap className="h-3.5 w-3.5" />
          {signals.length} signal{signals.length === 1 ? '' : 's'}
          <ArrowRight className="h-3.5 w-3.5 text-brand-blue" />
        </span>
      </div>

      {scan && (
        <div className="mt-3" onClick={(e) => e.stopPropagation()}>
          <ScanNotice
            phase={scan.phase}
            message={scan.message}
            onDismiss={scan.phase === 'scanning' ? undefined : () => clearScanState(competitor.id)}
          />
        </div>
      )}
    </article>
  );
}

export function Competitors() {
  const { business, competitors, signals, loading, error, startRescan, addScan, clearAddScan } =
    useRadar();
  const { navigate } = useNav();

  const byCompetitor = useMemo(() => {
    const map = new Map<string, SignalWithCompetitor[]>();
    for (const s of signals) {
      const list = map.get(s.competitor_id) ?? [];
      list.push(s);
      map.set(s.competitor_id, list);
    }
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
      <SectionHeader
        as="h1"
        eyebrow="Watchlist"
        title="Competitors we're watching"
        description="Restaurants we scan for pricing, menu and promotion changes."
      />

      <LocationContext business={business} competitorCount={competitors.length} />

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
              className="rounded-xl bg-brand-blue px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-blue/90"
            >
              Add competitor
            </button>
          }
        />
      ) : (
        <div className="grid gap-5 md:grid-cols-2">
          {competitors.map((c) => (
            <CompetitorCard
              key={c.id}
              competitor={c}
              signals={byCompetitor.get(c.id) ?? []}
              onRescan={startRescan}
            />
          ))}
        </div>
      )}
    </div>
  );
}
