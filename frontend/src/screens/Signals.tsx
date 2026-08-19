import { useMemo, useState } from 'react';
import { Zap, Quote } from 'lucide-react';
import { useRadar } from '@/lib/RadarContext';
import { useNav } from '@/lib/nav';
import {
  relativeTime,
  CATEGORY_LABELS,
  CATEGORY_VALUES,
  IMPACT_VALUES,
  IMPACT_LABELS,
} from '@/lib/format';
import { ImpactBadge, SignalTypeBadge } from '@/components/Badges';
import { EmptyState, ErrorState, Skeleton } from '@/components/States';
import type { Impact, Category, SignalWithCompetitor } from '@/lib/types';

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1 text-[11px] font-semibold uppercase tracking-[0.1em] text-navy-400">
      {label}
      {children}
    </label>
  );
}

const selectClass =
  'rounded-[10px] border border-ink-border bg-white px-3 py-2 text-sm font-normal text-navy focus:border-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-blue/15';

function SignalCard({ signal }: { signal: SignalWithCompetitor }) {
  const findingLabel = signal.signal_type === 'baseline' ? 'What we found' : 'What changed';
  return (
    <article className="overflow-hidden rounded-[14px] border border-ink-border bg-white transition hover:border-navy-200">
      <div className="p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-semibold text-navy">
            {signal.competitors?.name ?? 'Unknown competitor'}
          </span>
          <SignalTypeBadge type={signal.signal_type} />
          <ImpactBadge impact={signal.impact} />
          <span className="rounded-full bg-navy-50 px-2.5 py-0.5 text-xs font-medium text-navy-500">
            {CATEGORY_LABELS[signal.category]}
          </span>
          <span className="ml-auto text-xs text-navy-200">{relativeTime(signal.created_at)}</span>
        </div>

        <h3 className="mt-3 text-lg font-bold leading-snug tracking-tight text-navy">
          {signal.title}
        </h3>

        <div className="mt-5 space-y-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-navy-200">
              {findingLabel}
            </p>
            <p className="mt-1 text-sm leading-relaxed text-navy-500">{signal.finding}</p>
          </div>

          <div className="border-t border-ink-border pt-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-navy-200">
              Why it matters
            </p>
            <p className="mt-1 text-sm leading-relaxed text-navy-500">{signal.why_it_matters}</p>
          </div>

          <div className="rounded-[12px] border-l-[3px] border-brand-blue bg-brand-blue/[0.06] p-4">
            <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-brand-blue">
              Do this
            </p>
            <p className="mt-1 text-[15px] font-semibold leading-relaxed text-navy">
              {signal.recommended_action}
            </p>
          </div>

          {signal.evidence && (
            <div>
              <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-navy-200">
                <Quote className="h-3.5 w-3.5" /> From their page
              </p>
              <blockquote className="mt-1.5 border-l-2 border-ink-border bg-navy-50/50 py-2 pl-3 pr-2 font-serif text-[13px] italic leading-relaxed text-navy-400">
                {signal.evidence}
              </blockquote>
            </div>
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
      <div>
        <h1 className="text-[28px] font-bold tracking-tight text-navy">Signals</h1>
        <p className="mt-1.5 text-sm text-navy-400">
          Every change we found, newest first, each with something to do about it.
        </p>
      </div>

      {hasAnySignals && (
        <div className="flex flex-wrap gap-3 rounded-[12px] border border-ink-border bg-white p-4">
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
        <div className="space-y-4">
          {filtered.map((s) => (
            <SignalCard key={s.id} signal={s} />
          ))}
        </div>
      )}
    </div>
  );
}
