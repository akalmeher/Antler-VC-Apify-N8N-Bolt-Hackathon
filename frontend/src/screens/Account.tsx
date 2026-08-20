import { useState } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { inputClass, isValidEmail } from '@/lib/forms';
import { SectionHeader } from '@/components/SectionHeader';
import { ErrorState } from '@/components/States';

export function Account() {
  const { session, updateProfile, updatePassword, logout } = useAuth();
  const [name, setName] = useState(session?.name ?? '');
  const [restaurant, setRestaurant] = useState(session?.restaurant ?? '');
  const [email, setEmail] = useState(session?.email ?? '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [nextPassword, setNextPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [profileError, setProfileError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [profileSaved, setProfileSaved] = useState(false);
  const [passwordSaved, setPasswordSaved] = useState(false);

  if (!session) return <ErrorState message="You need to be logged in to view this page." />;

  const saveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileError(null);
    setProfileSaved(false);
    if (!name.trim() || !restaurant.trim()) {
      setProfileError('Name and restaurant are required.');
      return;
    }
    if (!isValidEmail(email)) {
      setProfileError('Enter a valid email address.');
      return;
    }
    try {
      updateProfile({ name, restaurant, email });
      setProfileSaved(true);
    } catch (err) {
      setProfileError(err instanceof Error ? err.message : 'Could not save.');
    }
  };

  const savePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSaved(false);
    if (nextPassword.length < 8) {
      setPasswordError('Use at least 8 characters for the new password.');
      return;
    }
    if (nextPassword !== confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }
    try {
      updatePassword(currentPassword, nextPassword);
      setCurrentPassword('');
      setNextPassword('');
      setConfirmPassword('');
      setPasswordSaved(true);
    } catch (err) {
      setPasswordError(err instanceof Error ? err.message : 'Could not update password.');
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <SectionHeader
        as="h1"
        eyebrow="Account"
        title="Your profile"
        description="How you appear in m.rror. This stays on this device; it does not change the restaurant we scan for."
      />

      <form
        onSubmit={saveProfile}
        className="space-y-4 rounded-2xl border border-ink-border bg-surface p-5 shadow-soft sm:p-6"
      >
        <div>
          <label className="mb-1.5 block text-sm font-medium text-navy-500">Name</label>
          <input className={inputClass} value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-navy-500">Restaurant</label>
          <input
            className={inputClass}
            value={restaurant}
            onChange={(e) => setRestaurant(e.target.value)}
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-navy-500">Email</label>
          <input
            className={inputClass}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        {profileError && <p className="text-sm text-semantic-threat">{profileError}</p>}
        {profileSaved && <p className="text-sm text-semantic-opportunity">Profile saved.</p>}
        <div className="flex justify-end">
          <button
            type="submit"
            className="hover-lift rounded-[10px] bg-navy px-5 py-2.5 text-sm font-semibold text-surface shadow-soft"
          >
            Save profile
          </button>
        </div>
      </form>

      <form
        onSubmit={savePassword}
        className="space-y-4 rounded-2xl border border-ink-border bg-surface p-5 shadow-soft sm:p-6"
      >
        <h2 className="font-serif text-lg font-semibold text-navy">Password</h2>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-navy-500">Current password</label>
          <input
            className={inputClass}
            type="password"
            autoComplete="current-password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-navy-500">New password</label>
          <input
            className={inputClass}
            type="password"
            autoComplete="new-password"
            value={nextPassword}
            onChange={(e) => setNextPassword(e.target.value)}
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-navy-500">Confirm new password</label>
          <input
            className={inputClass}
            type="password"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        {passwordError && <p className="text-sm text-semantic-threat">{passwordError}</p>}
        {passwordSaved && <p className="text-sm text-semantic-opportunity">Password updated.</p>}
        <div className="flex justify-end">
          <button
            type="submit"
            className="hover-lift rounded-[10px] bg-navy px-5 py-2.5 text-sm font-semibold text-surface shadow-soft"
          >
            Update password
          </button>
        </div>
      </form>

      <div className="rounded-2xl border border-ink-border bg-surface p-5 shadow-soft">
        <h2 className="font-serif text-lg font-semibold text-navy">Session</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Log out to return to the landing page. Your watchlist data stays in the project; only this
          device session ends.
        </p>
        <button
          type="button"
          onClick={logout}
          className="mt-4 rounded-[10px] border border-ink-border px-4 py-2 text-sm font-semibold text-navy transition-colors duration-220 hover:bg-ink-bg"
        >
          Log out
        </button>
      </div>
    </div>
  );
}
