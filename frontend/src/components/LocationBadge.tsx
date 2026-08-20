import { MapPin } from 'lucide-react';
import type { Business } from '@/lib/types';
import { formatMiles } from '@/lib/insights';

export function LocationBadge({ business }: { business: Business | null }) {
  if (!business) return null;

  const city = business.city?.trim() || null;
  const address = business.address?.trim() || null;
  const radius = formatMiles(business.scan_radius_miles);

  return (
    <div className="hidden min-w-0 max-w-[11rem] rounded-2xl border border-ink-border bg-surface px-3 py-1.5 shadow-soft xl:block">
      <p className="truncate text-[11px] font-semibold text-navy">
        <span className="font-medium text-muted">Your Company: </span>
        {business.name}
      </p>
      <p className="mt-0.5 flex items-center gap-1 truncate text-[11px] text-muted">
        <MapPin className="h-3 w-3 shrink-0 text-charcoal" />
        <span className="truncate">
          {address ?? city ?? 'Location not set'}
          {radius ? ` · ${radius} radius` : ''}
        </span>
      </p>
    </div>
  );
}
