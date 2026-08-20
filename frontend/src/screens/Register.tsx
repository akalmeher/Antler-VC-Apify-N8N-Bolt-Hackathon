import { useState } from 'react';
import { AuthShell } from '@/components/AuthShell';
import { useAuth } from '@/lib/AuthContext';
import { inputClass, isValidEmail } from '@/lib/forms';

export function Register({
  onHome,
  onLogin,
  onSuccess,
}: {
  onHome: () => void;
  onLogin: () => void;
  onSuccess: () => void;
}) {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [restaurant, setRestaurant] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!name.trim()) {
      setError('Enter your name.');
      return;
    }
    if (!restaurant.trim()) {
      setError('Enter your restaurant name.');
      return;
    }
    if (!isValidEmail(email)) {
      setError('Enter a valid email address.');
      return;
    }
    if (password.length < 8) {
      setError('Use at least 8 characters for your password.');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    setSubmitting(true);
    try {
      register({ name, restaurant, email, password });
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not create the account.');
      setSubmitting(false);
    }
  };

  return (
    <AuthShell
      onHome={onHome}
      aside={
        <button
          onClick={onLogin}
          className="text-sm font-semibold text-charcoal transition-colors duration-220 hover:text-brand-sage"
        >
          Log in
        </button>
      }
    >
      <p className="animate-text-in text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">
        Get started
      </p>
      <h1 className="animate-text-in mt-3 font-serif text-3xl font-semibold tracking-tight text-navy stagger-text-2">
        Create your account
      </h1>
      <p className="animate-text-in mt-3 text-sm leading-relaxed text-muted stagger-text-3">
        Then add the restaurants you actually compete with.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-8 space-y-4 rounded-2xl border border-ink-border bg-surface p-5 shadow-soft sm:p-6"
      >
        <div>
          <label className="mb-1.5 block text-sm font-medium text-navy-500">Your name</label>
          <input
            className={inputClass}
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Maria Chen"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-navy-500">Restaurant</label>
          <input
            className={inputClass}
            value={restaurant}
            onChange={(e) => setRestaurant(e.target.value)}
            placeholder="Taco Fuego"
          />
        </div>
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
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 8 characters"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-navy-500">Confirm password</label>
          <input
            className={inputClass}
            type="password"
            autoComplete="new-password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />
        </div>
        {error && <p className="text-sm text-semantic-threat">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="hover-lift w-full rounded-[10px] bg-navy py-2.5 text-sm font-semibold text-surface shadow-soft disabled:opacity-60"
        >
          {submitting ? 'Creating account…' : 'Create account'}
        </button>
      </form>
    </AuthShell>
  );
}
