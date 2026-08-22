import { useEffect } from 'react';
import {
  X,
  ExternalLink,
  RefreshCw,
  Sparkles,
  AlertTriangle,
  DollarSign,
  ListChecks,
  Clock,
  Radar,
} from 'lucide-react';
import { useRadar } from '@/lib/RadarContext';
import { useUi } from '@/lib/UiContext';
import { displayHost, relativeTime, CATEGORY_LABELS } from '@/lib/format';
import {
  competitorAddress,
  competitorDistance,
  pickComplaint,
  PRICING_MENU_CATEGORIES,
  signalsForCompetitor,
  WEAKNESS_CATEGORIES,
} from '@/lib/insights';
import { StatusBadge, CategoryBadge, ImpactBadge, SignalTypeBadge } from '@/components/Badges';
import { InsightPanel } from '@/components/InsightPanel';
import { ScanNotice } from '@/components/ScanNotice';
import type { SignalWithCompetitor } from '@/lib/types';

function MiniSignal({ signal }: { signal: SignalWithCompetitor }) {
  return (
    <div className="rounded-xl border border-ink-border bg-ink-bg p-3.5">
      <div className="flex flex-wrap items-center gap-2">
        <SignalTypeBadge type={signal.signal_type} />
        <CategoryBadge category={signal.category} />
        <ImpactBadge impact={signal.impact} />
        <span className="ml-auto text-[11px] text-muted">{relativeTime(signal.created_at)}</span>
      </div>
      <p className="mt-2 text-sm font-semibold text-navy">{signal.title}</p>
      <p className="mt-1 line-clamp-3 text-sm leading-relaxed text-muted">{signal.finding}</p>
    </div>
  );
}

