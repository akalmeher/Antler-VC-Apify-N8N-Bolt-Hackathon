import { MapPin } from 'lucide-react';
import type { Business } from '@/lib/types';
import { businessLocation } from '@/lib/insights';
import { useNav } from '@/lib/nav';

export function LocationBadge({ business }: { business: Business | null }) {
  const { navigate, route } = useNav();
  if (!business) return null;

  const location = businessLocation(business);
  const active = route === 'business';

  return (
    <button
      type="button"
      onClick={() => navigate('business')}
      className={`hidden min-w-0 max-w-[16rem] rounded-2xl border px-3 py-1.5 text-left shadow-soft transition-colors duration-220 xl:block ${
        active
          ? 'border-ink-border bg-semantic-opportunityBg'
          : 'border-ink-border bg-surface hover:bg-ink-bg'
      }`}
    >
      <p className="truncate text-[11px] font-semibold text-navy">
        <span className="font-medium text-muted">Your Company: </span>
        {business.name}
      </p>
      <p className="mt-0.5 flex items-center gap-1 truncate text-[11px] text-muted">
        <MapPin className="h-3 w-3 shrink-0 text-charcoal" />
        <span className="truncate">{location ?? 'Location not set'}</span>
      </p>
    </button>
  );
}
