import { useEffect, useRef, useState } from 'react';
import { AlertTriangle, Loader2, Plus, Trash2, X } from 'lucide-react';
import { editCompetitor } from '@/lib/api';
import { inputClass } from '@/lib/forms';
import { isValidUrl } from '@/lib/format';
import type { Competitor, EditCompetitorResponse } from '@/lib/types';

function normalizeMonitorUrl(value: string): string {
  return value.trim().replace(/\/+$/, '').toLowerCase();
}

function urlsChanged(
  competitor: Competitor,
  url: string,
  pageUrls: string[],
): boolean {
  if (normalizeMonitorUrl(competitor.url) !== normalizeMonitorUrl(url)) return true;
  if (competitor.page_urls.length !== pageUrls.length) return true;
  return competitor.page_urls.some(
    (page, i) => normalizeMonitorUrl(page) !== normalizeMonitorUrl(pageUrls[i] ?? ''),
  );
}

export function EditCompetitorModal({
  competitor,
  isOpen,
  onClose,
  onSaved,
}: {
  competitor: Competitor;
  isOpen: boolean;
  onClose: () => void;
  onSaved: (result: EditCompetitorResponse) => Promise<void> | void;
}) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const submittingLock = useRef(false);

  const [name, setName] = useState(competitor.name);
  const [url, setUrl] = useState(competitor.url);
  const [pageUrls, setPageUrls] = useState<string[]>(
    competitor.page_urls.length > 0 ? [...competitor.page_urls] : [''],
  );
  const [touched, setTouched] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    setName(competitor.name);
    setUrl(competitor.url);
    setPageUrls(competitor.page_urls.length > 0 ? [...competitor.page_urls] : ['']);
    setTouched(false);
    setSubmitting(false);
    setSubmitError(null);
    submittingLock.current = false;
  }, [isOpen, competitor]);

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

  const trimmedName = name.trim();
  const trimmedUrl = url.trim();
  const trimmedPages = pageUrls.map((p) => p.trim());
  const nameError = trimmedName === '' ? 'Please enter the competitor name.' : null;
  const urlError = !isValidUrl(trimmedUrl)
    ? 'Please enter a valid web address starting with http.'
    : null;
  const pageErrors = trimmedPages.map((p) =>
    p === ''
      ? 'Please enter a page address.'
      : !isValidUrl(p)
        ? 'This does not look like a web address.'
        : null,
  );
  const valid =
    !nameError &&
    !urlError &&
    !pageErrors.some(Boolean) &&
    trimmedPages.length >= 1 &&
    trimmedPages.length <= 3;
  const historyReset = urlsChanged(competitor, trimmedUrl, trimmedPages);
  const canSave = valid && !submitting;

  const updatePage = (i: number, value: string) =>
    setPageUrls((prev) => prev.map((p, idx) => (idx === i ? value : p)));
  const addPage = () => setPageUrls((prev) => (prev.length < 3 ? [...prev, ''] : prev));
  const removePage = (i: number) =>
    setPageUrls((prev) => (prev.length > 1 ? prev.filter((_, idx) => idx !== i) : prev));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    setSubmitError(null);
    if (!valid || submittingLock.current) return;
    submittingLock.current = true;
    setSubmitting(true);
    try {
      const result = await editCompetitor({
        competitor_id: competitor.id,
        name: trimmedName,
        url: trimmedUrl,
        page_urls: trimmedPages,
      });
      await onSaved(result);
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : 'We could not save this competitor. Please try again.',
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
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-competitor-title"
        className="relative z-10 flex max-h-full w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-ink-border bg-surface shadow-lift animate-modal-in"
      >
        <div className="flex items-start justify-between gap-3 border-b border-ink-border px-5 py-4">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
              Watchlist
            </p>
            <h2
              id="edit-competitor-title"
              className="mt-1 font-serif text-lg font-semibold leading-snug tracking-tight text-charcoal"
            >
              Edit competitor
            </h2>
          </div>
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

        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
          <div className="space-y-5 overflow-y-auto px-5 py-5">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-navy-500">
                Competitor name
              </label>
              <input
                className={inputClass}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              {touched && nameError && (
                <p className="mt-1 text-xs text-semantic-threat">{nameError}</p>
              )}
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-navy-500">
                Website
              </label>
              <input
                className={inputClass}
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                inputMode="url"
              />
              {touched && urlError && (
                <p className="mt-1 text-xs text-semantic-threat">{urlError}</p>
              )}
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-navy-500">
                Pages to monitor
              </label>
              <p className="mb-2.5 text-xs text-muted">
                Up to 3 pages. Pricing, offerings and promotions pages work best.
              </p>
              <div className="space-y-2">
                {pageUrls.map((p, i) => (
                  <div key={i}>
                    <div className="flex items-center gap-2">
                      <input
                        className={inputClass}
                        value={p}
                        onChange={(e) => updatePage(i, e.target.value)}
                        inputMode="url"
                      />
                      {pageUrls.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removePage(i)}
                          className="shrink-0 rounded-[10px] border border-ink-border p-2.5 text-navy-200 transition-colors duration-220 hover:border-semantic-threatBorder hover:bg-semantic-threatBg hover:text-semantic-threat"
                          aria-label="Remove page"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                    {touched && pageErrors[i] && (
                      <p className="mt-1 text-xs text-semantic-threat">{pageErrors[i]}</p>
                    )}
                  </div>
                ))}
              </div>
              {pageUrls.length < 3 && (
                <button
                  type="button"
                  onClick={addPage}
                  className="mt-2.5 inline-flex items-center gap-1.5 text-sm font-medium text-charcoal hover:text-brand-sage"
                >
                  <Plus className="h-4 w-4" /> Add page URL
                </button>
              )}
            </div>

            {historyReset && (
              <div className="flex items-start gap-2.5 rounded-xl border border-semantic-warningBorder bg-semantic-warningBg px-3.5 py-3 text-sm text-brand-dusty">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                <p>
                  Changing monitored URLs will reset this competitor's monitoring history and
                  establish a fresh baseline.
                </p>
              </div>
            )}

            {submitError && (
              <p className="text-sm text-semantic-threat">{submitError}</p>
            )}
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
              type="submit"
              disabled={!canSave}
              className="hover-lift inline-flex items-center gap-2 rounded-[10px] bg-navy px-5 py-2.5 text-sm font-semibold text-surface shadow-soft disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {submitting ? 'Saving…' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
