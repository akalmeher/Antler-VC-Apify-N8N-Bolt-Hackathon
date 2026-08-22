import { useEffect, useRef, useState } from 'react';
import { Building2, ChevronDown, LogOut, Settings, User } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import { businessLocation } from '@/lib/insights';
import { useNav } from '@/lib/nav';
import { useRadar } from '@/lib/RadarContext';

export function AccountMenu() {
  const { session, logout } = useAuth();
  const { route, navigate } = useNav();
  const { business } = useRadar();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('mousedown', onPointer);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('mousedown', onPointer);
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  if (!session) return null;

  const businessName = business?.name ?? session.restaurant;
  const businessPlace = businessLocation(business);
  const initial = (businessName.trim()[0] ?? session.name.trim()[0] ?? session.email[0] ?? 'M').toUpperCase();
  const onAccount = route === 'account' || route === 'settings' || route === 'business';

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`inline-flex items-center gap-2 rounded-2xl border px-2.5 py-1.5 shadow-soft transition-colors duration-220 ${
          onAccount
            ? 'border-ink-border bg-semantic-opportunityBg text-charcoal'
            : 'border-ink-border bg-surface text-navy hover:bg-ink-bg'
        }`}
        aria-expanded={open}
        aria-haspopup="menu"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-navy font-serif text-sm font-semibold text-surface">
          {initial}
        </span>
        <span className="hidden min-w-0 text-left xl:block">
          <span className="block max-w-[10rem] truncate text-sm font-semibold leading-tight">
            {businessName}
          </span>
          {businessPlace && (
            <span className="block max-w-[10rem] truncate text-[11px] font-medium text-muted">
              {businessPlace}
            </span>
          )}
        </span>
        <ChevronDown className={`h-4 w-4 text-muted transition-transform duration-220 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 z-40 mt-2 w-52 overflow-hidden rounded-2xl border border-ink-border bg-surface py-1 shadow-lift animate-fade"
        >
          <p className="truncate px-3.5 py-2 text-xs text-muted">{session.email}</p>
          <span className="mx-3 block h-px bg-ink-border" />
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              navigate('business');
              setOpen(false);
            }}
            className="flex w-full items-center gap-2 px-3.5 py-2.5 text-sm text-navy transition-colors duration-220 hover:bg-ink-bg"
          >
            <Building2 className="h-4 w-4 text-muted" />
            Your Business
          </button>
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              navigate('account');
              setOpen(false);
            }}
            className="flex w-full items-center gap-2 px-3.5 py-2.5 text-sm text-navy transition-colors duration-220 hover:bg-ink-bg"
          >
            <User className="h-4 w-4 text-muted" />
            Account
          </button>
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              navigate('settings');
              setOpen(false);
            }}
            className="flex w-full items-center gap-2 px-3.5 py-2.5 text-sm text-navy transition-colors duration-220 hover:bg-ink-bg"
          >
            <Settings className="h-4 w-4 text-muted" />
            Settings
          </button>
          <span className="mx-3 block h-px bg-ink-border" />
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setOpen(false);
              logout();
            }}
            className="flex w-full items-center gap-2 px-3.5 py-2.5 text-sm text-navy transition-colors duration-220 hover:bg-ink-bg"
          >
            <LogOut className="h-4 w-4 text-muted" />
            Log out
          </button>
        </div>
      )}
    </div>
  );
}
