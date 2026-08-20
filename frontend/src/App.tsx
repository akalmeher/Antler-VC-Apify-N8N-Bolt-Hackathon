import { useEffect, useState } from 'react';
import { NavContext, type Route, type SignalsFilters } from '@/lib/nav';
import { missingEnvKeys } from '@/lib/config';
import { RadarProvider } from '@/lib/RadarContext';
import { UiProvider } from '@/lib/UiContext';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import { Nav } from '@/components/Nav';
import { BrandLockup } from '@/components/BrandMark';
import { CompetitorDrawer } from '@/components/CompetitorDrawer';
import { Dashboard } from '@/screens/Dashboard';
import { Competitors } from '@/screens/Competitors';
import { Signals } from '@/screens/Signals';
import { AddCompetitor } from '@/screens/AddCompetitor';
import { Landing } from '@/screens/Landing';
import { Login } from '@/screens/Login';
import { Register } from '@/screens/Register';
import { Account } from '@/screens/Account';
import { Settings } from '@/screens/Settings';

type PublicView = 'landing' | 'login' | 'register';

function SetupScreen({ missing }: { missing: string[] }) {
  const { logout } = useAuth();
  return (
    <div className="flex min-h-screen items-center justify-center bg-ink-bg px-4">
      <div className="max-w-md rounded-[14px] border border-ink-border bg-surface p-6 shadow-soft">
        <div className="mb-5">
          <BrandLockup />
        </div>
        <h1 className="text-lg font-bold tracking-tight text-navy">Finish the setup</h1>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          m.rror needs a few connection details before it can load. Add the following to
          your <code className="rounded bg-charcoal-50 px-1 py-0.5 text-xs text-charcoal">.env</code> file, then
          reload:
        </p>
        <ul className="mt-3 space-y-1">
          {missing.map((k) => (
            <li key={k} className="rounded-[8px] bg-charcoal-50 px-3 py-1.5 font-mono text-xs text-charcoal-500">
              {k}
            </li>
          ))}
        </ul>
        <button
          type="button"
          onClick={logout}
          className="mt-5 text-sm font-semibold text-charcoal transition-colors duration-220 hover:text-brand-sage"
        >
          Log out
        </button>
      </div>
    </div>
  );
}

function AppShell() {
  const { session } = useAuth();
  const [publicView, setPublicView] = useState<PublicView | null>(() => (session ? null : 'landing'));
  const [route, setRoute] = useState<Route>('dashboard');
  const [signalsFilters, setSignalsFilters] = useState<SignalsFilters>({});

  useEffect(() => {
    if (!session) {
      setPublicView((current) => current ?? 'landing');
      return;
    }
    setPublicView(null);
  }, [session]);

  const enterApp = () => {
    setRoute('dashboard');
    setPublicView(null);
  };

  if (publicView === 'landing') {
    return (
      <Landing
        onEnter={() => setPublicView('register')}
        onLogin={() => setPublicView('login')}
      />
    );
  }

  if (publicView === 'login') {
    return (
      <Login
        onHome={() => setPublicView('landing')}
        onRegister={() => setPublicView('register')}
        onSuccess={enterApp}
      />
    );
  }

  if (publicView === 'register') {
    return (
      <Register
        onHome={() => setPublicView('landing')}
        onLogin={() => setPublicView('login')}
        onSuccess={enterApp}
      />
    );
  }

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
          <div className="min-h-screen bg-ink-bg text-charcoal">
            <Nav />
            <main key={route} className="mx-auto max-w-6xl px-4 py-12 sm:px-6 animate-fade">
              {route === 'dashboard' && <Dashboard />}
              {route === 'competitors' && <Competitors />}
              {route === 'signals' && <Signals />}
              {route === 'add' && <AddCompetitor />}
              {route === 'account' && <Account />}
              {route === 'settings' && <Settings />}
            </main>
            <CompetitorDrawer />
          </div>
        </UiProvider>
      </RadarProvider>
    </NavContext.Provider>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppShell />
    </AuthProvider>
  );
}
