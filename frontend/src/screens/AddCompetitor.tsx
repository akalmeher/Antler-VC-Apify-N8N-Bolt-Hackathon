import { useState } from 'react';
import { Plus, Trash2, Loader2 } from 'lucide-react';
import { useRadar } from '@/lib/RadarContext';
import { useNav } from '@/lib/nav';
import { isValidUrl } from '@/lib/format';
import { ErrorState } from '@/components/States';
import { SectionHeader } from '@/components/SectionHeader';

const inputClass =
  'w-full rounded-[10px] border border-ink-border bg-white px-3.5 py-2.5 text-sm text-navy placeholder:text-navy-200 focus:border-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-blue/15';

export function AddCompetitor() {
  const { startAddCompetitor } = useRadar();
  const { navigate } = useNav();

  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [pageUrls, setPageUrls] = useState<string[]>(['']);
  const [submitting, setSubmitting] = useState(false);
  const [touched, setTouched] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const trimmedPages = pageUrls.map((p) => p.trim());
  const nameError = name.trim() === '' ? 'Please enter the competitor name.' : null;
  const urlError = !isValidUrl(url) ? 'Please enter a valid web address starting with http.' : null;
  const pageErrors = trimmedPages.map((p) =>
    p === '' ? 'Please enter a page address.' : !isValidUrl(p) ? 'This does not look like a web address.' : null,
  );
  const hasPageError = pageErrors.some(Boolean);
  const valid = !nameError && !urlError && !hasPageError && trimmedPages.length >= 1 && trimmedPages.length <= 3;

  const updatePage = (i: number, value: string) =>
    setPageUrls((prev) => prev.map((p, idx) => (idx === i ? value : p)));
  const addPage = () => setPageUrls((prev) => (prev.length < 3 ? [...prev, ''] : prev));
  const removePage = (i: number) =>
    setPageUrls((prev) => (prev.length > 1 ? prev.filter((_, idx) => idx !== i) : prev));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    setSubmitError(null);
    if (!valid) return;
    setSubmitting(true);
    try {
      await startAddCompetitor({
        name: name.trim(),
        url: url.trim(),
        page_urls: trimmedPages,
      });
      navigate('competitors');
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'We could not start the scan. Please try again.');
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <SectionHeader
        as="h1"
        eyebrow="Watchlist"
        title="Add competitor"
        description="Tell us who to watch. We'll scan their pages and start flagging changes worth acting on."
      />

      {submitError && <ErrorState message={submitError} />}

      <form
        onSubmit={handleSubmit}
        className="space-y-5 rounded-2xl border border-ink-border bg-white p-5 shadow-[0_8px_24px_-18px_rgba(16,35,52,0.16)] sm:p-6"
      >
        <div>
          <label className="mb-1.5 block text-sm font-medium text-navy-500">Name</label>
          <input
            className={inputClass}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Vaquero Taqueria"
          />
          {touched && nameError && <p className="mt-1 text-xs text-red-600">{nameError}</p>}
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-navy-500">Website</label>
          <input
            className={inputClass}
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://vaquero.example"
            inputMode="url"
          />
          {touched && urlError && <p className="mt-1 text-xs text-red-600">{urlError}</p>}
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-navy-500">Pages to watch</label>
          <p className="mb-2.5 text-xs text-muted">
            Up to 3 pages. The menu or pricing page works best.
          </p>
          <div className="space-y-2">
            {pageUrls.map((p, i) => (
              <div key={i}>
                <div className="flex items-center gap-2">
                  <input
                    className={inputClass}
                    value={p}
                    onChange={(e) => updatePage(i, e.target.value)}
                    placeholder="https://vaquero.example/menu"
                    inputMode="url"
                  />
                  {pageUrls.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removePage(i)}
                      className="shrink-0 rounded-[10px] border border-ink-border p-2.5 text-navy-200 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                      aria-label="Remove page"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
                {touched && pageErrors[i] && (
                  <p className="mt-1 text-xs text-red-600">{pageErrors[i]}</p>
                )}
              </div>
            ))}
          </div>

          {pageUrls.length < 3 && (
            <button
              type="button"
              onClick={addPage}
              className="mt-2.5 inline-flex items-center gap-1.5 text-sm font-medium text-brand-blue hover:text-brand-cyan"
            >
              <Plus className="h-4 w-4" /> Add page URL
            </button>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-ink-border pt-5">
          <button
            type="button"
            onClick={() => navigate('competitors')}
            className="rounded-[10px] px-4 py-2 text-sm font-medium text-muted transition hover:text-navy"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center gap-2 rounded-[10px] bg-brand-blue px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-blue/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {submitting ? 'Starting scan…' : 'Start scan'}
          </button>
        </div>
      </form>
    </div>
  );
}
