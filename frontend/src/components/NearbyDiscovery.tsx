import { useEffect, useMemo, useRef, useState } from 'react';
import { Check, Loader2, Map, MapPin, Radar, Search, Star } from 'lucide-react';
import { useRadar } from '@/lib/RadarContext';
import { discoverNearbyCompetitors } from '@/lib/api';
import { businessLocation } from '@/lib/insights';
import { inputClass } from '@/lib/forms';
import { EmptyState, ErrorState } from '@/components/States';
import { BrandSweepIcon } from '@/components/BrandMark';
import { GoogleMapModal } from '@/components/GoogleMapModal';
import type { DiscoverNearbyResponse, NearbyCompetitor } from '@/lib/types';

const DISCOVERY_MESSAGES = [
  'Mapping your discovery area…',
  'Finding nearby competitors…',
  'Checking which businesses are relevant…',
  'Building your competitive shortlist…',
];

function lerp(from: number, to: number, t: number): number {
  return from + (to - from) * Math.min(1, Math.max(0, t));
}

function simulatedDiscoveryProgress(elapsedMs: number): number {
  if (elapsedMs < 400) return 9;
  if (elapsedMs < 1800) return lerp(9, 25, (elapsedMs - 400) / 1400);
  if (elapsedMs < 3600) return lerp(25, 50, (elapsedMs - 1800) / 1800);
  if (elapsedMs < 5600) return lerp(50, 72, (elapsedMs - 3600) / 2000);
  if (elapsedMs < 7800) return lerp(72, 88, (elapsedMs - 5600) / 2200);
  if (elapsedMs < 11000) return lerp(88, 93, (elapsedMs - 7800) / 3200);
  return Math.min(95, 93 + 2 * (1 - Math.exp(-(elapsedMs - 11000) / 8000)));
}

function DiscoveryProgress({ complete }: { complete: boolean }) {
  const [pct, setPct] = useState(9);
  const [msgIndex, setMsgIndex] = useState(0);
  const startedAt = useRef(Date.now());

  useEffect(() => {
    if (complete) {
      setPct(100);
      return;
    }
    startedAt.current = Date.now();
    const tick = () => setPct(simulatedDiscoveryProgress(Date.now() - startedAt.current));
    tick();
    const id = window.setInterval(tick, 80);
    return () => window.clearInterval(id);
  }, [complete]);

  useEffect(() => {
    if (complete) return;
    const id = window.setInterval(() => {
      setMsgIndex((i) => (i + 1) % DISCOVERY_MESSAGES.length);
    }, 2400);
    return () => window.clearInterval(id);
  }, [complete]);

  const message = complete ? 'Nearby competitors found' : DISCOVERY_MESSAGES[msgIndex];

  return (
    <section className="flex min-h-[22rem] items-center justify-center rounded-2xl border border-ink-border bg-surface px-6 py-14 shadow-soft animate-fade sm:min-h-[26rem]">
      <div className="mx-auto w-full max-w-md text-center">
        <div className="flex justify-center">
          <BrandSweepIcon className="h-16 sm:h-[4.5rem]" active={!complete} />
        </div>
        <h2 className="mt-6 font-serif text-xl font-semibold leading-snug tracking-tight text-charcoal sm:text-2xl">
          Looking into your local market
        </h2>
        <p key={message} className="mt-2 animate-text-in text-sm leading-relaxed text-muted">
          {message}
        </p>
        <div
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(pct)}
          aria-label="Discovery progress"
          className="mx-auto mt-6 h-2 w-full overflow-hidden rounded-full bg-charcoal-50"
        >
          <div
            className={`h-full rounded-full bg-brand-sage ${
              complete
                ? 'transition-[width] duration-500 ease-out'
                : 'transition-[width] duration-150 ease-out'
            }`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </section>
  );
}

const RADIUS_OPTIONS = [1, 3, 5];

type MonitorState = 'idle' | 'adding' | 'monitoring' | 'error';

