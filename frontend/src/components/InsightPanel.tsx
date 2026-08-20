import type { ReactNode } from 'react';

export type InsightTone =
  | 'opportunity'
  | 'threat'
  | 'warning'
  | 'action'
  | 'change'
  | 'finding'
  | 'evidence'
  | 'pricing'
  | 'promotion'
  | 'positioning';

const TONES: Record<InsightTone, { wrap: string; label: string }> = {
  opportunity: {
    wrap: 'border-semantic-opportunityBorder bg-semantic-opportunityBg',
    label: 'text-semantic-opportunity',
  },
  threat: {
    wrap: 'border-semantic-threatBorder bg-semantic-threatBg',
    label: 'text-semantic-threat',
  },
  warning: {
    wrap: 'border-semantic-warningBorder bg-semantic-warningBg',
    label: 'text-semantic-warning',
  },
  action: {
    wrap: 'border-brand-blue/25 border-l-[3px] border-l-brand-blue bg-semantic-pricingBg',
    label: 'text-brand-blue',
  },
  change: {
    wrap: 'border-brand-cyan/30 bg-semantic-pricingBg',
    label: 'text-brand-blue',
  },
  finding: {
    wrap: 'border-ink-border bg-[#F7F9FB]',
    label: 'text-muted',
  },
  evidence: {
    wrap: 'border-ink-border bg-white',
    label: 'text-muted',
  },
  pricing: {
    wrap: 'border-semantic-pricingBorder bg-semantic-pricingBg',
    label: 'text-semantic-pricing',
  },
  promotion: {
    wrap: 'border-semantic-promotionBorder bg-semantic-promotionBg',
    label: 'text-semantic-promotion',
  },
  positioning: {
    wrap: 'border-semantic-positioningBorder bg-semantic-positioningBg',
    label: 'text-semantic-positioning',
  },
};

export function InsightPanel({
  tone,
  label,
  icon,
  children,
}: {
  tone: InsightTone;
  label: string;
  icon?: ReactNode;
  children: ReactNode;
}) {
  const styles = TONES[tone];
  return (
    <div className={`rounded-[12px] border px-4 py-3.5 sm:px-5 sm:py-4 ${styles.wrap}`}>
      <p
        className={`flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.16em] ${styles.label}`}
      >
        {icon}
        {label}
      </p>
      <div className="mt-2">{children}</div>
    </div>
  );
}
