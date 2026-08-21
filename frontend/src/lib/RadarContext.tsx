import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import {
  fetchBusiness,
  fetchCompetitor,
  fetchCompetitors,
  fetchSignals,
  requestAddCompetitor,
  requestRescan,
  rescanAllCompetitors,
} from '@/lib/api';
import { countCheckedSince } from '@/lib/insights';
import type { Business, Competitor, SignalWithCompetitor } from '@/lib/types';

const POLL_MS = 3000;
const MAX_POLLS = 60; // ~3 minutes

const RESCAN_ALL_KEY = '__rescan_all__';
const RESCAN_ALL_POLL_MS = 5000;
const MAX_RESCAN_ALL_POLLS = 300; // ~25 minutes; batches run sequentially
const RESCAN_ALL_COOLDOWN_MS = 60000;

type ScanPhase = 'scanning' | 'done' | 'timeout' | 'error';

export interface ScanState {
  phase: ScanPhase;
  message: string;
}

export interface AddScanState {
  phase: 'searching' | 'scanning' | 'done' | 'timeout' | 'error';
  message: string;
  competitorId?: string;
}

export interface RescanAllState {
  startedAt: string;
  /** Parsed once so the poller and the UI measure progress against the same instant. */
  startedAtMs: number;
  queuedCount: number;
  phase: 'running' | 'done' | 'timeout';
}

interface RadarContextValue {
  business: Business | null;
  competitors: Competitor[];
  signals: SignalWithCompetitor[];
  loading: boolean;
  error: string | null;
  reload: () => Promise<void>;
  scanStates: Record<string, ScanState>;
  clearScanState: (id: string) => void;
  addScan: AddScanState | null;
  clearAddScan: () => void;
  startRescan: (competitorId: string) => Promise<void>;
  startAddCompetitor: (input: { name: string; url: string; page_urls: string[] }) => Promise<void>;
  rescanAll: RescanAllState | null;
  rescanAllCooldown: boolean;
  startRescanAll: () => Promise<void>;
  clearRescanAll: () => void;
}

const RadarContext = createContext<RadarContextValue | null>(null);

function normalizeUrl(value: string): string {
  return value.trim().replace(/\/+$/, '').toLowerCase();
}

