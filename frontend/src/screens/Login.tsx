import { useState } from 'react';
import { AuthShell } from '@/components/AuthShell';
import { useAuth } from '@/lib/AuthContext';
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
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
          Create account
        </button>
      }
    >
      <p className="animate-text-in text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">
        Welcome back
      </p>
      <h1 className="animate-text-in mt-3 font-serif text-3xl font-semibold tracking-tight text-navy stagger-text-2">
        Log in
      </h1>
      <p className="animate-text-in mt-3 text-sm leading-relaxed text-muted stagger-text-3">
        Pick up the watchlist for your restaurant.
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
            placeholder="you@restaurant.com"
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
      </form>
    </AuthShell>
  );
}
