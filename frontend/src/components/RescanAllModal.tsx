import { useEffect, useRef } from 'react';
import { ArrowRight, Clock, X } from 'lucide-react';
import { BrandIcon } from '@/components/BrandMark';

type Phase = 'running' | 'done' | 'timeout';

export function RescanAllModal({
  isOpen,
  phase,
  completed,
  queued,
  currentlyChecking,
  newSignals,
  onClose,
  onDone,
  onViewSignals,
}: {
  isOpen: boolean;
  phase: Phase;
  completed: number;
  queued: number;
  currentlyChecking: string | null;
  newSignals: number;
  onClose: () => void;
  onDone: () => void;
  onViewSignals: () => void;
}) {
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
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isRunning = phase === 'running';
  const pct = queued > 0 ? Math.min(100, Math.round((completed / queued) * 100)) : 100;
  const title =
    phase === 'done'
      ? 'Your reflection is up to date'
      : phase === 'timeout'
        ? 'Still checking your competitors'
        : 'Refreshing your reflection';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/45 p-4 animate-fade">
      <button className="absolute inset-0 cursor-default" aria-label="Close" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="rescan-all-title"
        className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl border border-ink-border bg-surface shadow-lift animate-modal-in"
      >
        <button
          ref={closeRef}
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3 top-3 rounded-lg p-2 text-muted transition-colors duration-220 hover:bg-charcoal-50 hover:text-charcoal"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="px-6 pb-6 pt-8 text-center">
          <div className="flex justify-center">
            <BrandIcon
              className={`h-10 ${isRunning ? 'animate-pulse-soft motion-reduce:animate-none' : ''}`}
            />
          </div>

          <h2
            id="rescan-all-title"
            className="mt-4 font-serif text-xl font-semibold leading-snug tracking-tight text-charcoal"
          >
            {title}
          </h2>

          {isRunning && (
            <p className="mt-2 text-sm leading-relaxed text-muted">
              m.rror is checking your competitors for new changes.
            </p>
          )}

          {phase === 'timeout' && (
            <p className="mt-2 flex items-center justify-center gap-1.5 text-sm leading-relaxed text-muted">
              <Clock className="h-4 w-4 shrink-0" />
              This is taking longer than usual. Reload in a minute to see the rest.
            </p>
          )}

          <div className="mt-5">
            <p className="text-sm font-semibold text-charcoal">
              {phase === 'done'
                ? `${queued} ${queued === 1 ? 'competitor' : 'competitors'} checked.`
                : `${completed} of ${queued} ${queued === 1 ? 'competitor' : 'competitors'} checked`}
            </p>
            <div
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={queued}
              aria-valuenow={completed}
              className="mt-2.5 h-2 w-full overflow-hidden rounded-full bg-charcoal-50"
            >
              <div
                className="h-full rounded-full bg-brand-sage transition-[width] duration-500 ease-out"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>

          {isRunning && currentlyChecking && (
            <p className="mt-3 text-sm text-muted">
              Currently checking: <span className="font-medium text-charcoal">{currentlyChecking}</span>
            </p>
          )}

          {phase === 'done' && newSignals > 0 && (
            <p className="mt-3 text-sm text-semantic-opportunity">
              {newSignals} new {newSignals === 1 ? 'signal' : 'signals'} since this scan started.
            </p>
          )}

          {isRunning ? (
            <p className="mt-6 border-t border-ink-border pt-4 text-xs leading-relaxed text-muted">
              You can close this window. Scanning will continue in the background.
            </p>
          ) : (
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3 border-t border-ink-border pt-5">
              <button
                onClick={onDone}
                className="hover-lift rounded-[10px] bg-charcoal px-5 py-2.5 text-sm font-semibold text-surface shadow-soft transition-colors duration-220 hover:bg-charcoal-600"
              >
                Done
              </button>
              <button
                onClick={onViewSignals}
                className="inline-flex items-center gap-1.5 rounded-[10px] border border-ink-border bg-surface px-4 py-2.5 text-sm font-semibold text-charcoal transition-colors duration-220 hover:bg-ink-bg"
              >
                View signals
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
