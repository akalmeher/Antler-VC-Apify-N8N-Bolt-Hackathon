import React, { useState } from 'react';
import { X, Plus, Utensils, AlertTriangle, DollarSign, MapPin } from 'lucide-react';
import type { SignalType, PriceTier, Restaurant } from '../types';

interface ManualSignalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitSignal: (payload: {
    restaurantName: string;
    cuisine?: string;
    priceTier?: PriceTier;
    address?: string;
    type: SignalType;
    source: string;
    title: string;
    description: string;
  }) => void;
  existingRestaurants: Restaurant[];
}

export const ManualSignalModal: React.FC<ManualSignalModalProps> = ({
  isOpen,
  onClose,
  onSubmitSignal,
  existingRestaurants,
}) => {
  const [selectedId, setSelectedId] = useState<string>('custom');
  const [customName, setCustomName] = useState<string>('');
  const [cuisine, setCuisine] = useState<string>('Italian & Pizza');
  const [priceTier] = useState<PriceTier>('$$$');
  const [address] = useState<string>('Valencia St, San Francisco, CA');
  const [type, setType] = useState<SignalType>('review_complaint');
  const [source, setSource] = useState<string>('Yelp & Google Reviews');
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let targetName = customName;

    if (selectedId !== 'custom') {
      const found = existingRestaurants.find((r) => r.id === selectedId);
      if (found) {
        targetName = found.name;
      }
    }

    if (!targetName || !title || !description) {
      alert('Please fill out Restaurant Name, Title, and Description.');
      return;
    }

    onSubmitSignal({
      restaurantName: targetName,
      cuisine,
      priceTier,
      address,
      type,
      source: source || 'Manual Entry',
      title,
      description,
    });

    setTitle('');
    setDescription('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-xl bg-white border border-[#EAE5DB] rounded-2xl p-6 shadow-2xl text-[#1C201A] space-y-6">
        
        <div className="flex items-center justify-between pb-4 border-b border-[#EAE5DB]">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-[#E8F0E9] border border-[#C4D7C8] text-[#385341]">
              <Plus className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-lg text-[#1C201A]">Add Restaurant / Market Update</h2>
              <p className="text-xs text-[#5A6256]">
                Enter a local San Francisco competitor or customer review complaint by hand.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#5A6256] hover:text-[#1C201A] hover:bg-[#F5F2EA] rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-mono font-semibold uppercase text-[#5A6256]">
              Target Restaurant
            </label>
            <select
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
              className="w-full bg-[#F9F7F2] border border-[#E0D9CB] rounded-lg px-3 py-2 text-sm text-[#1C201A] focus:outline-none focus:border-[#557A60]"
            >
              {existingRestaurants.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name} ({r.cuisine})
                </option>
              ))}
              <option value="custom">+ Add New Local SF Spot</option>
            </select>
          </div>

          {selectedId === 'custom' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-mono font-semibold uppercase text-[#5A6256]">
                  Restaurant Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Trattoria Bella"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="w-full bg-[#F9F7F2] border border-[#E0D9CB] rounded-lg px-3 py-2 text-sm text-[#1C201A] focus:outline-none focus:border-[#557A60] mt-1"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-mono font-semibold uppercase text-[#5A6256]">
                  Cuisine Concept
                </label>
                <input
                  type="text"
                  placeholder="e.g. Italian & Pizza"
                  value={cuisine}
                  onChange={(e) => setCuisine(e.target.value)}
                  className="w-full bg-[#F9F7F2] border border-[#E0D9CB] rounded-lg px-3 py-2 text-sm text-[#1C201A] focus:outline-none focus:border-[#557A60] mt-1"
                />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-mono font-semibold uppercase text-[#5A6256]">
              Category
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setType('review_complaint')}
                className={`flex items-center justify-center space-x-1.5 p-2 rounded-lg border text-xs font-semibold transition-all ${
                  type === 'review_complaint' 
                    ? 'bg-[#FDF2F2] border-[#F8B4B4] text-[#9B2C2C]' 
                    : 'bg-[#F9F7F2] border-[#E0D9CB] text-[#5A6256]'
                }`}
              >
                <AlertTriangle className="h-3.5 w-3.5" />
                <span>Customer Complaint</span>
              </button>

              <button
                type="button"
                onClick={() => setType('menu_price_change')}
                className={`flex items-center justify-center space-x-1.5 p-2 rounded-lg border text-xs font-semibold transition-all ${
                  type === 'menu_price_change' 
                    ? 'bg-[#FEF8EC] border-[#FBD38D] text-[#975A16]' 
                    : 'bg-[#F9F7F2] border-[#E0D9CB] text-[#5A6256]'
                }`}
              >
                <DollarSign className="h-3.5 w-3.5" />
                <span>Menu Price Increase</span>
              </button>

              <button
                type="button"
                onClick={() => setType('new_opening')}
                className={`flex items-center justify-center space-x-1.5 p-2 rounded-lg border text-xs font-semibold transition-all ${
                  type === 'new_opening' 
                    ? 'bg-[#E8F0E9] border-[#C4D7C8] text-[#2D4234]' 
                    : 'bg-[#F9F7F2] border-[#E0D9CB] text-[#5A6256]'
                }`}
              >
                <Utensils className="h-3.5 w-3.5" />
                <span>New Opening</span>
              </button>

              <button
                type="button"
                onClick={() => setType('permit_expansion')}
                className={`flex items-center justify-center space-x-1.5 p-2 rounded-lg border text-xs font-semibold transition-all ${
                  type === 'permit_expansion' 
                    ? 'bg-[#EBF8FF] border-[#90CDF4] text-[#2B6CB0]' 
                    : 'bg-[#F9F7F2] border-[#E0D9CB] text-[#5A6256]'
                }`}
              >
                <MapPin className="h-3.5 w-3.5" />
                <span>Patio / Parklet Permit</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-mono font-semibold uppercase text-[#5A6256]">
                Title / Headline *
              </label>
              <input
                type="text"
                placeholder="e.g. Scraped 15 Yelp complaints about 2-hour wait lines"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-[#F9F7F2] border border-[#E0D9CB] rounded-lg px-3 py-2 text-sm text-[#1C201A] focus:outline-none focus:border-[#557A60] mt-1"
                required
              />
            </div>
            <div>
              <label className="text-xs font-mono font-semibold uppercase text-[#5A6256]">
                Source
              </label>
              <input
                type="text"
                placeholder="e.g. Yelp Scraper"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                className="w-full bg-[#F9F7F2] border border-[#E0D9CB] rounded-lg px-3 py-2 text-sm text-[#1C201A] focus:outline-none focus:border-[#557A60] mt-1"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-mono font-semibold uppercase text-[#5A6256]">
              Short Description *
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Customers complain about 2-hour wait times and missing gluten-free options."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-[#F9F7F2] border border-[#E0D9CB] rounded-lg px-3 py-2 text-sm text-[#1C201A] focus:outline-none focus:border-[#557A60] mt-1"
              required
            ></textarea>
          </div>

          <div className="pt-4 border-t border-[#EAE5DB] flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-[#F0ECE1] text-[#5A6256] hover:bg-[#E5DFD1] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold rounded-lg bg-[#557A60] hover:bg-[#44634E] text-white shadow-xs transition-all"
            >
              Add Spot &amp; Analyze
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