export function RadarProvider({ children }: { children: ReactNode }) {
  const [business, setBusiness] = useState<Business | null>(null);
  const [competitors, setCompetitors] = useState<Competitor[]>([]);
  const [signals, setSignals] = useState<SignalWithCompetitor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [scanStates, setScanStates] = useState<Record<string, ScanState>>({});
  const [addScan, setAddScan] = useState<AddScanState | null>(null);
  const [rescanAll, setRescanAll] = useState<RescanAllState | null>(null);
  const [rescanAllCooldown, setRescanAllCooldown] = useState(false);
  const cooldownTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const signalsRef = useRef<SignalWithCompetitor[]>([]);
  signalsRef.current = signals;
  const timers = useRef<Map<string, ReturnType<typeof setInterval>>>(new Map());

  const clearTimer = useCallback((key: string) => {
    const t = timers.current.get(key);
    if (t) {
      clearInterval(t);
      timers.current.delete(key);
    }
  }, []);

  useEffect(() => {
    const map = timers.current;
    return () => {
      map.forEach((t) => clearInterval(t));
      map.clear();
      if (cooldownTimer.current) clearTimeout(cooldownTimer.current);
    };
  }, []);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [b, c, s] = await Promise.all([fetchBusiness(), fetchCompetitors(), fetchSignals()]);
      setBusiness(b);
      setCompetitors(c);
      setSignals(s);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong loading your data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  const upsertCompetitor = useCallback((row: Competitor) => {
    setCompetitors((prev) => prev.map((c) => (c.id === row.id ? row : c)));
  }, []);

  const clearScanState = useCallback((id: string) => {
    setScanStates((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }, []);

  const clearAddScan = useCallback(() => setAddScan(null), []);

  const pollUntilSettled = useCallback(
    (id: string) => {
      const baseline = signalsRef.current.filter((s) => s.competitor_id === id).length;
      setScanStates((prev) => ({
        ...prev,
        [id]: { phase: 'scanning', message: 'Scanning now. This usually takes 30 to 90 seconds.' },
      }));
      setCompetitors((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status: 'scanning' } : c)),
      );

      clearTimer(id);
      let polls = 0;
      const timer = setInterval(async () => {
        polls += 1;
        if (polls > MAX_POLLS) {
          clearTimer(id);
          setScanStates((prev) => ({
            ...prev,
            [id]: {
              phase: 'timeout',
              message: 'Still working. The scan is taking longer than usual — refresh in a minute to check.',
            },
          }));
          return;
        }
        try {
          const row = await fetchCompetitor(id);
          if (!row) return;
          upsertCompetitor(row);
          if (row.status === 'scanning' || row.status === 'pending') return;

          clearTimer(id);
          if (row.status === 'error') {
            setScanStates((prev) => ({
              ...prev,
              [id]: { phase: 'error', message: row.last_error || 'The scan failed. Check the page addresses and try again.' },
            }));
            return;
          }
          const fresh = await fetchSignals();
          setSignals(fresh);
          const newCount = fresh.filter((s) => s.competitor_id === id).length;
          setScanStates((prev) => ({
            ...prev,
            [id]:
              newCount > baseline
                ? { phase: 'done', message: 'Scan finished. New signals are in your feed.' }
                : { phase: 'done', message: 'Scan finished. No meaningful changes since last time.' },
          }));
        } catch {
          // transient read error — keep polling until timeout
        }
      }, POLL_MS);
      timers.current.set(id, timer);
    },
    [clearTimer, upsertCompetitor],
  );

  const startRescan = useCallback(
    async (competitorId: string) => {
      clearScanState(competitorId);
      await requestRescan(competitorId);
      pollUntilSettled(competitorId);
    },
    [clearScanState, pollUntilSettled],
  );

  const refreshWatchlist = useCallback(async (): Promise<Competitor[]> => {
    const [list, fresh] = await Promise.all([fetchCompetitors(), fetchSignals()]);
    setCompetitors(list);
    setSignals(fresh);
    return list;
  }, []);

  const beginRescanAllCooldown = useCallback(() => {
    setRescanAllCooldown(true);
    if (cooldownTimer.current) clearTimeout(cooldownTimer.current);
    cooldownTimer.current = setTimeout(() => setRescanAllCooldown(false), RESCAN_ALL_COOLDOWN_MS);
  }, []);

  const pollRescanAll = useCallback(
    (startedAtMs: number, queuedCount: number) => {
      clearTimer(RESCAN_ALL_KEY);
      let polls = 0;
      let inFlight = false;

      const tick = async () => {
        if (inFlight) return;
        polls += 1;
        if (polls > MAX_RESCAN_ALL_POLLS) {
          clearTimer(RESCAN_ALL_KEY);
          setRescanAll((prev) => (prev ? { ...prev, phase: 'timeout' } : prev));
          return;
        }
        inFlight = true;
        try {
          const list = await refreshWatchlist();
          if (countCheckedSince(list, startedAtMs) >= queuedCount) {
            clearTimer(RESCAN_ALL_KEY);
            setRescanAll((prev) => (prev ? { ...prev, phase: 'done' } : prev));
            beginRescanAllCooldown();
          }
        } catch {
          // transient read error — keep polling until the cap
        } finally {
          inFlight = false;
        }
      };

      void tick();
      const timer = setInterval(() => {
        void tick();
      }, RESCAN_ALL_POLL_MS);
      timers.current.set(RESCAN_ALL_KEY, timer);
    },
    [beginRescanAllCooldown, clearTimer, refreshWatchlist],
  );

  const startRescanAll = useCallback(async () => {
    if (!business) throw new Error('Your business is still loading. Try again in a moment.');

    const res = await rescanAllCompetitors(business.id);
    if (!res.accepted) {
      throw new Error(res.message || 'The scan service did not accept the request. Please try again.');
    }

    const parsed = new Date(res.started_at).getTime();
    const startedAtMs = Number.isNaN(parsed) ? Date.now() : parsed;
    const queuedCount = Math.max(0, res.queued_count);

    setRescanAll({
      startedAt: res.started_at,
      startedAtMs,
      queuedCount,
      phase: queuedCount === 0 ? 'done' : 'running',
    });
    if (queuedCount === 0) {
      beginRescanAllCooldown();
    } else {
      pollRescanAll(startedAtMs, queuedCount);
    }
  }, [beginRescanAllCooldown, business, pollRescanAll]);

  const clearRescanAll = useCallback(() => {
    clearTimer(RESCAN_ALL_KEY);
    setRescanAll(null);
  }, [clearTimer]);

  const startAddCompetitor = useCallback(
    async (input: { name: string; url: string; page_urls: string[] }) => {
      const before = await fetchCompetitors();
      setCompetitors(before);
      const beforeIds = new Set(before.map((c) => c.id));
      const targetUrl = normalizeUrl(input.url);

      await requestAddCompetitor(input);
      setAddScan({ phase: 'searching', message: 'Scan started. Setting things up…' });

      clearTimer('__add__');
      let polls = 0;
      const timer = setInterval(async () => {
        polls += 1;
        if (polls > MAX_POLLS) {
          clearTimer('__add__');
          setAddScan({
            phase: 'timeout',
            message: 'Still working. The scan is taking longer than usual — refresh in a minute to check.',
          });
          return;
        }
        try {
          const list = await fetchCompetitors();
          setCompetitors(list);
          const fresh = list.filter((c) => !beforeIds.has(c.id));
          if (fresh.length === 0) return;
          const match =
            fresh.find((c) => normalizeUrl(c.url) === targetUrl) ??
            fresh.slice().sort((a, b) => b.created_at.localeCompare(a.created_at))[0];

          clearTimer('__add__');
          setAddScan({ phase: 'scanning', message: 'Found it. Scanning their pages now.', competitorId: match.id });
          pollUntilSettled(match.id);
        } catch {
          // keep polling
        }
      }, POLL_MS);
      timers.current.set('__add__', timer);
    },
    [clearTimer, pollUntilSettled],
  );

  const value: RadarContextValue = {
    business,
    competitors,
    signals,
    loading,
    error,
    reload,
    scanStates,
    clearScanState,
    addScan,
    clearAddScan,
    startRescan,
    startAddCompetitor,
    rescanAll,
    rescanAllCooldown,
    startRescanAll,
    clearRescanAll,
  };

  return <RadarContext.Provider value={value}>{children}</RadarContext.Provider>;
}

export function useRadar(): RadarContextValue {
  const ctx = useContext(RadarContext);
  if (!ctx) throw new Error('useRadar must be used within a RadarProvider');
  return ctx;
}
