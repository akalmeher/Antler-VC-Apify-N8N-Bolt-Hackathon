import type { CompetitorStatus, Impact, SignalType } from '@/lib/types';
import { IMPACT_LABELS, SIGNAL_TYPE_LABELS, STATUS_LABELS } from '@/lib/format';

const base =
  'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium leading-5';

export function StatusBadge({ status }: { status: CompetitorStatus }) {
  const styles: Record<CompetitorStatus, string> = {
    pending: 'border-ink-border bg-white text-navy-400',
    scanning: 'border-brand-blue/30 bg-brand-blue/10 text-brand-blue',
    active: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    error: 'border-red-200 bg-red-50 text-red-700',
  };
  return (
    <span className={`${base} ${styles[status]}`}>
      {status === 'scanning' && (
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-cyan opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-blue" />
        </span>
      )}
      {STATUS_LABELS[status]}
    </span>
  );
}

export function ImpactBadge({ impact }: { impact: Impact }) {
  const styles: Record<Impact, string> = {
    high: 'border-navy bg-navy text-white',
    medium: 'border-brand-blue/30 bg-brand-blue/10 text-brand-blue',
    low: 'border-ink-border bg-white text-navy-400',
  };
  return <span className={`${base} ${styles[impact]}`}>{IMPACT_LABELS[impact]}</span>;
}

export function SignalTypeBadge({ type }: { type: SignalType }) {
  const styles: Record<SignalType, string> = {
    baseline: 'border-ink-border bg-white text-navy-400',
    change:
      'border-brand-blue/40 bg-gradient-to-r from-brand-blue/10 to-brand-cyan/10 text-brand-blue',
  };
  return <span className={`${base} ${styles[type]}`}>{SIGNAL_TYPE_LABELS[type]}</span>;
}
