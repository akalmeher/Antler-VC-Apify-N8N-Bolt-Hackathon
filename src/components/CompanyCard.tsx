import React from 'react';
import { Star, MapPin, Sparkles, ArrowRight, DollarSign, UtensilsCrossed } from 'lucide-react';
import type { Restaurant } from '../types';

interface CompanyCardProps {
  company: Restaurant;
  rank: number;
  onSelectCompany: (restaurant: Restaurant) => void;
}

export const CompanyCard: React.FC<CompanyCardProps> = ({ company, rank, onSelectCompany }) => {
  const getBadgeColor = (level: string) => {
    switch (level) {
      case 'HIGH COMPETITION':
        return 'bg-[#FDF2F2] text-[#9B2C2C] border-[#F8B4B4]';
      case 'MODERATE OVERLAP':
        return 'bg-[#FEF8EC] text-[#975A16] border-[#FBD38D]';
      case 'BEST OPPORTUNITY':
        return 'bg-[#E8F0E9] text-[#2D4234] border-[#C4D7C8]';
      default:
        return 'bg-[#F0EDE6] text-[#5A6256] border-[#E2DDD3]';
    }
  };

  return (
    <div 
      onClick={() => onSelectCompany(company)}
      className="bg-white rounded-2xl p-5 border border-[#EAE5DB] hover:border-[#A9C6B3] hover:shadow-md transition-all duration-200 cursor-pointer group flex flex-col justify-between relative overflow-hidden"
    >
      <div>
        {/* Top Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-7 w-7 rounded-lg bg-[#F5F2EA] border border-[#E0D9CB] flex items-center justify-center text-xs font-mono font-bold text-[#5A6256] group-hover:text-[#557A60] group-hover:border-[#A9C6B3] transition-colors">
              #{rank}
            </div>

            <div className="h-12 w-12 rounded-xl bg-[#F0ECE1] border border-[#E0D9CB] flex items-center justify-center overflow-hidden shrink-0">
              {company.imageUrl ? (
                <img 
                  src={company.imageUrl} 
                  alt={company.name} 
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <UtensilsCrossed className="h-5 w-5 text-[#557A60]" />
              )}
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-base text-[#1C201A] group-hover:text-[#385341] transition-colors">
                  {company.name}
                </h3>
                <span className="text-xs font-mono font-extrabold text-[#385341] bg-[#E8F0E9] px-1.5 py-0.5 rounded border border-[#C4D7C8]">
                  {company.priceTier}
                </span>
              </div>
              <div className="flex items-center space-x-2 text-xs text-[#5A6256] mt-0.5">
                <span className="text-[#2D332A] font-medium">{company.cuisine}</span>
                <span>•</span>
                <span className="flex items-center space-x-1 text-[#5A6256]">
                  <MapPin className="h-3 w-3 text-[#557A60]" />
                  <span>{company.distanceMiles} mi away</span>
                </span>
              </div>
            </div>
          </div>

          <div className="text-right shrink-0">
            <div className={`px-2.5 py-1 text-[10px] font-extrabold rounded-full border uppercase tracking-wider font-mono inline-block ${getBadgeColor(company.opportunityLevel)}`}>
              {company.opportunityLevel}
            </div>
            <div className="mt-1.5 flex items-center justify-end space-x-1 text-xs">
              <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
              <span className="font-bold text-[#1C201A] text-xs">{company.rating}</span>
              <span className="text-[#71786D] text-[11px]">({company.reviewCount})</span>
            </div>
          </div>
        </div>

        {/* Price Tag */}
        <div className="mt-4 pt-3 border-t border-[#F0ECE1] flex items-center justify-between text-xs font-mono">
          <span className="text-[#5A6256] flex items-center space-x-1">
            <DollarSign className="h-3.5 w-3.5 text-[#557A60]" />
            <span>Average Entrée Price:</span>
          </span>
          <span className="font-extrabold text-[#1C201A] text-sm bg-[#F5F2EA] px-2.5 py-0.5 rounded border border-[#E0D9CB]">
            ${company.avgEntreePrice}
          </span>
        </div>

        {/* Customer Dislikes / Complaints Highlight */}
        {company.customerDislikes && company.customerDislikes.length > 0 && (
          <div className="mt-3 p-3 rounded-xl bg-[#FDF2F2] border border-[#F8B4B4]/60">
            <div className="text-[11px] font-bold text-[#9B2C2C] uppercase font-mono">
              ⚠️ Main Customer Complaint:
            </div>
            <p className="text-xs text-[#742A2A] mt-0.5 font-medium line-clamp-2">
              "{company.customerDislikes[0]}"
            </p>
          </div>
        )}

        {/* Winning Strategy Preview */}
        <div className="mt-3 p-3 rounded-xl bg-[#F4F8F5] border border-[#C8DCD0]">
          <div className="flex items-center space-x-1.5 text-xs font-bold text-[#2D4234] font-mono">
            <Sparkles className="h-3.5 w-3.5 text-[#557A60]" />
            <span>How to Win Diners:</span>
          </div>
          <p className="text-xs text-[#2D332A] mt-1 line-clamp-2 leading-relaxed font-sans">
            {company.primaryOpportunity || 'Accept online reservations & offer gluten-free options.'}
          </p>
        </div>
      </div>

      {/* Card Footer */}
      <div className="mt-4 pt-3 border-t border-[#F0ECE1] flex items-center justify-between text-xs">
        <span className="text-[#5A6256] font-mono text-[11px] truncate max-w-[170px]">
          {company.neighborhood}
        </span>

        <button className="flex items-center space-x-1 font-extrabold text-[#557A60] group-hover:text-[#385341] transition-colors text-xs">
          <span>How to Beat This Spot</span>
          <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

    </div>
  );
};
