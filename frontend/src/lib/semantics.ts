import type { Category, Impact } from '@/lib/types';
import type { InsightTone } from '@/components/InsightPanel';

export const CATEGORY_BADGE: Record<Category, string> = {
  pricing: 'border-semantic-pricingBorder bg-semantic-pricingBg text-semantic-pricing',
  promotion: 'border-semantic-promotionBorder bg-semantic-promotionBg text-semantic-promotion',
  menu_product: 'border-semantic-pricingBorder bg-semantic-pricingBg text-semantic-pricing',
  hours: 'border-semantic-warningBorder bg-semantic-warningBg text-semantic-warning',
  reputation: 'border-semantic-threatBorder bg-semantic-threatBg text-semantic-threat',
  positioning: 'border-semantic-positioningBorder bg-semantic-positioningBg text-semantic-positioning',
};

export const IMPACT_BADGE: Record<Impact, string> = {
  high: 'border-semantic-threatBorder bg-semantic-threat text-white',
  medium: 'border-semantic-warningBorder bg-semantic-warningBg text-semantic-warning',
  low: 'border-ink-border bg-white text-muted',
};

export function findingTone(category: Category, isChange: boolean): InsightTone {
  if (isChange) return 'change';
  if (category === 'reputation') return 'threat';
  if (category === 'hours') return 'warning';
  if (category === 'promotion') return 'promotion';
  if (category === 'pricing' || category === 'menu_product') return 'pricing';
  if (category === 'positioning') return 'positioning';
  return 'finding';
}

export function whyTone(category: Category): InsightTone {
  if (category === 'reputation') return 'threat';
  if (category === 'hours') return 'warning';
  return 'opportunity';
}
