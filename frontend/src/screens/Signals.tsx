import { useMemo, useState } from 'react';
import { Zap, Quote, Lightbulb, AlertTriangle, Sparkles } from 'lucide-react';
import { useRadar } from '@/lib/RadarContext';
import { useNav } from '@/lib/nav';
import {
  relativeTime,
  CATEGORY_LABELS,
  CATEGORY_VALUES,
  IMPACT_VALUES,
  IMPACT_LABELS,
} from '@/lib/format';
import { ImpactBadge, SignalTypeBadge, CategoryBadge } from '@/components/Badges';
import { EmptyState, ErrorState, Skeleton } from '@/components/States';
import { SectionHeader } from '@/components/SectionHeader';
import { InsightPanel } from '@/components/InsightPanel';
import { findingTone, whyTone, isThreatening, isFavorable } from '@/lib/semantics';
import type { Impact, Category, SignalWithCompetitor } from '@/lib/types';

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
      {label}
      {children}
    </label>
  );
}

const selectClass =
  'rounded-[10px] border border-ink-border bg-ink-bg px-3 py-2 text-sm font-normal text-charcoal focus:border-brand-sage focus:outline-none focus:ring-2 focus:ring-brand-sage/20';

function SignalCard({ signal }: { signal: SignalWithCompetitor }) {
  const isChange = signal.signal_type === 'change';
  const findingLabel = isChange ? 'What changed' : 'What we found';
  const threatening = isThreatening(signal.category, signal.impact);
  const favorable = isFavorable(signal.category);

  return (
    <article
      className={`hover-lift overflow-hidden rounded-2xl border bg-surface shadow-soft ${
        threatening
          ? 'border-semantic-threatBorder'
          : isChange
            ? 'border-semantic-warningBorder'
            : 'border-ink-border'
      }`}
    >
      {threatening && <div className="h-[2px] bg-brand-clay" />}
      {isChange && !threatening && (
        <div className={`h-[2px] ${favorable ? 'bg-brand-sage' : 'bg-brand-dusty'}`} />
      )}
      <div className="p-5 sm:p-7">
        <h3 className="font-serif text-lg font-semibold leading-snug tracking-tight text-charcoal">
          {signal.title}
        </h3>

        <div className="mt-3 flex flex-wrap items-center gap-2 border-b border-ink-border pb-4">
          <span className="text-sm font-semibold text-charcoal">
            {signal.competitors?.name ?? 'Unknown competitor'}
          </span>
          <SignalTypeBadge type={signal.signal_type} />
          <ImpactBadge impact={signal.impact} />
          <CategoryBadge category={signal.category} />
          <span className="ml-auto text-sm text-muted">{relativeTime(signal.created_at)}</span>
        </div>

        <div className="mt-5 space-y-3.5">
          <InsightPanel
            tone={findingTone(signal.category, isChange, signal.impact)}
            label={findingLabel}
            icon={isChange ? <Sparkles className="h-3.5 w-3.5" /> : undefined}
          >
            <p className="text-sm leading-relaxed text-charcoal">{signal.finding}</p>
          </InsightPanel>

          <InsightPanel
            tone={whyTone(signal.category)}
            label="Why it matters"
            icon={
              signal.category === 'reputation' || signal.category === 'hours' ? (
                <AlertTriangle className="h-3.5 w-3.5" />
              ) : (
                <Lightbulb className="h-3.5 w-3.5" />
              )
            }
          >
            <p className="text-sm leading-relaxed text-charcoal">{signal.why_it_matters}</p>
          </InsightPanel>

          <InsightPanel tone="action" label="Do this">
            <p className="text-sm font-semibold leading-relaxed text-charcoal">
              {signal.recommended_action}
            </p>
          </InsightPanel>

          {signal.evidence && (
            <InsightPanel
              tone="evidence"
              label="From their page"
              icon={<Quote className="h-3.5 w-3.5" />}
            >
              <blockquote className="font-serif text-sm italic leading-relaxed text-muted">
                {signal.evidence}
              </blockquote>
            </InsightPanel>
          )}
        </div>
      </div>
    </article>
  );
}

export function Signals() {
  const { signals, competitors, loading, error } = useRadar();
  const { signalsFilters } = useNav();

  const [impact, setImpact] = useState<Impact | 'all'>('all');
  const [category, setCategory] = useState<Category | 'all'>('all');
  const [competitorId, setCompetitorId] = useState<string>(signalsFilters.competitorId ?? 'all');

  const filtered = useMemo(
    () =>
      signals.filter((s) => {
        if (impact !== 'all' && s.impact !== impact) return false;
        if (category !== 'all' && s.category !== category) return false;
        if (competitorId !== 'all' && s.competitor_id !== competitorId) return false;
        return true;
      }),
    [signals, impact, category, competitorId],
  );

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-64" />
        <Skeleton className="h-64" />
      </div>
    );
  }

  if (error) return <ErrorState message={error} />;

  const hasAnySignals = signals.length > 0;

  return (
    <div className="space-y-8">
      <SectionHeader
        as="h1"
        eyebrow="Intelligence"
        title="Changes in the reflection"
        description="The pricing, menu, promotion, and positioning changes worth paying attention to."
      />

      {hasAnySignals && (
        <div className="flex flex-wrap gap-4 rounded-2xl border border-ink-border bg-surface p-4 shadow-soft sm:p-5">
          <Field label="Impact">
            <select
              className={selectClass}
              value={impact}
              onChange={(e) => setImpact(e.target.value as Impact | 'all')}
            >
              <option value="all">All impact</option>
              {IMPACT_VALUES.map((v) => (
                <option key={v} value={v}>
                  {IMPACT_LABELS[v]}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Category">
            <select
              className={selectClass}
              value={category}
              onChange={(e) => setCategory(e.target.value as Category | 'all')}
            >
              <option value="all">All categories</option>
              {CATEGORY_VALUES.map((v) => (
                <option key={v} value={v}>
                  {CATEGORY_LABELS[v]}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Competitor">
            <select
              className={selectClass}
              value={competitorId}
              onChange={(e) => setCompetitorId(e.target.value)}
            >
              <option value="all">All competitors</option>
              {competitors.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </Field>
        </div>
      )}

      {!hasAnySignals ? (
        <EmptyState
          icon={<Zap className="h-6 w-6" />}
          title="No signals yet"
          description="Once a scan finishes, every price change, new promotion and menu update we find will appear here as a card with a recommended action."
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<Zap className="h-6 w-6" />}
          title="Nothing matches these filters"
          description="Try widening your filters to see more of what your competitors are doing."
        />
      ) : (
        <div className="space-y-5">
          {filtered.map((s, i) => (
            <div key={s.id} className={`animate-rise stagger-${Math.min(i + 1, 6)}`}>
              <SignalCard signal={s} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
