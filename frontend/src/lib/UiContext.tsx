import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

interface UiContextValue {
  selectedCompetitorId: string | null;
  openCompetitor: (id: string) => void;
  closeCompetitor: () => void;
}

const UiContext = createContext<UiContextValue | null>(null);

export function UiProvider({ children }: { children: ReactNode }) {
  const [selectedCompetitorId, setSelectedCompetitorId] = useState<string | null>(null);
  const value = useMemo(
    () => ({
      selectedCompetitorId,
      openCompetitor: (id: string) => setSelectedCompetitorId(id),
      closeCompetitor: () => setSelectedCompetitorId(null),
    }),
    [selectedCompetitorId],
  );
  return <UiContext.Provider value={value}>{children}</UiContext.Provider>;
}

export function useUi(): UiContextValue {
  const ctx = useContext(UiContext);
  if (!ctx) throw new Error('useUi must be used within UiProvider');
  return ctx;
}
