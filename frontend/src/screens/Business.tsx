import { useEffect, useState } from 'react';
import { useRadar } from '@/lib/RadarContext';
import { inputClass } from '@/lib/forms';
import { SectionHeader } from '@/components/SectionHeader';

export function Business() {
  const { business } = useRadar();
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [offerings, setOfferings] = useState('');
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    if (!business) return;
    setName(business.name);
    setAddress(business.address?.trim() ?? '');
    setCity(business.city?.trim() ?? '');
    setOfferings(business.offerings ?? '');
  }, [business]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setNotice('Business update endpoint not connected yet');
  };

  const category = business?.category ?? 'restaurant';

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <SectionHeader
        as="h1"
        eyebrow="Context"
        title="Your business"
        description="The context behind every comparison m.rror makes."
      />

      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-2xl border border-ink-border bg-surface p-5 shadow-soft sm:p-6"
      >
        <div>
          <label className="mb-1.5 block text-sm font-medium text-navy-500">Business name</label>
          <input
            className={inputClass}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Taco Fuego"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-navy-500">Business address</label>
          <input
            className={inputClass}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Street address"
            autoComplete="street-address"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-navy-500">City</label>
          <input
            className={inputClass}
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="City"
            autoComplete="address-level2"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-navy-500">Category</label>
          <input
            className={`${inputClass} cursor-default bg-charcoal-50 text-muted`}
            value={category}
            readOnly
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-navy-500">
            Business description / offerings
          </label>
          <textarea
            className={`${inputClass} min-h-[8rem] resize-y`}
            value={offerings}
            onChange={(e) => setOfferings(e.target.value)}
            placeholder="What you sell, serve, or are known for."
          />
        </div>
        {notice && <p className="text-sm text-muted">{notice}</p>}
        <div className="flex justify-end">
          <button
            type="submit"
            className="hover-lift rounded-[10px] bg-navy px-5 py-2.5 text-sm font-semibold text-surface shadow-soft"
          >
            Save changes
          </button>
        </div>
      </form>
    </div>
  );
}
