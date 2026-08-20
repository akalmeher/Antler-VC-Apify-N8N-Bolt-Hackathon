import { MapPin, Radar, Store } from 'lucide-react';
import type { Business } from '@/lib/types';
import { formatMiles } from '@/lib/insights';

export function LocationContext({
  business,
  competitorCount,
}: {
  business: Business | null;
  competitorCount: number;
}) {
  if (!business) return null;

  const city = business.city?.trim() || null;
  const address = business.address?.trim() || null;
  const radius = formatMiles(business.scan_radius_miles);
  const place = address ?? city;

  return (
    <div className="grid gap-4 rounded-2xl border border-ink-border bg-white px-5 py-4 sm:grid-cols-[1fr_auto_1fr_auto_1fr] sm:items-center sm:gap-0">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-navy-50 text-navy">
          <MapPin className="h-4 w-4" />
        </span>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
            Your location
          </p>
          <p className="mt-0.5 font-semibold tracking-tight text-navy">
            {place ?? 'Location not set'}
          </p>
          <p className="text-sm text-muted">
            {address && city && address !== city ? city : `Your Company: ${business.name}`}
          </p>
        </div>
      </div>

      <div className="hidden h-10 w-px bg-ink-border sm:block" />

      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-navy-50 text-navy">
          <Store className="h-4 w-4" />
        </span>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
            Watching
          </p>
          <p className="mt-0.5 font-semibold tracking-tight text-navy">
            {competitorCount} competitor{competitorCount === 1 ? '' : 's'}
          </p>
          <p className="text-sm text-muted">Added by you, scanned on a schedule</p>
        </div>
      </div>

      <div className="hidden h-10 w-px bg-ink-border sm:block" />

      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-blue/10 text-brand-blue">
          <Radar className="h-4 w-4" />
        </span>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
            Scan radius
          </p>
          <p className="mt-0.5 font-semibold tracking-tight text-navy">{radius ?? 'Not set'}</p>
          <p className="text-sm text-muted">
            {radius ? 'Nearby discovery radius' : 'Watchlist only — no geo radius yet'}
          </p>
        </div>
      </div>
    </div>
  );
}
