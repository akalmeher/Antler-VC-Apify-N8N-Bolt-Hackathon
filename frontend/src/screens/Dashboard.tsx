import { Store, Zap, Clock, ArrowRight, Radar, Sparkles, Lightbulb, AlertTriangle, DollarSign } from 'lucide-react';
import { useRadar } from '@/lib/RadarContext';
import { useNav } from '@/lib/nav';
import { useUi } from '@/lib/UiContext';
import { relativeTime, IMPACT_RANK, CATEGORY_LABELS } from '@/lib/format';
import { pickBiggestChange, pickPricingPressure, pickTopOpportunity } from '@/lib/insights';
import { ImpactBadge, SignalTypeBadge, CategoryBadge } from '@/components/Badges';
import { EmptyState, ErrorState, Skeleton } from '@/components/States';
import { SectionHeader } from '@/components/SectionHeader';
import { InsightPanel } from '@/components/InsightPanel';
import { LocationContext } from '@/components/LocationContext';
import type { SignalWithCompetitor } from '@/lib/types';

function CountChip({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-ink-border bg-white px-4 py-3">
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-navy-50 text-navy-500">
        {icon}
      </span>
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">{label}</p>
        <p className="text-lg font-bold tracking-tight text-navy">{value}</p>
      </div>
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

function TakeawayCard({
  icon,
  kicker,
  kickerClass,
  iconClass,
  title,
  body,
  meta,
  empty,
  onClick,
}: {
  icon: React.ReactNode;
  kicker: string;
  kickerClass: string;
  iconClass: string;
  title: string;
  body: string;
  meta?: string;
  empty?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!onClick}
      className="rounded-2xl border border-ink-border bg-white p-5 text-left transition hover:border-navy-200 disabled:cursor-default"
    >
      <div className={`flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider ${kickerClass}`}>
        <span className={`rounded-md p-1 ${iconClass}`}>{icon}</span>
        <span>{kicker}</span>
      </div>
      <h3 className={`mt-3 font-extrabold leading-snug text-navy ${empty ? 'text-muted' : ''}`}>
        {title}
      </h3>
      <p className="mt-1.5 text-xs leading-relaxed text-muted">{body}</p>
      {meta && <p className="mt-2 text-[11px] font-medium text-navy-400">{meta}</p>}
    </button>
  );
}

function SignalRow({
  signal,
  onOpen,
}: {
  signal: SignalWithCompetitor;
  onOpen: () => void;
}) {
  return (
    <button
      onClick={onOpen}
      className={`group flex w-full items-start justify-between gap-4 rounded-xl border bg-white p-4 text-left transition duration-200 ${
        signal.signal_type === 'change'
          ? 'border-brand-blue/20 hover:border-brand-blue/40'
          : 'border-ink-border hover:border-navy-200'
      }`}
    >
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-navy">
            {signal.competitors?.name ?? 'Unknown competitor'}
          </span>
          <span className="text-ink-border">·</span>
          <CategoryBadge category={signal.category} />
          <span className="text-sm text-muted">{relativeTime(signal.created_at)}</span>
        </div>
        <p className="mt-1.5 truncate font-semibold tracking-tight text-navy">{signal.title}</p>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-2">
        <ImpactBadge impact={signal.impact} />
        <SignalTypeBadge type={signal.signal_type} />
      </div>
    </button>
  );
}

export function Dashboard() {
  const { business, competitors, signals, loading, error } = useRadar();
  const { navigate } = useNav();
  const { openCompetitor } = useUi();
  const openSignals = () => navigate('signals');

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
  const opportunity = pickTopOpportunity(signals);
  const biggestChange = pickBiggestChange(signals);
  const pricing = pickPricingPressure(signals);
  const recentChanges = signals.filter((s) => s.signal_type === 'change').slice(0, 3);
  const watchouts = signals.filter((s) => s.category === 'reputation' || s.category === 'hours').slice(0, 3);

  return (
    <div className="space-y-10">
      <SectionHeader
        as="h1"
        eyebrow="Overview"
        title="Dashboard"
        description="What your competitors are doing, and what to do about it."
      />

      <LocationContext business={business} competitorCount={competitorCount} />

      <div className="grid gap-4 md:grid-cols-3">
        <TakeawayCard
          icon={<Sparkles className="h-4 w-4" />}
          kicker="Top opportunity"
          kickerClass="text-semantic-opportunity"
          iconClass="bg-semantic-opportunityBg text-semantic-opportunity"
          title={opportunity?.title ?? 'No opportunity signal yet'}
          body={
            opportunity
              ? opportunity.recommended_action
              : 'Scan a competitor to surface a concrete opening you can act on this week.'
          }
          meta={
            opportunity
              ? `${opportunity.competitors?.name ?? 'Competitor'} · ${CATEGORY_LABELS[opportunity.category]}`
              : undefined
          }
          empty={!opportunity}
          onClick={opportunity ? () => openCompetitor(opportunity.competitor_id) : undefined}
        />
        <TakeawayCard
          icon={<Zap className="h-4 w-4" />}
          kicker="Biggest recent change"
          kickerClass="text-brand-blue"
          iconClass="bg-semantic-pricingBg text-brand-blue"
          title={biggestChange?.title ?? 'No change detected yet'}
          body={
            biggestChange
              ? biggestChange.finding
              : 'A second scan of a competitor is what produces a change signal.'
          }
          meta={
            biggestChange
              ? `${biggestChange.competitors?.name ?? 'Competitor'} · ${relativeTime(biggestChange.created_at)}`
              : undefined
          }
          empty={!biggestChange}
          onClick={biggestChange ? () => openCompetitor(biggestChange.competitor_id) : undefined}
        />
        <TakeawayCard
          icon={<DollarSign className="h-4 w-4" />}
          kicker="Pricing pressure"
          kickerClass="text-semantic-pricing"
          iconClass="bg-semantic-pricingBg text-semantic-pricing"
          title={pricing?.title ?? 'No pricing signal yet'}
          body={
            pricing
              ? pricing.finding
              : 'Pricing and menu signals appear here once a scan finds a comparable price point.'
          }
          meta={
            pricing
              ? `${pricing.competitors?.name ?? 'Competitor'} · ${CATEGORY_LABELS[pricing.category]}`
              : undefined
          }
          empty={!pricing}
          onClick={pricing ? () => openCompetitor(pricing.competitor_id) : undefined}
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <CountChip icon={<Store className="h-4 w-4" />} label="Watching" value={String(competitorCount)} />
        <CountChip icon={<Zap className="h-4 w-4" />} label="New signals" value={String(unread)} />
        <CountChip
          icon={<Clock className="h-4 w-4" />}
          label="Last checked"
          value={lastChecked ? relativeTime(lastChecked) : 'No scans yet'}
        />
      </div>

      {signals.length === 0 ? (
        <EmptyState
          icon={<Radar className="h-6 w-6" />}
          title="No signals yet"
          description="Run a scan on a competitor and their pricing and menu changes will show up here."
          action={
            <button
              onClick={() => navigate('competitors')}
              className="rounded-xl bg-navy px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-navy-600"
            >
              Go to competitors
            </button>
          }
        />
      ) : (
        <>
          {recentChanges.length > 0 && (
            <section className="space-y-4">
              <SectionHeader
                eyebrow="Movement"
                title="Recent changes"
                action={
                  <button
                    onClick={openSignals}
                    className="inline-flex items-center gap-1 text-sm font-medium text-brand-blue hover:text-brand-cyan"
                  >
                    See all <ArrowRight className="h-4 w-4" />
                  </button>
                }
              />
              <InsightPanel tone="change" label="New since last scan" icon={<Sparkles className="h-3.5 w-3.5" />}>
                <div className="space-y-3">
                  {recentChanges.map((s) => (
                    <SignalRow key={s.id} signal={s} onOpen={() => openCompetitor(s.competitor_id)} />
                  ))}
                </div>
              </InsightPanel>
            </section>
          )}

          {watchouts.length > 0 && (
            <section className="space-y-4">
              <SectionHeader eyebrow="Pressure" title="Watch-outs" />
              <InsightPanel
                tone="threat"
                label="Complaints and weaknesses"
                icon={<AlertTriangle className="h-3.5 w-3.5" />}
              >
                <div className="space-y-3">
                  {watchouts.map((s) => (
                    <SignalRow key={s.id} signal={s} onOpen={() => openCompetitor(s.competitor_id)} />
                  ))}
                </div>
              </InsightPanel>
            </section>
          )}

          {top.length > 0 && (
            <section className="space-y-4">
              <SectionHeader
                eyebrow="Next moves"
                title="Action recommendations"
                action={
                  <button
                    onClick={openSignals}
                    className="inline-flex items-center gap-1 text-sm font-medium text-brand-blue hover:text-brand-cyan"
                  >
                    See all signals <ArrowRight className="h-4 w-4" />
                  </button>
                }
              />
              <div className="space-y-3">
                {top.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => openCompetitor(s.competitor_id)}
                    className="w-full text-left"
                  >
                    <InsightPanel tone="action" label="Do this" icon={<Lightbulb className="h-3.5 w-3.5" />}>
                      <p className="text-sm font-medium text-muted">
                        {s.competitors?.name ?? 'Unknown competitor'}
                        <span className="text-ink-border"> · </span>
                        {s.title}
                      </p>
                      <p className="mt-2 text-base font-semibold leading-relaxed text-navy">
                        {s.recommended_action}
                      </p>
                    </InsightPanel>
                  </button>
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