function cardKey(competitor: NearbyCompetitor, index: number): string {
  return competitor.place_id ?? `${competitor.name}-${index}`;
}

function hostKey(url: string | null): string | null {
  if (!url) return null;
  try {
    return new URL(url).hostname.replace(/^www\./, '').toLowerCase();
  } catch {
    return null;
  }
}

function radiusLabel(miles: number): string {
  return `${miles} ${miles === 1 ? 'mile' : 'miles'}`;
}

function resultsSummary(count: number, miles: number): string {
  return `${count} ${count === 1 ? 'business' : 'businesses'} found within ${radiusLabel(miles)}`;
}

function DiscoveryCard({
  competitor,
  state,
  errorMessage,
  onMonitor,
  onViewMap,
}: {
  competitor: NearbyCompetitor;
  state: MonitorState;
  errorMessage?: string;
  onMonitor: () => void;
  onViewMap: () => void;
}) {
  const [imageOk, setImageOk] = useState(true);
  const isMonitoring = state === 'monitoring';
  const isAdding = state === 'adding';

  const meta = [
    competitor.category,
    competitor.distance_miles !== null ? `${competitor.distance_miles.toFixed(1)} mi` : null,
  ].filter(Boolean);

  const stats = [
    competitor.reviews_count > 0
      ? `${competitor.reviews_count} ${competitor.reviews_count === 1 ? 'review' : 'reviews'}`
      : null,
    competitor.price,
  ].filter(Boolean);

  return (
    <article
      className={`flex flex-col overflow-hidden rounded-2xl border bg-surface shadow-soft transition-colors duration-260 ${
        isMonitoring ? 'border-semantic-opportunityBorder' : 'border-ink-border'
      }`}
    >
      {competitor.image_url && imageOk && (
        <img
          src={competitor.image_url}
          alt=""
          loading="lazy"
          onError={() => setImageOk(false)}
          className="h-32 w-full object-cover"
        />
      )}

      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-serif text-base font-semibold leading-snug tracking-tight text-charcoal">
          {competitor.name}
        </h3>

        {meta.length > 0 && (
          <p className="mt-1 text-sm text-muted">{meta.join(' · ')}</p>
        )}

        {competitor.neighborhood && (
          <p className="mt-1 flex items-center gap-1 text-xs text-muted">
            <MapPin className="h-3 w-3 shrink-0" />
            {competitor.neighborhood}
          </p>
        )}

        {(competitor.rating !== null || stats.length > 0) && (
          <p className="mt-2 flex flex-wrap items-center gap-1 text-sm text-charcoal">
            {competitor.rating !== null && (
              <span className="inline-flex items-center gap-1 font-semibold">
                <Star className="h-3.5 w-3.5 fill-brand-ochre text-brand-ochre" />
                {competitor.rating.toFixed(1)}
              </span>
            )}
            {competitor.rating !== null && stats.length > 0 && (
              <span className="text-ink-border">·</span>
            )}
            {stats.length > 0 && <span className="text-muted">{stats.join(' · ')}</span>}
          </p>
        )}

        {state === 'error' && errorMessage && (
          <p className="mt-3 text-xs text-semantic-threat">{errorMessage}</p>
        )}

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-ink-border pt-3">
          {competitor.can_monitor ? (
            <button
              type="button"
              onClick={onMonitor}
              disabled={isAdding || isMonitoring}
              className={`inline-flex items-center gap-1.5 rounded-[10px] px-3.5 py-2 text-xs font-semibold transition-colors duration-220 ${
                isMonitoring
                  ? 'cursor-default border border-semantic-opportunityBorder bg-semantic-opportunityBg text-semantic-opportunity'
                  : 'bg-brand-sage text-surface hover:bg-semantic-opportunity disabled:opacity-60'
              }`}
            >
              {isAdding && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              {isMonitoring && <Check className="h-3.5 w-3.5" />}
              {isMonitoring ? 'Monitoring' : isAdding ? 'Starting…' : 'Monitor competitor'}
            </button>
          ) : (
            <button
              type="button"
              disabled
              className="cursor-not-allowed rounded-[10px] border border-ink-border bg-ink-bg px-3.5 py-2 text-xs font-semibold text-muted"
            >
              No website found
            </button>
          )}

          {competitor.google_maps_url && (
            <button
              type="button"
              onClick={onViewMap}
              className="inline-flex items-center gap-1 text-xs font-medium text-charcoal transition-colors duration-220 hover:text-brand-sage"
            >
              View on Maps
              <Map className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

export function NearbyDiscovery() {
  const { business, competitors, startAddCompetitor } = useRadar();

  const savedLocation = businessLocation(business) ?? '';
  const [address, setAddress] = useState('');
  const [locationEdited, setLocationEdited] = useState(false);
  const [radiusMiles, setRadiusMiles] = useState(3);
  const [searchTerm, setSearchTerm] = useState('taco restaurant');
  const [touched, setTouched] = useState(false);
  const [searching, setSearching] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [result, setResult] = useState<DiscoverNearbyResponse | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [monitorStates, setMonitorStates] = useState<Record<string, MonitorState>>({});
  const [monitorErrors, setMonitorErrors] = useState<Record<string, string>>({});
  const [mapCompetitor, setMapCompetitor] = useState<NearbyCompetitor | null>(null);

  useEffect(() => {
    if (locationEdited) return;
    if (!savedLocation) return;
    setAddress(savedLocation);
  }, [savedLocation, locationEdited]);

  const usingSavedLocation = savedLocation !== '' && address.trim() === savedLocation;
  const showResetLocation = savedLocation !== '' && address.trim() !== savedLocation;

  const addressError = address.trim() === '' ? 'Enter the location to search around.' : null;
  const termError = searchTerm.trim() === '' ? 'Tell us what to look for.' : null;
  const valid = !addressError && !termError;

  const watchedHosts = useMemo(
    () => new Set(competitors.map((c) => hostKey(c.url)).filter(Boolean) as string[]),
    [competitors],
  );
  const watchedNames = useMemo(
    () => new Set(competitors.map((c) => c.name.trim().toLowerCase())),
    [competitors],
  );

  const alreadyWatched = (competitor: NearbyCompetitor): boolean => {
    const host = hostKey(competitor.website);
    if (host && watchedHosts.has(host)) return true;
    return watchedNames.has(competitor.name.trim().toLowerCase());
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (!valid) return;
    setSearching(true);
    setCompleting(false);
    setSearchError(null);
    setResult(null);
    setMonitorStates({});
    setMonitorErrors({});
    try {
      const data = await discoverNearbyCompetitors({
        business_name: business?.name ?? '',
        address: address.trim(),
        radius_miles: radiusMiles,
        search_term: searchTerm.trim(),
      });
      setResult(data);
      setSearching(false);
      setCompleting(true);
    } catch (err) {
      setSearchError(
        err instanceof Error ? err.message : 'The discovery service did not respond.',
      );
      setSearching(false);
      setCompleting(false);
    }
  };

  useEffect(() => {
    if (!completing) return;
    const timeout = window.setTimeout(() => setCompleting(false), 900);
    return () => window.clearTimeout(timeout);
  }, [completing]);

  const handleMonitor = async (competitor: NearbyCompetitor, key: string) => {
    if (!competitor.website) return;
    setMonitorStates((prev) => ({ ...prev, [key]: 'adding' }));
    setMonitorErrors((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
    try {
      await startAddCompetitor({
        name: competitor.name,
        url: competitor.website,
        page_urls: [competitor.website],
      });
      setMonitorStates((prev) => ({ ...prev, [key]: 'monitoring' }));
    } catch (err) {
      setMonitorStates((prev) => ({ ...prev, [key]: 'error' }));
      setMonitorErrors((prev) => ({
        ...prev,
        [key]: err instanceof Error ? err.message : 'We could not start monitoring this business.',
      }));
    }
  };

  return (
    <div className="space-y-6">
      <form
        onSubmit={handleSearch}
        className="space-y-5 rounded-2xl border border-ink-border bg-surface p-5 shadow-soft sm:p-6"
      >
        <div>
          <label className="mb-1.5 block text-sm font-medium text-navy-500">Business location</label>
          <input
            className={inputClass}
            value={address}
            onChange={(e) => {
              setLocationEdited(true);
              setAddress(e.target.value);
            }}
            placeholder="Street address or city"
            autoComplete="street-address"
          />
          <div className="mt-1.5 flex flex-wrap items-center justify-between gap-2">
            {usingSavedLocation ? (
              <p className="text-xs text-muted">Using your business location</p>
            ) : showResetLocation ? (
              <button
                type="button"
                onClick={() => {
                  setAddress(savedLocation);
                  setLocationEdited(false);
                }}
                className="text-xs font-semibold text-charcoal transition-colors duration-220 hover:text-brand-sage"
              >
                Reset to business address
              </button>
            ) : (
              <span />
            )}
            {touched && addressError && (
              <p className="text-xs text-semantic-threat">{addressError}</p>
            )}
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-navy-500">Search radius</label>
          <div className="inline-flex rounded-[10px] border border-ink-border bg-ink-bg p-1">
            {RADIUS_OPTIONS.map((miles) => (
              <button
                key={miles}
                type="button"
                onClick={() => setRadiusMiles(miles)}
                className={`rounded-[7px] px-3.5 py-1.5 text-sm font-medium transition-colors duration-220 ${
                  radiusMiles === miles
                    ? 'bg-surface text-charcoal shadow-soft'
                    : 'text-muted hover:text-charcoal'
                }`}
              >
                {radiusLabel(miles)}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-navy-500">
            What should we look for?
          </label>
          <input
            className={inputClass}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="taco restaurant"
          />
          {touched && termError && (
            <p className="mt-1 text-xs text-semantic-threat">{termError}</p>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-ink-border pt-5">
          {business?.name ? (
            <p className="text-xs text-muted">Searching around {business.name}.</p>
          ) : (
            <span />
          )}
          <button
            type="submit"
            disabled={searching || completing}
            className="hover-lift inline-flex items-center gap-2 rounded-[10px] bg-charcoal px-5 py-2.5 text-sm font-semibold text-surface shadow-soft transition-colors duration-220 hover:bg-charcoal-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {searching || completing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
            {searching || completing ? 'Looking…' : 'Find nearby competitors'}
          </button>
        </div>
      </form>

      {(searching || completing) && <DiscoveryProgress complete={completing} />}

      {!searching && !completing && searchError && (
        <ErrorState
          title="We couldn’t search this area right now. Please try again."
          message={searchError}
        />
      )}

      {!searching && !completing && result && result.competitors.length > 0 && (
        <section className="space-y-4">
          <p className="animate-text-in text-sm font-semibold text-charcoal">
            {resultsSummary(result.count, result.radius_miles)}
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            {result.competitors.map((competitor, i) => {
              const key = cardKey(competitor, i);
              const state = monitorStates[key] ?? (alreadyWatched(competitor) ? 'monitoring' : 'idle');
              return (
                <DiscoveryCard
                  key={key}
                  competitor={competitor}
                  state={state}
                  errorMessage={monitorErrors[key]}
                  onMonitor={() => void handleMonitor(competitor, key)}
                  onViewMap={() => setMapCompetitor(competitor)}
                />
              );
            })}
          </div>
        </section>
      )}

      {!searching && !completing && result && result.competitors.length === 0 && (
        <EmptyState
          icon={<Radar className="h-6 w-6" />}
          title="Nothing showed up in the mirror"
          description="Try increasing the search radius or using a broader search term."
        />
      )}

      {mapCompetitor && (
        <GoogleMapModal
          competitor={mapCompetitor}
          isOpen
          onClose={() => setMapCompetitor(null)}
        />
      )}
    </div>
  );
}
