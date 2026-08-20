import { useState } from 'react';
import { NavContext, type Route, type SignalsFilters } from '@/lib/nav';
import { missingEnvKeys } from '@/lib/config';
import { RadarProvider } from '@/lib/RadarContext';
import { UiProvider } from '@/lib/UiContext';
import { Nav } from '@/components/Nav';
import { BrandLockup } from '@/components/BrandMark';
import { CompetitorDrawer } from '@/components/CompetitorDrawer';
import { Dashboard } from '@/screens/Dashboard';
import { Competitors } from '@/screens/Competitors';
import { Signals } from '@/screens/Signals';
import { AddCompetitor } from '@/screens/AddCompetitor';

function SetupScreen({ missing }: { missing: string[] }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-ink-bg px-4">
      <div className="max-w-md rounded-[14px] border border-ink-border bg-white p-6">
        <div className="mb-5">
          <BrandLockup />
        </div>
        <h1 className="text-lg font-bold tracking-tight text-navy">Finish the setup</h1>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          m.rror needs a few connection details before it can load. Add the following to
          your <code className="rounded bg-navy-50 px-1 py-0.5 text-xs text-navy">.env</code> file, then
          reload:
        </p>
        <ul className="mt-3 space-y-1">
          {missing.map((k) => (
            <li key={k} className="rounded-[8px] bg-navy-50 px-3 py-1.5 font-mono text-xs text-navy-500">
              {k}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function App() {
  const [route, setRoute] = useState<Route>('dashboard');
  const [signalsFilters, setSignalsFilters] = useState<SignalsFilters>({});

  const missing = missingEnvKeys();
  if (missing.length > 0) return <SetupScreen missing={missing} />;

  const navigate = (next: Route, filters: SignalsFilters = {}) => {
    setSignalsFilters(next === 'signals' ? filters : {});
    setRoute(next);
    window.scrollTo({ top: 0 });
  };

  return (
    <NavContext.Provider value={{ route, navigate, signalsFilters }}>
      <RadarProvider>
        <UiProvider>
          <div className="min-h-screen bg-ink-bg text-navy">
            <Nav />
            <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
              {route === 'dashboard' && <Dashboard />}
              {route === 'competitors' && <Competitors />}
              {route === 'signals' && <Signals />}
              {route === 'add' && <AddCompetitor />}
            </main>
            <CompetitorDrawer />
          </div>
        </UiProvider>
      </RadarProvider>
    </NavContext.Provider>
  );
}
