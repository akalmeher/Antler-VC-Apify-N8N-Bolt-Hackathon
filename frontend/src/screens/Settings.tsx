import { useAuth, type AppSettings } from '@/lib/AuthContext';
import { SectionHeader } from '@/components/SectionHeader';

function Toggle({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (next: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="flex w-full items-start justify-between gap-4 rounded-xl border border-ink-border bg-ink-bg px-4 py-3.5 text-left transition-colors duration-220 hover:border-charcoal-200"
    >
      <span>
        <span className="block text-sm font-semibold text-navy">{label}</span>
        <span className="mt-0.5 block text-sm text-muted">{description}</span>
      </span>
      <span
        className={`relative mt-0.5 h-6 w-10 shrink-0 rounded-full transition-colors duration-220 ${
          checked ? 'bg-brand-sage' : 'bg-navy-200'
        }`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-surface shadow-soft transition-transform duration-220 ${
            checked ? 'translate-x-[18px]' : 'translate-x-0.5'
          }`}
        />
      </span>
    </button>
  );
}

const DIGESTS: { id: AppSettings['digest']; label: string; hint: string }[] = [
  { id: 'off', label: 'Off', hint: 'Only in the app' },
  { id: 'daily', label: 'Daily', hint: 'Morning brief' },
  { id: 'weekly', label: 'Weekly', hint: 'Monday recap' },
];

export function Settings() {
  const { settings, updateSettings } = useAuth();

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <SectionHeader
        as="h1"
        eyebrow="Preferences"
        title="Settings"
        description="How m.rror should notify you. These stay on this device and do not change scans or webhooks."
      />

      <section className="space-y-3 rounded-2xl border border-ink-border bg-surface p-5 shadow-soft sm:p-6">
        <h2 className="font-serif text-lg font-semibold text-navy">Email digest</h2>
        <p className="text-sm text-muted">A short roundup of new signals, when you want it.</p>
        <div className="grid gap-2 sm:grid-cols-3">
          {DIGESTS.map((option) => {
            const active = settings.digest === option.id;
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => updateSettings({ digest: option.id })}
                className={`rounded-xl border px-3 py-3 text-left transition-colors duration-220 ${
                  active
                    ? 'border-brand-sage bg-semantic-opportunityBg text-charcoal'
                    : 'border-ink-border bg-ink-bg text-muted hover:border-charcoal-200 hover:text-charcoal'
                }`}
              >
                <span className="block text-sm font-semibold">{option.label}</span>
                <span className="mt-0.5 block text-xs">{option.hint}</span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="space-y-3 rounded-2xl border border-ink-border bg-surface p-5 shadow-soft sm:p-6">
        <h2 className="font-serif text-lg font-semibold text-navy">Alerts</h2>
        <Toggle
          label="High-impact threats"
          description="Reputation and competitive risks that can cost you guests."
          checked={settings.alertHighImpact}
          onChange={(alertHighImpact) => updateSettings({ alertHighImpact })}
        />
        <Toggle
          label="Pricing and menu changes"
          description="When a watched competitor moves a price, bundle, or special."
          checked={settings.alertPricing}
          onChange={(alertPricing) => updateSettings({ alertPricing })}
        />
      </section>
    </div>
  );
}
