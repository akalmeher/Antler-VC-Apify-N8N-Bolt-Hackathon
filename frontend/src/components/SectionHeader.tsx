import type { ReactNode } from 'react';

export function SectionHeader({
  as: Tag = 'h2',
  eyebrow,
  title,
  description,
  action,
}: {
  as?: 'h1' | 'h2';
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div className="min-w-0">
        {eyebrow && (
          <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
            {eyebrow}
          </p>
        )}
        <Tag
          className={
            Tag === 'h1'
              ? 'text-[22px] font-bold tracking-tight text-navy sm:text-[28px]'
              : 'text-lg font-bold tracking-tight text-navy sm:text-[22px]'
          }
        >
          {title}
        </Tag>
        {description && (
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">{description}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
