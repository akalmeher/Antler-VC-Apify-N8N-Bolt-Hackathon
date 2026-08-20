import type { Category, Impact } from '@/lib/types';
import type { InsightTone } from '@/components/InsightPanel';

export const CATEGORY_BADGE: Record<Category, string> = {
  pricing: 'border-ink-border bg-ink-bg text-charcoal',
  promotion: 'border-semantic-opportunityBorder bg-semantic-opportunityBg text-semantic-opportunity',
  menu_product: 'border-ink-border bg-ink-bg text-charcoal',
  hours: 'border-semantic-warningBorder bg-semantic-warningBg text-semantic-warning',
  reputation: 'border-semantic-threatBorder bg-semantic-threatBg text-semantic-threat',
  positioning: 'border-semantic-opportunityBorder bg-semantic-opportunityBg text-semantic-opportunity',
};

export const IMPACT_BADGE: Record<Impact, string> = {
  high: 'border-semantic-threatBorder bg-semantic-threatBg text-semantic-threat',
  medium: 'border-semantic-warningBorder bg-semantic-warningBg text-semantic-warning',
  low: 'border-ink-border bg-ink-bg text-muted',
};

export function isThreatening(category: Category, impact: Impact): boolean {
  return category === 'reputation' || (category === 'pricing' && impact === 'high');
}

export function isFavorable(category: Category): boolean {
  return category === 'positioning' || category === 'promotion';
}

export function findingTone(category: Category, isChange: boolean, impact: Impact = 'medium'): InsightTone {
  if (isChange) {
    if (isThreatening(category, impact)) return 'threat';
    if (isFavorable(category)) return 'opportunity';
    return 'change';
  }
  return 'finding';
}

export function whyTone(category: Category): InsightTone {
  if (category === 'reputation') return 'threat';
  if (category === 'hours') return 'warning';
  if (isFavorable(category)) return 'opportunity';
  return 'warning';
}
