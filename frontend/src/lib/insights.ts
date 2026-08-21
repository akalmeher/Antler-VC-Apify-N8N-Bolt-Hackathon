import { IMPACT_RANK } from '@/lib/format';
import type { Category, Competitor, SignalWithCompetitor } from '@/lib/types';

export function formatMiles(value: number | null | undefined): string | null {
  if (value == null || Number.isNaN(value)) return null;
  return `${value} mi`;
}

export function competitorDistance(competitor: Competitor): string | null {
  return formatMiles(competitor.distance_miles);
}

export function competitorAddress(competitor: Competitor): string | null {
  const address = competitor.address?.trim();
  return address ? address : null;
}

export function countCheckedSince(competitors: Competitor[], sinceMs: number): number {
  return competitors.filter(
    (c) => c.last_checked_at !== null && new Date(c.last_checked_at).getTime() > sinceMs,
  ).length;
}

export function countSignalsSince(signals: SignalWithCompetitor[], sinceMs: number): number {
  return signals.filter((s) => new Date(s.created_at).getTime() > sinceMs).length;
}

function byImpactThenRecency(a: SignalWithCompetitor, b: SignalWithCompetitor): number {
  const rank = IMPACT_RANK[a.impact] - IMPACT_RANK[b.impact];
  if (rank !== 0) return rank;
  return b.created_at.localeCompare(a.created_at);
}

export function signalsForCompetitor(
  signals: SignalWithCompetitor[],
  competitorId: string,
): SignalWithCompetitor[] {
  return signals.filter((s) => s.competitor_id === competitorId);
}

export function pickTopOpportunity(
  signals: SignalWithCompetitor[],
): SignalWithCompetitor | null {
  const pool = signals.filter(
    (s) => s.category === 'positioning' || s.category === 'promotion' || s.category === 'menu_product',
  );
  const source = pool.length > 0 ? pool : signals.filter((s) => s.category !== 'reputation');
  return source.slice().sort(byImpactThenRecency)[0] ?? null;
}

export function pickBiggestChange(
  signals: SignalWithCompetitor[],
): SignalWithCompetitor | null {
  return signals.filter((s) => s.signal_type === 'change').slice().sort(byImpactThenRecency)[0] ?? null;
}

export function pickPricingPressure(
  signals: SignalWithCompetitor[],
): SignalWithCompetitor | null {
  return signals.filter((s) => s.category === 'pricing').slice().sort(byImpactThenRecency)[0] ?? null;
}

export function pickComplaint(signals: SignalWithCompetitor[]): SignalWithCompetitor | null {
  return signals.filter((s) => s.category === 'reputation').slice().sort(byImpactThenRecency)[0] ?? null;
}

export const PRICING_MENU_CATEGORIES: Category[] = ['pricing', 'menu_product'];
export const WEAKNESS_CATEGORIES: Category[] = ['reputation', 'hours'];
