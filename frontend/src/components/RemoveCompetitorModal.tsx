import { useEffect, useRef, useState } from 'react';
import { Loader2, X } from 'lucide-react';
import { removeCompetitor } from '@/lib/api';
import type { Competitor } from '@/lib/types';

export function RemoveCompetitorModal({
  competitor,
  isOpen,
  onClose,
  onRemoved,
}: {
  competitor: Competitor;
  isOpen: boolean;
  onClose: () => void;
  onRemoved: () => Promise<void> | void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const submittingLock = useRef(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    setSubmitting(false);
    setSubmitError(null);
    submittingLock.current = false;
  }, [isOpen, competitor.id]);

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
      if (e.key === 'Escape' && !submittingLock.current) onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleRemove = async () => {
    if (submittingLock.current) return;
    submittingLock.current = true;
    setSubmitting(true);
    setSubmitError(null);
    try {
      await removeCompetitor(competitor.id);
      await onRemoved();
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : 'We could not remove this competitor. Please try again.',
      );
      submittingLock.current = false;
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/45 p-4 animate-fade">
      <button
        className="absolute inset-0 cursor-default"
        aria-label="Close"
        onClick={() => {
          if (!submittingLock.current) onClose();
        }}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="remove-competitor-title"
        className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl border border-ink-border bg-surface shadow-lift animate-modal-in"
      >
        <div className="flex items-start justify-between gap-3 border-b border-ink-border px-5 py-4">
          <h2
            id="remove-competitor-title"
            className="pr-6 font-serif text-lg font-semibold leading-snug tracking-tight text-charcoal"
          >
            Remove {competitor.name}?
          </h2>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            disabled={submitting}
            aria-label="Close"
            className="rounded-lg p-2 text-muted transition-colors duration-220 hover:bg-charcoal-50 hover:text-charcoal disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4 px-5 py-5">
          <p className="text-sm leading-relaxed text-muted">
            m.rror will stop monitoring this competitor and permanently remove its saved signals and
            monitoring history.
          </p>
          {submitError && <p className="text-sm text-semantic-threat">{submitError}</p>}
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-ink-border px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="rounded-[10px] px-4 py-2 text-sm font-medium text-muted transition hover:text-navy disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => void handleRemove()}
            disabled={submitting}
            className="hover-lift inline-flex items-center gap-2 rounded-[10px] bg-semantic-threat px-5 py-2.5 text-sm font-semibold text-surface shadow-soft disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {submitting ? 'Removing…' : 'Remove competitor'}
          </button>
        </div>
      </div>
    </div>
  );
}
