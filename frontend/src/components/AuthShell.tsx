import type { ReactNode } from 'react';
import { BrandLockup } from '@/components/BrandMark';

export function AuthShell({
  children,
  onHome,
  aside,
}: {
  children: ReactNode;
  onHome: () => void;
  aside?: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-ink-bg text-charcoal">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-6 sm:px-6">
        <button onClick={onHome} className="text-left" aria-label="m.rror home">
          <BrandLockup />
        </button>
        {aside}
      </header>
      <main className="mx-auto flex max-w-md flex-col px-4 pb-20 sm:px-6">
        {children}
      </main>
    </div>
  );
}
