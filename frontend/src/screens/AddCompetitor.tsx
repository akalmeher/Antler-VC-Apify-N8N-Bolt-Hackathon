import { useState } from 'react';
import { Plus, Trash2, Loader2 } from 'lucide-react';
import { useRadar } from '@/lib/RadarContext';
import { useNav } from '@/lib/nav';
import { isValidUrl } from '@/lib/format';
import { ErrorState } from '@/components/States';
import { SectionHeader } from '@/components/SectionHeader';
import { NearbyDiscovery } from '@/components/NearbyDiscovery';
import { inputClass } from '@/lib/forms';

type AddMode = 'discover' | 'manual';

const MODES: { id: AddMode; label: string }[] = [
  { id: 'discover', label: 'Discover nearby' },
  { id: 'manual', label: 'Add manually' },
];

function ManualCompetitorForm() {
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
    <div className="space-y-6">
      {submitError && <ErrorState message={submitError} />}

      <form
        onSubmit={handleSubmit}
        className="space-y-5 rounded-2xl border border-ink-border bg-surface p-5 shadow-soft sm:p-6"
      >
        <p className="text-sm text-muted">Add a business you want m.rror to watch.</p>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-navy-500">Competitor name</label>
          <input
            className={inputClass}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Vaquero Taqueria"
          />
          {touched && nameError && <p className="mt-1 text-xs text-semantic-threat">{nameError}</p>}
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
          {touched && urlError && <p className="mt-1 text-xs text-semantic-threat">{urlError}</p>}
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-navy-500">Pages to monitor</label>
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
                    placeholder="https://vaquero.example/menu"
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
            className="hover-lift inline-flex items-center gap-2 rounded-[10px] bg-navy px-5 py-2.5 text-sm font-semibold text-surface shadow-soft disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {submitting ? 'Starting scan…' : 'Start scan'}
          </button>
        </div>
      </form>
    </div>
  );
}

export function AddCompetitor() {
  const [mode, setMode] = useState<AddMode>('discover');

  return (
    <div className={`mx-auto space-y-8 ${mode === 'discover' ? 'max-w-4xl' : 'max-w-2xl'}`}>
      <SectionHeader
        as="h1"
        eyebrow="Watchlist"
        title="Who’s entering your reflection?"
        description="Discover nearby businesses competing for the same customers, then choose which ones m.rror should watch."
      />

      <div className="inline-flex rounded-[12px] border border-ink-border bg-surface p-1 shadow-soft">
        {MODES.map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => setMode(m.id)}
            className={`rounded-[9px] px-4 py-2 text-sm font-medium transition-colors duration-220 ${
              mode === m.id
                ? 'bg-semantic-opportunityBg text-charcoal'
                : 'text-muted hover:text-charcoal'
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* Both stay mounted so search results and form entries survive a tab switch. */}
      <div className={mode === 'discover' ? undefined : 'hidden'}>
        <NearbyDiscovery />
      </div>
      <div className={mode === 'manual' ? undefined : 'hidden'}>
        <ManualCompetitorForm />
      </div>
    </div>
  );
}
