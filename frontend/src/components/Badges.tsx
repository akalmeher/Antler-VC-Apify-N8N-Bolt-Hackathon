import type { Category, CompetitorStatus, Impact, SignalType } from '@/lib/types';
import { CATEGORY_LABELS, IMPACT_LABELS, SIGNAL_TYPE_LABELS, STATUS_LABELS } from '@/lib/format';
import { CATEGORY_BADGE, IMPACT_BADGE } from '@/lib/semantics';

const base =
  'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold leading-5 tracking-[0.02em]';

export function StatusBadge({ status }: { status: CompetitorStatus }) {
  const styles: Record<CompetitorStatus, string> = {
    pending: 'border-ink-border bg-white text-muted',
    scanning: 'border-brand-blue/30 bg-brand-blue/10 text-brand-blue',
    active: 'border-semantic-opportunityBorder bg-semantic-opportunityBg text-semantic-opportunity',
    error: 'border-semantic-threatBorder bg-semantic-threatBg text-semantic-threat',
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
  return <span className={`${base} ${IMPACT_BADGE[impact]}`}>{IMPACT_LABELS[impact]}</span>;
}

export function SignalTypeBadge({ type }: { type: SignalType }) {
  const styles: Record<SignalType, string> = {
    baseline: 'border-ink-border bg-navy-50 font-medium text-muted',
    change: 'border-transparent bg-brand-blue text-white',
  };
  return <span className={`${base} ${styles[type]}`}>{SIGNAL_TYPE_LABELS[type]}</span>;
}

export function CategoryBadge({ category }: { category: Category }) {
  return (
    <span className={`${base} ${CATEGORY_BADGE[category]}`}>{CATEGORY_LABELS[category]}</span>
  );
}
