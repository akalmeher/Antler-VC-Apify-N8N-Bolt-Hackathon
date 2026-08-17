import React from 'react';
import type { Restaurant } from '../types';
import { Star, ArrowRight, MapPin } from 'lucide-react';

interface CompanyTableProps {
  companies: Restaurant[];
  onSelectCompany: (restaurant: Restaurant) => void;
}

export const CompanyTable: React.FC<CompanyTableProps> = ({ companies, onSelectCompany }) => {
  return (
    <div className="bg-white rounded-2xl border border-[#EAE5DB] shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-[#2D332A]">
          <thead className="bg-[#F7F4EE] text-[#5A6256] uppercase font-mono border-b border-[#E5E0D5]">
            <tr>
              <th className="py-3.5 px-4">Rank</th>
              <th className="py-3.5 px-4">Restaurant</th>
              <th className="py-3.5 px-4">Cuisine</th>
              <th className="py-3.5 px-4">Avg Entrée</th>
              <th className="py-3.5 px-4">Rating</th>
              <th className="py-3.5 px-4">Distance</th>
              <th className="py-3.5 px-4">Opportunity Level</th>
              <th className="py-3.5 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F0ECE1]">
            {companies.map((restaurant, index) => (
              <tr 
                key={restaurant.id}
                onClick={() => onSelectCompany(restaurant)}
                className="hover:bg-[#F9F7F2] transition-colors cursor-pointer group"
              >
                <td className="py-4 px-4 font-mono font-bold text-[#5A6256] group-hover:text-[#557A60]">
                  #{index + 1}
                </td>
                
                <td className="py-4 px-4">
                  <div className="flex items-center space-x-3">
                    <div className="h-9 w-9 rounded-lg bg-[#F5F2EA] border border-[#E0D9CB] overflow-hidden shrink-0">
                      {restaurant.imageUrl && (
                        <img src={restaurant.imageUrl} alt={restaurant.name} className="h-full w-full object-cover" />
                      )}
                    </div>
                    <div>
                      <div className="font-bold text-sm text-[#1C201A] group-hover:text-[#385341] transition-colors">
                        {restaurant.name}
                      </div>
                      <div className="text-[11px] text-[#5A6256] font-mono">{restaurant.address}</div>
                    </div>
                  </div>
                </td>

                <td className="py-4 px-4">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-[#1C201A] text-xs">{restaurant.cuisine}</span>
                    <span className="px-1.5 py-0.5 rounded bg-[#E8F0E9] text-[#2D4234] font-mono font-bold text-[10px] border border-[#C4D7C8]">
                      {restaurant.priceTier}
                    </span>
                  </div>
                </td>

                <td className="py-4 px-4 font-mono font-extrabold text-[#1C201A] text-sm">
                  ${restaurant.avgEntreePrice}
                </td>

                <td className="py-4 px-4">
                  <div className="flex items-center space-x-1">
                    <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                    <span className="font-bold text-[#1C201A] text-xs">{restaurant.rating}</span>
                    <span className="text-[#71786D] text-[11px]">({restaurant.reviewCount})</span>
                  </div>
                </td>

                <td className="py-4 px-4 text-[#5A6256] font-mono text-xs">
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-3 w-3 text-[#557A60]" />
                    <span>{restaurant.distanceMiles} mi</span>
                  </div>
                </td>

                <td className="py-4 px-4">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase font-mono ${
                    restaurant.opportunityLevel === 'HIGH COMPETITION'
                      ? 'bg-[#FDF2F2] text-[#9B2C2C] border-[#F8B4B4]'
                      : restaurant.opportunityLevel === 'MODERATE OVERLAP'
                      ? 'bg-[#FEF8EC] text-[#975A16] border-[#FBD38D]'
                      : 'bg-[#E8F0E9] text-[#2D4234] border-[#C4D7C8]'
                  }`}>
                    {restaurant.opportunityLevel}
                  </span>
                </td>

                <td className="py-4 px-4 text-right">
                  <button className="inline-flex items-center space-x-1 text-[#557A60] font-semibold group-hover:text-[#385341]">
                    <span>Inspect</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
