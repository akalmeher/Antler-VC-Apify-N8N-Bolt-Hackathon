import { LayoutDashboard, Store, Zap, Plus } from 'lucide-react';
import { useNav, type Route } from '@/lib/nav';
import { useRadar } from '@/lib/RadarContext';
import { BrandLockup } from '@/components/BrandMark';
import { LocationBadge } from '@/components/LocationBadge';

const LINKS: { route: Route; label: string; icon: typeof LayoutDashboard }[] = [
  { route: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { route: 'competitors', label: 'Competitors', icon: Store },
  { route: 'signals', label: 'Signals', icon: Zap },
  { route: 'add', label: 'Add competitor', icon: Plus },
];

export function Nav() {
  const { route, navigate } = useNav();
  const { business } = useRadar();

  return (
    <header className="sticky top-0 z-30 border-b border-ink-border bg-ink-bg/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <button
            onClick={() => navigate('dashboard')}
            className="shrink-0 text-left"
            aria-label="m.rror home"
          >
            <BrandLockup />
          </button>
          <LocationBadge business={business} />
        </div>

        <nav
          className="flex overflow-hidden rounded-2xl border border-ink-border bg-white shadow-[0_1px_2px_rgba(16,35,52,0.04),0_8px_20px_-14px_rgba(16,35,52,0.18)]"
          aria-label="Primary"
        >
          {LINKS.map(({ route: r, label, icon: Icon }, i) => {
            const active = route === r;
            return (
              <div key={r} className="flex items-stretch">
                {i > 0 && <span className="w-px shrink-0 bg-ink-border" aria-hidden />}
                <button
                  onClick={() => navigate(r)}
                  className={`inline-flex items-center gap-2 px-4 py-3 text-sm transition-colors sm:px-6 ${
                    active
                      ? 'bg-brand-blue/10 font-semibold text-navy'
                      : 'font-medium text-muted hover:bg-[#F7F9FB] hover:text-navy'
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="hidden sm:inline">{label}</span>
                </button>
              </div>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
