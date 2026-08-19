import { LayoutDashboard, Store, Zap, Plus } from 'lucide-react';
import { useNav, type Route } from '@/lib/nav';
import { useRadar } from '@/lib/RadarContext';

const LINKS: { route: Route; label: string; icon: typeof LayoutDashboard }[] = [
  { route: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { route: 'competitors', label: 'Competitors', icon: Store },
  { route: 'signals', label: 'Signals', icon: Zap },
];

export function Nav() {
  const { route, navigate } = useNav();
  const { business } = useRadar();

  return (
    <header className="sticky top-0 z-20 border-b border-ink-border bg-ink-bg/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6">
        <button
          onClick={() => navigate('dashboard')}
          className="flex items-center gap-2.5 text-left"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-navy text-white">
            <span className="text-[15px] font-extrabold tracking-tight">m</span>
          </span>
          <span className="leading-tight">
            <span className="block text-[15px] font-bold tracking-tight text-navy">m.rror</span>
            {business && (
              <span className="block text-[11px] font-medium uppercase tracking-[0.12em] text-navy-400">
                {business.name}
              </span>
            )}
          </span>
        </button>

        <nav className="flex items-center gap-1">
          {LINKS.map(({ route: r, label, icon: Icon }) => {
            const active = route === r;
            return (
              <button
                key={r}
                onClick={() => navigate(r)}
                className={`inline-flex items-center gap-2 rounded-[10px] px-3 py-2 text-sm font-medium transition-colors ${
                  active
                    ? 'bg-brand-blue/10 text-brand-blue'
                    : 'text-navy-400 hover:bg-navy-50 hover:text-navy'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{label}</span>
              </button>
            );
          })}
          <button
            onClick={() => navigate('add')}
            className={`ml-1 inline-flex items-center gap-2 rounded-[10px] px-3.5 py-2 text-sm font-semibold text-white shadow-sm transition-all ${
              route === 'add'
                ? 'bg-navy'
                : 'bg-brand-blue hover:bg-brand-blue/90'
            }`}
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Add competitor</span>
          </button>
        </nav>
      </div>
    </header>
  );
}
