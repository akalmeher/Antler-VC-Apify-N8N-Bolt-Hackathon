import { createContext, useContext } from 'react';

export type Route = 'dashboard' | 'competitors' | 'signals' | 'add';

export interface SignalsFilters {
  competitorId?: string;
}

interface NavContextValue {
  route: Route;
  navigate: (route: Route, filters?: SignalsFilters) => void;
  signalsFilters: SignalsFilters;
}

export const NavContext = createContext<NavContextValue | null>(null);

export function useNav(): NavContextValue {
  const ctx = useContext(NavContext);
  if (!ctx) throw new Error('useNav must be used within NavContext');
  return ctx;
}
