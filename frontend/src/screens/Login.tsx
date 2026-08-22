import { useState } from 'react';
import { AuthShell } from '@/components/AuthShell';
import { DEMO_AUTH, useAuth } from '@/lib/AuthContext';
import { inputClass, isValidEmail } from '@/lib/forms';

export function Login({
  onHome,
  onRegister,
  onSuccess,
}: {
  onHome: () => void;
  onRegister: () => void;
  onSuccess: () => void;
}) {
  const { login } = useAuth();
  const [email, setEmail] = useState(DEMO_AUTH.email);
  const [password, setPassword] = useState(DEMO_AUTH.password);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!isValidEmail(email)) {
      setError('Enter a valid email address.');
      return;
    }
    if (!password) {
      setError('Enter your password.');
      return;
    }
    setSubmitting(true);
    try {
      login(email, password);
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not log in.');
      setSubmitting(false);
    }
  };

  return (
    <AuthShell
      onHome={onHome}
      aside={
        <button
          onClick={onRegister}
          className="text-sm font-semibold text-charcoal transition-colors duration-220 hover:text-brand-sage"
        >
          Create an account
        </button>
      }
    >
      <p className="animate-text-in text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">
        Welcome back
      </p>
      <h1 className="animate-text-in mt-3 font-serif text-3xl font-semibold leading-snug tracking-tight text-navy stagger-text-2 sm:text-4xl">
        See what your market is doing.
      </h1>
      <p className="animate-text-in mt-3 text-sm leading-relaxed text-muted stagger-text-3">
        Monitor competitors, catch meaningful changes, and know what to do next.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-8 space-y-4 rounded-2xl border border-ink-border bg-surface p-5 shadow-soft sm:p-6"
      >
        <div>
          <label className="mb-1.5 block text-sm font-medium text-navy-500">Email</label>
          <input
            className={inputClass}
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@business.com"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-navy-500">Password</label>
          <input
            className={inputClass}
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error && <p className="text-sm text-semantic-threat">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="hover-lift w-full rounded-[10px] bg-navy py-2.5 text-sm font-semibold text-surface shadow-soft disabled:opacity-60"
        >
          {submitting ? 'Signing in…' : 'Log in'}
        </button>
        <p className="text-center text-sm text-muted">
          New to m.rror?{' '}
          <button
            type="button"
            onClick={onRegister}
            className="font-semibold text-charcoal transition-colors duration-220 hover:text-brand-sage"
          >
            Create an account
          </button>
        </p>
      </form>
    </AuthShell>
  );
}
