import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

const USERS_KEY = 'mrror.users';
const SESSION_KEY = 'mrror.session';
const SETTINGS_KEY = 'mrror.settings';

export interface AccountProfile {
  email: string;
  name: string;
  restaurant: string;
}

export interface AppSettings {
  digest: 'off' | 'daily' | 'weekly';
  alertHighImpact: boolean;
  alertPricing: boolean;
}

interface StoredUser extends AccountProfile {
  password: string;
}

interface AuthContextValue {
  session: AccountProfile | null;
  settings: AppSettings;
  login: (email: string, password: string) => void;
  register: (input: { name: string; restaurant: string; email: string; password: string }) => void;
  updateProfile: (patch: Partial<Omit<AccountProfile, 'email'>> & { email?: string }) => void;
  updatePassword: (current: string, next: string) => void;
  updateSettings: (patch: Partial<AppSettings>) => void;
  logout: () => void;
}

const DEFAULT_SETTINGS: AppSettings = {
  digest: 'daily',
  alertHighImpact: true,
  alertPricing: true,
};

const AuthContext = createContext<AuthContextValue | null>(null);

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function readUsers(): StoredUser[] {
  return readJson<StoredUser[]>(USERS_KEY, []);
}

function writeUsers(users: StoredUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AccountProfile | null>(() => {
    const stored = readJson<AccountProfile | null>(SESSION_KEY, null);
    return stored?.email ? stored : null;
  });
  const [settings, setSettings] = useState<AppSettings>(() => ({
    ...DEFAULT_SETTINGS,
    ...readJson<Partial<AppSettings>>(SETTINGS_KEY, {}),
  }));

  const persistSession = (profile: AccountProfile | null) => {
    setSession(profile);
    if (profile) localStorage.setItem(SESSION_KEY, JSON.stringify(profile));
    else localStorage.removeItem(SESSION_KEY);
  };

  const login = useCallback((email: string, password: string) => {
    const normalized = email.trim().toLowerCase();
    const user = readUsers().find((u) => u.email === normalized);
    if (!user || user.password !== password) {
      throw new Error('That email or password does not match.');
    }
    persistSession({ email: user.email, name: user.name, restaurant: user.restaurant });
  }, []);

  const register = useCallback(
    (input: { name: string; restaurant: string; email: string; password: string }) => {
      const email = input.email.trim().toLowerCase();
      const users = readUsers();
      if (users.some((u) => u.email === email)) {
        throw new Error('An account with that email already exists. Try logging in.');
      }
      const user: StoredUser = {
        email,
        password: input.password,
        name: input.name.trim(),
        restaurant: input.restaurant.trim(),
      };
      writeUsers([...users, user]);
      persistSession({ email: user.email, name: user.name, restaurant: user.restaurant });
    },
    [],
  );

  const updateProfile = useCallback(
    (patch: Partial<Omit<AccountProfile, 'email'>> & { email?: string }) => {
      if (!session) return;
      const nextEmail = (patch.email ?? session.email).trim().toLowerCase();
      const users = readUsers();
      if (nextEmail !== session.email && users.some((u) => u.email === nextEmail)) {
        throw new Error('That email is already in use.');
      }
      const next: AccountProfile = {
        email: nextEmail,
        name: (patch.name ?? session.name).trim(),
        restaurant: (patch.restaurant ?? session.restaurant).trim(),
      };
      writeUsers(
        users.map((u) => (u.email === session.email ? { ...u, ...next } : u)),
      );
      persistSession(next);
    },
    [session],
  );

  const updatePassword = useCallback(
    (current: string, next: string) => {
      if (!session) return;
      const users = readUsers();
      const user = users.find((u) => u.email === session.email);
      if (!user || user.password !== current) {
        throw new Error('Current password is incorrect.');
      }
      writeUsers(users.map((u) => (u.email === session.email ? { ...u, password: next } : u)));
    },
    [session],
  );

  const updateSettings = useCallback((patch: Partial<AppSettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...patch };
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const logout = useCallback(() => {
    persistSession(null);
  }, []);

  const value = useMemo(
    () => ({
      session,
      settings,
      login,
      register,
      updateProfile,
      updatePassword,
      updateSettings,
      logout,
    }),
    [session, settings, login, register, updateProfile, updatePassword, updateSettings, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
