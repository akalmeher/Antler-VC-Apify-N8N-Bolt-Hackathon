import React, { useState } from 'react';
import { X, Star, MapPin, ExternalLink, Sparkles, AlertTriangle, Utensils, Calendar, Copy, Check } from 'lucide-react';
import type { Restaurant } from '../types';

interface CompanyDetailDrawerProps {
  company: Restaurant | null;
  onClose: () => void;
  onShowToast: (message: string) => void;
}

export const CompanyDetailDrawer: React.FC<CompanyDetailDrawerProps> = ({
  company,
  onClose,
  onShowToast,
}) => {
  const [copiedStrategy, setCopiedStrategy] = useState<boolean>(false);

  if (!company) return null;

  const copyStrategyToClipboard = () => {
    if (!company.winningStrategy) return;
    navigator.clipboard.writeText(company.winningStrategy);
    setCopiedStrategy(true);
    onShowToast('Winning strategy copied to clipboard!');
    setTimeout(() => setCopiedStrategy(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-xs flex justify-end transition-opacity">
      <div className="absolute inset-0" onClick={onClose}></div>

      <div className="relative w-full max-w-2xl bg-[#FCFBF8] border-l border-[#E5E0D5] text-[#1C201A] shadow-2xl h-full overflow-y-auto flex flex-col z-10">
        
        {/* Header */}
        <div className="sticky top-0 z-20 bg-[#FCFBF8]/95 backdrop-blur-md px-6 py-4 border-b border-[#E5E0D5] flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-12 w-12 rounded-xl bg-[#F0ECE1] border border-[#E0D9CB] overflow-hidden shrink-0">
              {company.imageUrl && (
                <img src={company.imageUrl} alt={company.name} className="h-full w-full object-cover" />
              )}
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <h2 className="font-extrabold text-xl text-[#1C201A]">{company.name}</h2>
                <a 
                  href={`https://${company.domain}`} 
                  target="_blank" 
                  rel="noreferrer"
                  className="text-xs text-[#557A60] hover:underline font-mono flex items-center space-x-1"
                >
                  <span>{company.domain}</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
              <div className="flex items-center space-x-2 text-xs text-[#5A6256] mt-0.5">
                <span className="text-[#1C201A] font-semibold">{company.cuisine}</span>
                <span>•</span>
                <span className="font-mono text-[#385341] font-bold bg-[#E8F0E9] px-1.5 py-0.5 rounded border border-[#C4D7C8]">
                  {company.priceTier}
                </span>
                <span>•</span>
                <span className="flex items-center space-x-1">
                  <MapPin className="h-3 w-3 text-[#557A60]" />
                  <span>{company.address}</span>
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-[#5A6256] hover:text-[#1C201A] hover:bg-[#EFECE4] rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 flex-1">

          {/* Quick Snapshot */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-white rounded-xl p-3.5 border border-[#EAE5DB] text-center shadow-xs">
              <p className="text-[11px] font-mono text-[#5A6256] uppercase font-bold">Avg Entrée Price</p>
              <p className="text-xl font-extrabold text-[#385341] font-mono mt-0.5">${company.avgEntreePrice}</p>
            </div>
            <div className="bg-white rounded-xl p-3.5 border border-[#EAE5DB] text-center shadow-xs">
              <p className="text-[11px] font-mono text-[#5A6256] uppercase font-bold">Yelp &amp; Google Rating</p>
              <div className="flex items-center justify-center space-x-1 mt-0.5">
                <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                <span className="text-xl font-extrabold text-[#1C201A]">{company.rating}</span>
                <span className="text-xs text-[#71786D]">({company.reviewCount})</span>
              </div>
            </div>
            <div className="bg-white rounded-xl p-3.5 border border-[#EAE5DB] text-center shadow-xs">
              <p className="text-[11px] font-mono text-[#5A6256] uppercase font-bold">Distance</p>
              <p className="text-xl font-extrabold text-[#557A60] font-mono mt-0.5">{company.distanceMiles} mi away</p>
            </div>
          </div>

          {/* How to Win Strategy (Plain English) */}
          <div className="bg-[#F4F8F5] rounded-2xl p-5 border border-[#C8DCD0] shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 rounded-lg bg-[#E8F0E9] border border-[#C4D7C8] text-[#2D4234]">
                  <Sparkles className="h-4 w-4" />
                </div>
                <h3 className="font-extrabold text-base text-[#1C201A]">How to Win Diners From {company.name}</h3>
              </div>
              <button
                onClick={copyStrategyToClipboard}
                className="flex items-center space-x-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#557A60] hover:bg-[#44634E] text-white transition-colors shadow-xs"
              >
                {copiedStrategy ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-200" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span>Copy Strategy</span>
                  </>
                )}
              </button>
            </div>

            <div className="bg-white p-4 rounded-xl border border-[#D5E4D8] space-y-3">
              <div>
                <span className="text-xs font-mono text-[#385341] font-bold uppercase">Market Opportunity:</span>
                <p className="text-sm text-[#1C201A] mt-0.5 leading-relaxed font-medium">
                  {company.primaryOpportunity}
                </p>
              </div>
              
              <div className="pt-3 border-t border-[#EAE5DB]">
                <span className="text-xs font-mono text-[#5A6256] font-bold uppercase">Recommended Positioning:</span>
                <p className="text-xs text-[#2D4234] mt-1 bg-[#F2F6F3] p-3 rounded-lg border border-[#C8DCD0] leading-relaxed font-medium">
                  {company.winningStrategy}
                </p>
              </div>
            </div>
          </div>

          {/* Customer Dislikes / Complaints */}
          {company.customerDislikes && company.customerDislikes.length > 0 && (
            <div className="bg-white rounded-2xl p-4 border border-[#F8B4B4] space-y-3 shadow-xs">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#9B2C2C] flex items-center space-x-1.5">
                <AlertTriangle className="h-4 w-4" />
                <span>What Local Customers Dislike (Weaknesses You Can Solve)</span>
              </h3>
              <div className="space-y-2">
                {company.customerDislikes.map((complaint, idx) => (
                  <div key={idx} className="flex items-start space-x-2 text-xs bg-[#FDF2F2] p-3 rounded-xl border border-[#FBD5D5]">
                    <span className="text-[#9B2C2C] font-bold font-mono">⚠️</span>
                    <p className="text-[#742A2A] font-semibold">{complaint}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Menu Prices */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#5A6256] flex items-center space-x-1.5">
              <Utensils className="h-4 w-4 text-[#557A60]" />
              <span>Menu Pricing Guide</span>
            </h3>

            <div className="grid grid-cols-1 gap-2">
              {company.menuHighlights.map((item, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-white border border-[#EAE5DB] flex items-center justify-between shadow-xs">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-sm text-[#1C201A]">{item.name}</span>
                      {item.isPopular && (
                        <span className="px-2 py-0.5 rounded bg-[#FEF8EC] text-[#975A16] text-[10px] font-mono font-semibold border border-[#FBD38D]">
                          🔥 Popular Item
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-[#5A6256] font-mono">{item.category}</span>
                  </div>
                  <span className="font-mono font-extrabold text-[#385341] text-base bg-[#E8F0E9] px-3 py-1 rounded-lg border border-[#C4D7C8]">
                    ${item.price}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Activity Logs */}
          {company.signals.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#5A6256]">
                Recent Public Updates ({company.signals.length})
              </h3>

              <div className="space-y-3">
                {company.signals.map((sig) => (
                  <div key={sig.id} className="p-4 rounded-xl bg-white border border-[#EAE5DB] shadow-xs">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-bold text-sm text-[#1C201A]">{sig.title}</h4>
                        <div className="flex items-center space-x-2 text-xs text-[#5A6256] mt-0.5 font-mono">
                          <span>{sig.source}</span>
                          <span>•</span>
                          <span className="flex items-center space-x-1">
                            <Calendar className="h-3 w-3 text-[#71786D]" />
                            <span>{new Date(sig.detectedAt).toLocaleDateString()}</span>
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-[#2D332A] mt-2 leading-relaxed font-sans">
                      {sig.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
