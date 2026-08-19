import type { Category, Impact, SignalType, CompetitorStatus } from '@/lib/types';

export const CATEGORY_LABELS: Record<Category, string> = {
  pricing: 'Pricing',
  promotion: 'Promotion',
  menu_product: 'Menu & product',
  hours: 'Hours',
  reputation: 'Reputation',
  positioning: 'Positioning',
};

export const IMPACT_LABELS: Record<Impact, string> = {
  high: 'High impact',
  medium: 'Medium impact',
  low: 'Low impact',
};

export const SIGNAL_TYPE_LABELS: Record<SignalType, string> = {
  baseline: 'Baseline',
  change: 'New change',
};

export const STATUS_LABELS: Record<CompetitorStatus, string> = {
  pending: 'Pending',
  scanning: 'Scanning',
  active: 'Active',
  error: 'Error',
};

export const IMPACT_RANK: Record<Impact, number> = { high: 0, medium: 1, low: 2 };

export const CATEGORY_VALUES: Category[] = [
  'pricing',
  'promotion',
  'menu_product',
  'hours',
  'reputation',
  'positioning',
];

export const IMPACT_VALUES: Impact[] = ['high', 'medium', 'low'];

export function relativeTime(iso: string | null): string {
  if (!iso) return 'Never';
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return 'Never';
  const diff = Date.now() - then;
  const sec = Math.round(diff / 1000);
  if (sec < 5) return 'just now';
  if (sec < 60) return `${sec} seconds ago`;
  const min = Math.round(sec / 60);
  if (min < 60) return `${min} minute${min === 1 ? '' : 's'} ago`;
  const hr = Math.round(min / 60);
  if (hr < 24) return `${hr} hour${hr === 1 ? '' : 's'} ago`;
  const day = Math.round(hr / 24);
  if (day < 30) return `${day} day${day === 1 ? '' : 's'} ago`;
  const month = Math.round(day / 30);
  if (month < 12) return `${month} month${month === 1 ? '' : 's'} ago`;
  const year = Math.round(month / 12);
  return `${year} year${year === 1 ? '' : 's'} ago`;
}

export function isValidUrl(value: string): boolean {
  try {
    const u = new URL(value.trim());
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
}
