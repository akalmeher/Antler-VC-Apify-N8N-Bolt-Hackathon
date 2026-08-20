export const inputClass =
  'w-full rounded-[10px] border border-ink-border bg-ink-bg px-3.5 py-2.5 text-sm text-charcoal placeholder:text-charcoal-400 focus:border-brand-sage focus:outline-none focus:ring-2 focus:ring-brand-sage/20';

export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}
