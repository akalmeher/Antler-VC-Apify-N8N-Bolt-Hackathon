import React from 'react';
import { Sparkles, DollarSign, AlertCircle } from 'lucide-react';
import type { Restaurant } from '../types';
import { calculateMarketSummary } from '../lib/restaurantEngine';

interface MetricsBarProps {
  restaurants: Restaurant[];
}

export const MetricsBar: React.FC<MetricsBarProps> = ({ restaurants }) => {
  const summary = calculateMarketSummary(restaurants);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      
      {/* Takeaway 1: Top Opportunity */}
      <div className="bg-white rounded-2xl p-5 border border-[#EAE5DB] shadow-xs space-y-2">
        <div className="flex items-center space-x-2 text-xs font-bold text-[#2D4234] uppercase tracking-wider font-mono">
          <div className="p-1 rounded bg-[#E8F0E9] text-[#557A60]">
            <Sparkles className="h-4 w-4" />
          </div>
          <span>#1 Opportunity in Mission District</span>
        </div>
        <h3 className="font-extrabold text-base text-[#1C201A] leading-snug">
          Reservable Pizzeria w/ Gluten-Free Crusts
        </h3>
        <p className="text-xs text-[#5A6256] leading-relaxed">
          Competitors (Delfina &amp; Flour+Water) turn away dozens of diners nightly due to 2-hour wait lines and zero online booking.
        </p>
      </div>

      {/* Takeaway 2: Pricing Benchmark */}
      <div className="bg-white rounded-2xl p-5 border border-[#EAE5DB] shadow-xs space-y-2">
        <div className="flex items-center space-x-2 text-xs font-bold text-[#385341] uppercase tracking-wider font-mono">
          <div className="p-1 rounded bg-[#E8F0E9] text-[#557A60]">
            <DollarSign className="h-4 w-4" />
          </div>
          <span>San Francisco Pricing Guide</span>
        </div>
        <div className="flex items-baseline space-x-2">
          <span className="text-3xl font-extrabold text-[#1C201A] font-mono">${summary.avgPlateCost}</span>
          <span className="text-xs text-[#5A6256] font-medium">average entree cost</span>
        </div>
        <p className="text-xs text-[#5A6256] leading-relaxed">
          Local entrees range from <strong className="text-[#1C201A]">{summary.priceRange}</strong>. Offering $20-$24 pricing will capture local value seekers.
        </p>
      </div>

      {/* Takeaway 3: Customer Friction */}
      <div className="bg-white rounded-2xl p-5 border border-[#EAE5DB] shadow-xs space-y-2">
        <div className="flex items-center space-x-2 text-xs font-bold text-[#9B2C2C] uppercase tracking-wider font-mono">
          <div className="p-1 rounded bg-[#FDF2F2] text-[#9B2C2C]">
            <AlertCircle className="h-4 w-4" />
          </div>
          <span>Top Local Customer Complaints</span>
        </div>
        <h3 className="font-extrabold text-base text-[#1C201A] leading-snug">
          2-Hour Wait Lines &amp; Surprise SF Fees
        </h3>
        <p className="text-xs text-[#5A6256] leading-relaxed">
          Diners actively complain online about mandatory 6% SF health surcharges and lack of reservable tables.
        </p>
      </div>

    </div>
  );
};
