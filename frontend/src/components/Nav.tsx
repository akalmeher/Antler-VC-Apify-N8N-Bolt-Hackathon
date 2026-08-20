import { LayoutDashboard, Store, Zap, Plus } from 'lucide-react';
import { useNav, type Route } from '@/lib/nav';
import { useRadar } from '@/lib/RadarContext';
import { BrandIcon } from '@/components/BrandMark';
import { LocationBadge } from '@/components/LocationBadge';
import { AccountMenu } from '@/components/AccountMenu';

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
      <div className="mx-auto flex max-w-6xl items-center gap-2 px-4 py-3 sm:px-6 lg:gap-3">
        <div className="flex min-w-0 items-center gap-2 lg:gap-3">
          <button
            onClick={() => navigate('dashboard')}
            className="shrink-0 text-left"
            aria-label="m.rror home"
          >
            <BrandIcon className="h-8" />
          </button>
          <LocationBadge business={business} />
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-2">
          <nav
            className="flex overflow-hidden rounded-2xl border border-ink-border bg-surface shadow-soft"
            aria-label="Primary"
          >
            {LINKS.map(({ route: r, label, icon: Icon }, i) => {
              const active = route === r;
              return (
                <div key={r} className="flex items-stretch">
                  {i > 0 && <span className="w-px shrink-0 bg-ink-border" aria-hidden />}
                  <button
                    onClick={() => navigate(r)}
                    className={`inline-flex items-center gap-1.5 whitespace-nowrap px-3 py-2.5 text-sm transition-colors duration-220 lg:px-4 xl:px-5 ${
                      active
                        ? 'bg-semantic-opportunityBg font-semibold text-charcoal'
                        : 'font-medium text-muted hover:bg-ink-bg hover:text-charcoal'
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    {r === 'add' ? (
                      <>
                        <span className="hidden lg:inline xl:hidden">Add</span>
                        <span className="hidden xl:inline">Add competitor</span>
                      </>
                    ) : (
                      <span className="hidden lg:inline">{label}</span>
                    )}
                  </button>
                </div>
              );
            })}
          </nav>
          <AccountMenu />
        </div>
      </div>
    </header>
  );
}
