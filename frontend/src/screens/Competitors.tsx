import { useEffect, useMemo, useRef, useState } from 'react';
import { ExternalLink, RefreshCw, Store, AlertTriangle, Clock, Zap, ArrowRight, Sparkles, MapPin, MoreVertical, Pencil, Trash2 } from 'lucide-react';
import { useRadar } from '@/lib/RadarContext';
import { useNav } from '@/lib/nav';
import { useUi } from '@/lib/UiContext';
import { displayHost, relativeTime } from '@/lib/format';
import {
  competitorAddress,
  competitorDistance,
  countCheckedSince,
  countSignalsSince,
  pickBiggestChange,
  pickComplaint,
  pickTopOpportunity,
} from '@/lib/insights';
import { isThreatening, isFavorable } from '@/lib/semantics';
import { StatusBadge } from '@/components/Badges';
import { EmptyState, ErrorState, Skeleton } from '@/components/States';
import { ScanNotice } from '@/components/ScanNotice';
import { SectionHeader } from '@/components/SectionHeader';
import { LocationContext } from '@/components/LocationContext';
import { RescanAllModal } from '@/components/RescanAllModal';
import { EditCompetitorModal } from '@/components/EditCompetitorModal';
import { RemoveCompetitorModal } from '@/components/RemoveCompetitorModal';
import type { Competitor, SignalWithCompetitor } from '@/lib/types';

