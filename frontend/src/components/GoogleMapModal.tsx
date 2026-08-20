import { useEffect, useRef } from 'react';
import { ExternalLink, MapPin, X } from 'lucide-react';
import { GOOGLE_MAPS_EMBED_API_KEY } from '@/lib/config';
import type { NearbyCompetitor } from '@/lib/types';

const FOCUSABLE =
  'a[href], button:not([disabled]), iframe, [tabindex]:not([tabindex="-1"])';

export function GoogleMapModal({
  competitor,
  isOpen,
  onClose,
}: {
  competitor: NearbyCompetitor;
  isOpen: boolean;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus?.();
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (e.key !== 'Tab') return;
      const root = dialogRef.current;
      if (!root) return;
      const items = Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;
      if (e.shiftKey && (active === first || !root.contains(active))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const apiKey = GOOGLE_MAPS_EMBED_API_KEY;
  const query = competitor.place_id
    ? `place_id:${competitor.place_id}`
    : competitor.address ?? competitor.name;
  const mapSrc = `https://www.google.com/maps/embed/v1/place?key=${encodeURIComponent(
    apiKey,
  )}&q=${encodeURIComponent(query)}`;

  const meta = [
    competitor.category,
    competitor.distance_miles !== null ? `${competitor.distance_miles.toFixed(1)} mi` : null,
  ].filter(Boolean);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/45 p-4 animate-fade">
      <button className="absolute inset-0 cursor-default" aria-label="Close map" onClick={onClose} />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="map-modal-title"
        className="relative z-10 flex max-h-full w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-ink-border bg-surface shadow-lift animate-modal-in"
      >
        <div className="flex items-start justify-between gap-3 border-b border-ink-border px-5 py-4">
          <div className="min-w-0">
            <h2
              id="map-modal-title"
              className="font-serif text-lg font-semibold leading-snug tracking-tight text-charcoal"
            >
              {competitor.name}
            </h2>
            {meta.length > 0 && <p className="mt-0.5 text-sm text-muted">{meta.join(' · ')}</p>}
            {competitor.address && (
              <p className="mt-1 flex items-start gap-1 text-xs text-muted">
                <MapPin className="mt-0.5 h-3 w-3 shrink-0" />
                {competitor.address}
              </p>
            )}
          </div>
          <button
            ref={closeRef}
            onClick={onClose}
            aria-label="Close"
            className="rounded-lg p-2 text-muted transition-colors duration-220 hover:bg-charcoal-50 hover:text-charcoal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="overflow-y-auto">
          {apiKey ? (
            <iframe
              src={mapSrc}
              title={`Map of ${competitor.name}`}
              loading="lazy"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
              className="h-[52vh] min-h-[300px] w-full border-0 sm:h-[520px] lg:h-[560px]"
            />
          ) : (
            <div className="flex h-[52vh] min-h-[300px] flex-col items-center justify-center gap-2 bg-ink-bg px-6 text-center sm:h-[520px]">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-charcoal-50 text-muted">
                <MapPin className="h-6 w-6" />
              </span>
              <p className="font-semibold text-charcoal">Map preview unavailable</p>
              <p className="max-w-sm text-sm text-muted">
                Set VITE_GOOGLE_MAPS_EMBED_API_KEY to show the map here. You can still open this
                place in Google Maps.
              </p>
            </div>
          )}
        </div>

        {competitor.google_maps_url && (
          <div className="flex justify-end border-t border-ink-border px-5 py-3">
            <a
              href={competitor.google_maps_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-charcoal transition-colors duration-220 hover:text-brand-sage"
            >
              Open in Google Maps
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