export function CompetitorDrawer() {
  const { selectedCompetitorId, closeCompetitor } = useUi();
  const { competitors, signals, startRescan, scanStates, clearScanState } = useRadar();

  const competitor = competitors.find((c) => c.id === selectedCompetitorId) ?? null;
  const theirs = competitor ? signalsForCompetitor(signals, competitor.id) : [];
  const findings = theirs
    .filter((s) => !WEAKNESS_CATEGORIES.includes(s.category))
    .slice(0, 4);  const pricingMenu = theirs.filter((s) => PRICING_MENU_CATEGORIES.includes(s.category));
  const weaknesses = theirs.filter((s) => WEAKNESS_CATEGORIES.includes(s.category));
  const changes = theirs.filter((s) => s.signal_type === 'change');
  const actions = theirs.filter((s) => s.recommended_action).slice(0, 4);
  const complaint = pickComplaint(theirs);
  const distance = competitor ? competitorDistance(competitor) : null;
  const address = competitor ? competitorAddress(competitor) : null;
  const scan = competitor ? scanStates[competitor.id] : undefined;

  useEffect(() => {
    if (!selectedCompetitorId) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeCompetitor();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selectedCompetitorId, closeCompetitor]);

  if (!competitor) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-charcoal/25 animate-fade">
      <button className="absolute inset-0 cursor-default" aria-label="Close details" onClick={closeCompetitor} />
      <aside className="relative z-10 flex h-full w-full max-w-xl flex-col overflow-y-auto border-l border-ink-border bg-surface shadow-lift animate-drawer-in">
        <div className="sticky top-0 z-20 flex items-start justify-between gap-3 border-b border-ink-border bg-surface/95 px-5 py-4 backdrop-blur-md">
          <div className="min-w-0">
            <h2 className="font-serif text-lg font-semibold leading-snug tracking-tight text-charcoal">
              A closer look in the mirror
            </h2>
            <div className="mt-1 flex flex-wrap items-center gap-2">
              <p className="text-base font-semibold tracking-tight text-charcoal">{competitor.name}</p>
              <StatusBadge status={competitor.status} />
            </div>
            <a
              href={competitor.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 inline-flex items-center gap-1 text-sm font-medium text-charcoal hover:text-brand-sage"
            >
              {displayHost(competitor.url)}
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
            {(address || distance) && (
              <p className="mt-1 text-xs text-muted">
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

        <div className="space-y-5 p-5">
          <InsightPanel tone="finding" label="Overview / scan status" icon={<Radar className="h-3.5 w-3.5" />}>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">Last checked</p>
                <p className="mt-0.5 font-semibold text-navy">{relativeTime(competitor.last_checked_at)}</p>
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">Signals</p>
                <p className="mt-0.5 font-semibold text-navy">{theirs.length}</p>
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">Pages watched</p>
                <p className="mt-0.5 font-semibold text-navy">{competitor.page_urls.length}</p>
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">Status</p>
                <p className="mt-0.5 font-semibold text-navy">{competitor.status}</p>
              </div>
            </div>
            {competitor.status === 'error' && competitor.last_error && (
              <p className="mt-3 rounded-lg border border-semantic-threatBorder bg-semantic-threatBg px-3 py-2 text-sm text-semantic-threat">
                {competitor.last_error}
              </p>
            )}
            <button
              onClick={() => void startRescan(competitor.id)}
              disabled={competitor.status === 'scanning'}
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-charcoal px-4 py-2 text-sm font-semibold text-surface transition-colors duration-220 hover:bg-charcoal-600 disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${competitor.status === 'scanning' ? 'animate-spin' : ''}`} />
              {competitor.status === 'scanning' ? 'Scanning…' : 'Re-scan now'}
            </button>
            {scan && (
              <div className="mt-3">
                <ScanNotice
                  phase={scan.phase}
                  message={scan.message}
                  onDismiss={scan.phase === 'scanning' ? undefined : () => clearScanState(competitor.id)}
                />
              </div>
            )}
          </InsightPanel>

          {findings.length > 0 && (
            <InsightPanel tone="change" label="Top competitive findings" icon={<Sparkles className="h-3.5 w-3.5" />}>
              <div className="space-y-2.5">
                {findings.map((s) => (
                  <MiniSignal key={s.id} signal={s} />
                ))}
              </div>
            </InsightPanel>
          )}

          {pricingMenu.length > 0 && (
            <InsightPanel tone="pricing" label="Pricing & offerings" icon={<DollarSign className="h-3.5 w-3.5" />}>
              <div className="space-y-2.5">
                {pricingMenu.map((s) => (
                  <MiniSignal key={s.id} signal={s} />
                ))}
              </div>
            </InsightPanel>
          )}

          {(weaknesses.length > 0 || complaint) && (
            <InsightPanel
              tone="threat"
              label="Customer / reputation weaknesses"
              icon={<AlertTriangle className="h-3.5 w-3.5" />}
            >
              <div className="space-y-2.5">
                {(weaknesses.length > 0 ? weaknesses : complaint ? [complaint] : []).map((s) => (
                  <MiniSignal key={s.id} signal={s} />
                ))}
              </div>
            </InsightPanel>
          )}

          {actions.length > 0 && (
            <InsightPanel tone="action" label="Your next move" icon={<ListChecks className="h-3.5 w-3.5" />}>
              <div className="space-y-3">
                {actions.map((s) => (
                  <div key={s.id}>
                    <p className="text-xs font-medium text-muted">
                      {CATEGORY_LABELS[s.category]} · {s.title}
                    </p>
                    <p className="mt-1 text-sm font-semibold leading-relaxed text-navy">
                      {s.recommended_action}
                    </p>
                  </div>
                ))}
              </div>
            </InsightPanel>
          )}

          {changes.length > 0 && (
            <InsightPanel tone="change" label="Recent changes" icon={<Clock className="h-3.5 w-3.5" />}>
              <div className="space-y-2.5">
                {changes.map((s) => (
                  <MiniSignal key={s.id} signal={s} />
                ))}
              </div>
            </InsightPanel>
          )}

          {theirs.length === 0 && (
            <p className="text-sm text-muted">
              No signals yet for this competitor. Run a scan to populate findings.
            </p>
          )}
        </div>
      </aside>
    </div>
  );
}