function CompetitorCard({
  competitor,
  signals,
  onRescan,
  onEdit,
  onRemove,
}: {
  competitor: Competitor;
  signals: SignalWithCompetitor[];
  onRescan: (id: string) => Promise<void>;
  onEdit: (competitor: Competitor) => void;
  onRemove: (competitor: Competitor) => void;
}) {
  const { scanStates, clearScanState } = useRadar();
  const { openCompetitor } = useUi();
  const [submitting, setSubmitting] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const scan = scanStates[competitor.id];
  const isScanning = competitor.status === 'scanning' || submitting;
  const cannotRemove = competitor.status === 'scanning';
  const distance = competitorDistance(competitor);
  const address = competitorAddress(competitor);
  const complaint = pickComplaint(signals);
  const change = pickBiggestChange(signals);
  const opportunity = pickTopOpportunity(signals);

  useEffect(() => {
    if (!menuOpen) return;
    const onPointer = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setMenuOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('mousedown', onPointer);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('mousedown', onPointer);
      window.removeEventListener('keydown', onKey);
    };
  }, [menuOpen]);

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
      className="hover-lift flex cursor-pointer flex-col rounded-2xl border border-ink-border bg-surface p-5 shadow-soft"
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
            className="mt-1 inline-flex max-w-full items-center gap-1.5 truncate text-sm font-medium text-charcoal hover:text-brand-sage"
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
        <div className="flex shrink-0 items-start gap-2">
          <button
            onClick={handleRescan}
            disabled={isScanning}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-ink-border bg-surface px-3 py-2 text-xs font-semibold text-navy transition-colors duration-220 hover:bg-ink-bg disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isScanning ? 'animate-spin' : ''}`} />
            {isScanning ? 'Scanning…' : 'Re-scan'}
          </button>
          <div ref={menuRef} className="relative">
            <button
              type="button"
              aria-label="Competitor actions"
              aria-haspopup="menu"
              aria-expanded={menuOpen}
              onClick={(e) => {
                e.stopPropagation();
                setMenuOpen((open) => !open);
              }}
              className="inline-flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-xl border border-ink-border bg-surface text-navy transition-colors duration-220 hover:bg-ink-bg"
            >
              <MoreVertical className="h-4 w-4" />
            </button>
            {menuOpen && (
              <div
                role="menu"
                onClick={(e) => e.stopPropagation()}
                className="absolute right-0 z-20 mt-1.5 w-48 overflow-hidden rounded-xl border border-ink-border bg-surface py-1 shadow-soft"
              >
                <button
                  type="button"
                  role="menuitem"
                  onClick={(e) => {
                    e.stopPropagation();
                    setMenuOpen(false);
                    onEdit(competitor);
                  }}
                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-navy transition-colors duration-220 hover:bg-ink-bg"
                >
                  <Pencil className="h-3.5 w-3.5 text-muted" />
                  Edit competitor
                </button>
                <button
                  type="button"
                  role="menuitem"
                  disabled={cannotRemove}
                  title={
                    cannotRemove
                      ? 'Wait for the current scan to finish before removing this competitor.'
                      : undefined
                  }
                  aria-disabled={cannotRemove}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (cannotRemove) return;
                    setMenuOpen(false);
                    onRemove(competitor);
                  }}
                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-semantic-threat transition-colors duration-220 hover:bg-semantic-threatBg disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Remove competitor
                </button>
              </div>
            )}
          </div>
        </div>
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
        <div
          className={`mt-3 rounded-xl border p-3 ${
            isThreatening(change.category, change.impact)
              ? 'border-semantic-threatBorder bg-semantic-threatBg'
              : isFavorable(change.category)
                ? 'border-semantic-opportunityBorder bg-semantic-opportunityBg'
                : 'border-semantic-warningBorder bg-semantic-warningBg'
          }`}
        >
          <p
            className={`flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider ${
              isThreatening(change.category, change.impact)
                ? 'text-semantic-threat'
                : isFavorable(change.category)
                  ? 'text-semantic-opportunity'
                  : 'text-brand-dusty'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5" /> Recent change
          </p>
          <p className="mt-1 line-clamp-2 text-sm text-charcoal">{change.title}</p>
        </div>
      )}

      {opportunity && opportunity.id !== change?.id && opportunity.id !== complaint?.id && (
        <div className="mt-3 rounded-xl border border-semantic-opportunityBorder bg-semantic-opportunityBg p-3">
          <p className="text-[11px] font-bold uppercase tracking-wider text-semantic-opportunity">
            Your next move
          </p>
          <p className="mt-1 line-clamp-2 text-sm text-navy">{opportunity.recommended_action}</p>
        </div>
      )}

      {signals.length === 0 && (
        <p className="mt-3 text-sm text-muted">No signals yet. Open details or run a scan.</p>
      )}

      <div className="mt-auto pt-4">
        <div className="flex items-center justify-between border-t border-ink-border pb-2 text-xs text-muted">
          <span className="relative -bottom-3 inline-flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {relativeTime(competitor.last_checked_at)}
          </span>
          <span className="relative -bottom-3 inline-flex items-center gap-1 font-semibold text-navy">
            <Zap className="h-3.5 w-3.5" />
            {signals.length} signal{signals.length === 1 ? '' : 's'}
            <ArrowRight className="h-3.5 w-3.5 text-charcoal" />
          </span>
        </div>
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
  const {
    business,
    competitors,
    signals,
    loading,
    error,
    startRescan,
    addScan,
    clearAddScan,
    rescanAll,
    rescanAllCooldown,
    startRescanAll,
    clearRescanAll,
    refreshWatchlist,
    watchScan,
  } = useRadar();
  const { navigate } = useNav();

  const [rescanAllError, setRescanAllError] = useState<string | null>(null);
  const [rescanModalOpen, setRescanModalOpen] = useState(false);
  const [startingRescanAll, setStartingRescanAll] = useState(false);
  const submittingRescanAll = useRef(false);
  const [editingCompetitor, setEditingCompetitor] = useState<Competitor | null>(null);
  const [removingCompetitor, setRemovingCompetitor] = useState<Competitor | null>(null);

  const batchBusy = startingRescanAll || rescanAll?.phase === 'running';

  useEffect(() => {
    if (rescanAll?.phase === 'running') {
      setRescanModalOpen(true);
    }
  }, [rescanAll?.phase]);

  const handleRescanAll = async () => {
    if (submittingRescanAll.current || batchBusy || rescanAllCooldown) return;
    submittingRescanAll.current = true;
    setStartingRescanAll(true);
    setRescanAllError(null);
    try {
      await startRescanAll();
      setRescanModalOpen(true);
    } catch (err) {
      setRescanAllError(
        err instanceof Error ? err.message : 'We could not start the scan. Please try again.',
      );
    } finally {
      submittingRescanAll.current = false;
      setStartingRescanAll(false);
    }
  };

  const progress = useMemo(() => {
    if (!rescanAll) return null;
    return {
      completed: Math.min(
        countCheckedSince(competitors, rescanAll.startedAtMs),
        rescanAll.queuedCount,
      ),
      newSignals: countSignalsSince(signals, rescanAll.startedAtMs),
      currentlyChecking: competitors.find((c) => c.status === 'scanning')?.name ?? null,
    };
  }, [rescanAll, competitors, signals]);

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
        title="Mirror, mirror, on the wall… who’s making the biggest move of them all?"
        description="Track the local businesses competing for the same customers, see what they’re changing, and spot the moves that matter most."
        action={
          competitors.length > 0 ? (
            <button
              onClick={() => void handleRescanAll()}
              disabled={batchBusy || rescanAllCooldown || !business}
              className="inline-flex items-center gap-1.5 rounded-xl border border-ink-border bg-surface px-3.5 py-2 text-sm font-semibold text-navy shadow-soft transition-colors duration-220 hover:bg-ink-bg disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${batchBusy ? 'animate-spin' : ''}`} />
              {batchBusy ? 'Scanning…' : rescanAllCooldown ? 'Recently scanned' : 'Re-scan all'}
            </button>
          ) : undefined
        }
      />

      {rescanAllError && (
        <ScanNotice
          phase="error"
          message={rescanAllError}
          onDismiss={() => setRescanAllError(null)}
        />
      )}

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
              className="hover-lift rounded-xl bg-navy px-4 py-2.5 text-sm font-semibold text-surface shadow-soft"
            >
              Add competitor
            </button>
          }
        />
      ) : (
        <div className="grid gap-5 md:grid-cols-2">
          {competitors.map((c, i) => (
            <div key={c.id} className={`animate-rise stagger-${Math.min(i + 1, 6)}`}>
              <CompetitorCard
                competitor={c}
                signals={byCompetitor.get(c.id) ?? []}
                onRescan={startRescan}
                onEdit={setEditingCompetitor}
                onRemove={setRemovingCompetitor}
              />
            </div>
          ))}
        </div>
      )}

      {rescanAll && progress && (
        <RescanAllModal
          isOpen={rescanModalOpen}
          phase={rescanAll.phase}
          completed={progress.completed}
          queued={rescanAll.queuedCount}
          currentlyChecking={progress.currentlyChecking}
          newSignals={progress.newSignals}
          onClose={() => setRescanModalOpen(false)}
          onDone={() => {
            setRescanModalOpen(false);
            clearRescanAll();
          }}
          onViewSignals={() => {
            setRescanModalOpen(false);
            clearRescanAll();
            navigate('signals');
          }}
        />
      )}
      {editingCompetitor && (
        <EditCompetitorModal
          competitor={editingCompetitor}
          isOpen
          onClose={() => setEditingCompetitor(null)}
          onSaved={async (result) => {
            setEditingCompetitor(null);
            await refreshWatchlist();
            if (result.fresh_baseline_started) {
              watchScan(result.competitor_id, { freshBaseline: true });
            }
          }}
        />
      )}
      {removingCompetitor && (
        <RemoveCompetitorModal
          competitor={removingCompetitor}
          isOpen
          onClose={() => setRemovingCompetitor(null)}
          onRemoved={async () => {
            setRemovingCompetitor(null);
            await refreshWatchlist();
          }}
        />
      )}
    </div>
  );
}
