import { useEffect } from 'react';
import { X, ExternalLink, RefreshCw, MapPin } from 'lucide-react';
import { useRadar } from '@/lib/RadarContext';
import { useUi } from '@/lib/UiContext';
import { displayHost, relativeTime, IMPACT_RANK } from '@/lib/format';
import { competitorAddress, competitorDistance, signalsForCompetitor } from '@/lib/insights';
import { StatusBadge, CategoryBadge, ImpactBadge, SignalTypeBadge } from '@/components/Badges';
import { ScanNotice } from '@/components/ScanNotice';
import type { SignalWithCompetitor } from '@/lib/types';

function BriefLabel({ children }: { children: string }) {
  return (
    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">{children}</p>
  );
}

function SignalBrief({ signal }: { signal: SignalWithCompetitor }) {
  const findingLabel = signal.signal_type === 'change' ? 'What changed' : 'What we found';
  const evidenceBlock = signal.evidence ? (
    <>
      <blockquote className="font-serif text-sm italic leading-relaxed text-muted">
        “{signal.evidence}”
      </blockquote>
      {signal.source_url && (
        <span className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-brand-sage">
          View source
          <ExternalLink className="h-3 w-3" />
        </span>
      )}
    </>
  ) : null;

  return (
    <article>
      <div className="flex w-full flex-wrap items-center gap-2">
        <SignalTypeBadge type={signal.signal_type} />
        <CategoryBadge category={signal.category} />
        <ImpactBadge impact={signal.impact} />
        <span className="ml-auto text-sm text-muted">{relativeTime(signal.created_at)}</span>
      </div>

      <h3 className="mt-3 font-serif text-xl font-semibold leading-snug tracking-tight text-charcoal">
        {signal.title}
      </h3>

      <div className="mt-5 space-y-5">
        <div>
          <BriefLabel>{findingLabel}</BriefLabel>
          <p className="mt-1.5 text-sm leading-relaxed text-charcoal">{signal.finding}</p>
        </div>

        <div>
          <BriefLabel>Why it matters</BriefLabel>
          <p className="mt-1.5 text-sm leading-relaxed text-charcoal">{signal.why_it_matters}</p>
        </div>

        <div className="rounded-xl border-l-2 border-brand-sage bg-semantic-opportunityBg/70 px-4 py-3">
          <BriefLabel>Your next move</BriefLabel>
          <p className="mt-1.5 text-sm font-semibold leading-relaxed text-charcoal">
            {signal.recommended_action}
          </p>
        </div>

        {signal.evidence && (
          <div>
            <BriefLabel>Evidence</BriefLabel>
            <div className="mt-1.5">
              {signal.source_url ? (
                <a
                  href={signal.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Opens in a new tab"
                  className="group block rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-sage/30"
                  aria-label="View source (opens in a new tab)"
                >
                  {evidenceBlock}
                </a>
              ) : (
                evidenceBlock
              )}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}

export function CompetitorDrawer() {
  const { selectedCompetitorId, closeCompetitor } = useUi();
  const { competitors, signals, startRescan, scanStates, clearScanState } = useRadar();

  const competitor = competitors.find((c) => c.id === selectedCompetitorId) ?? null;
  const theirs = competitor ? signalsForCompetitor(signals, competitor.id) : [];
  const ordered = theirs.slice().sort((a, b) => {
    const rank = IMPACT_RANK[a.impact] - IMPACT_RANK[b.impact];
    if (rank !== 0) return rank;
    return b.created_at.localeCompare(a.created_at);
  });
  const distance = competitor ? competitorDistance(competitor) : null;
  const address = competitor ? competitorAddress(competitor) : null;
  const scan = competitor ? scanStates[competitor.id] : undefined;

  useEffect(() => {
    if (!selectedCompetitorId) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeCompetitor();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [selectedCompetitorId, closeCompetitor]);

  if (!competitor) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-surface animate-fade"
      role="dialog"
      aria-modal="true"
      aria-labelledby="competitor-detail-title"
    >
      <div className="sticky top-0 z-20 bg-surface/95 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-5 py-5 sm:px-8 sm:py-6">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-muted">
                A closer look in the mirror
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-2.5">
                <h2
                  id="competitor-detail-title"
                  className="font-serif text-2xl font-semibold leading-snug tracking-tight text-charcoal sm:text-3xl"
                >
                  {competitor.name}
                </h2>
                <StatusBadge status={competitor.status} />
              </div>
              <a
                href={competitor.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-charcoal hover:text-brand-sage"
              >
                {displayHost(competitor.url)}
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
              {(address || distance) && (
                <p className="mt-1 flex items-center gap-1 text-xs text-muted">
                  <MapPin className="h-3 w-3 shrink-0" />
                  {address}
                  {address && distance ? ' · ' : ''}
                  {distance}
                </p>
              )}
            </div>
            <button
              onClick={closeCompetitor}
              className="rounded-lg p-2 text-muted transition hover:bg-charcoal-50 hover:text-charcoal"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="border-t border-ink-border" />

        <div className="mx-auto max-w-7xl px-5 py-4 sm:px-8">
          <div className="flex flex-wrap items-end gap-x-8 gap-y-4">
            <div>
              <BriefLabel>Last checked</BriefLabel>
              <p className="mt-0.5 text-sm font-semibold text-charcoal">
                {relativeTime(competitor.last_checked_at)}
              </p>
            </div>
            <div>
              <BriefLabel>Pages watched</BriefLabel>
              <p className="mt-0.5 text-sm font-semibold text-charcoal">{competitor.page_urls.length}</p>
            </div>
            <div>
              <BriefLabel>Signals</BriefLabel>
              <p className="mt-0.5 text-sm font-semibold text-charcoal">{theirs.length}</p>
            </div>
            <button
              onClick={() => void startRescan(competitor.id)}
              disabled={competitor.status === 'scanning'}
              className="inline-flex items-center gap-2 rounded-xl bg-charcoal px-4 py-2 text-sm font-semibold text-surface transition-colors duration-220 hover:bg-charcoal-600 disabled:opacity-50 sm:ml-auto"
            >
              <RefreshCw className={`h-4 w-4 ${competitor.status === 'scanning' ? 'animate-spin' : ''}`} />
              {competitor.status === 'scanning' ? 'Scanning…' : 'Re-scan now'}
            </button>
          </div>

          {competitor.status === 'error' && competitor.last_error && (
            <p className="mt-4 rounded-xl border border-semantic-threatBorder bg-semantic-threatBg px-3 py-2 text-sm text-semantic-threat">
              {competitor.last_error}
            </p>
          )}
          {scan && (
            <div className="mt-4">
              <ScanNotice
                phase={scan.phase}
                message={scan.message}
                onDismiss={scan.phase === 'scanning' ? undefined : () => clearScanState(competitor.id)}
              />
            </div>
          )}
        </div>

        <div className="border-b border-ink-border" />
      </div>

      <div className="px-5 pb-10 pt-8 sm:px-8">
        <div className="mx-auto max-w-5xl">
          <h3 className="font-serif text-lg font-semibold tracking-tight text-charcoal">
            Competitive intelligence
          </h3>

          {ordered.length === 0 ? (
            <p className="mt-6 text-sm leading-relaxed text-muted">
              No competitive signals yet. Run a scan to establish the latest baseline.
            </p>
          ) : (
            <div className="mt-6 divide-y divide-ink-border">
              {ordered.map((signal) => (
                <div key={signal.id} className="py-8 first:pt-0 last:pb-2">
                  <SignalBrief signal={signal} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
