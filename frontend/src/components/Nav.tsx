import { LayoutDashboard, Store, Zap, Plus } from 'lucide-react';
import { useNav, type Route } from '@/lib/nav';
import { AccountMenu } from '@/components/AccountMenu';

const LOCKUP_SRC = '/mrror-logo+icon.svg';

const LINKS: { route: Route; label: string; icon: typeof LayoutDashboard }[] = [
  { route: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { route: 'competitors', label: 'Competitors', icon: Store },
  { route: 'signals', label: 'Signals', icon: Zap },
  { route: 'add', label: 'Add competitor', icon: Plus },
];

function NavDivider() {
  return (
    <span
      aria-hidden
      className="mx-1 h-4 w-px shrink-0 self-center border-l border-ink-border sm:mx-2"
    />
  );
}

export function Nav() {
  const { route, navigate } = useNav();

  return (
    <header className="sticky top-0 z-30 border-b border-ink-border bg-ink-bg/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex min-w-0 flex-1 items-center">
          <button
            onClick={() => navigate('dashboard')}
            className="shrink-0 text-left"
            aria-label="m.rror home"
          >
            <img
              src={LOCKUP_SRC}
              alt="m.rror"
              className="h-auto w-[7.25rem] sm:w-[8.5rem]"
            />
          </button>
        </div>

        <nav className="flex shrink-0 items-center" aria-label="Primary">
          <NavDivider />
          {LINKS.map(({ route: r, label, icon: Icon }) => {
            const active = route === r;
            return (
              <div key={r} className="flex items-center">
                <button
                  onClick={() => navigate(r)}
                  className={`relative inline-flex cursor-pointer items-center gap-1.5 whitespace-nowrap px-5 py-1.5 text-base tracking-tight transition-[color,transform] duration-200 sm:px-7 lg:px-8 ${
                    active
                      ? 'font-bold text-charcoal'
                      : 'font-semibold text-muted hover:-translate-y-0.5 hover:text-brand-sage'
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0 lg:hidden" />
                  <span className="hidden lg:inline">{label}</span>
                  {active && (
                    <span
                      aria-hidden
                      className="absolute inset-x-5 -bottom-0.5 h-px bg-brand-sage sm:inset-x-7"
                    />
                  )}
                </button>
                <NavDivider />
              </div>
            );
          })}
        </nav>

        <div className="flex min-w-0 flex-1 justify-end">
          <AccountMenu />
        </div>
      </div>
    </header>
  );
}
