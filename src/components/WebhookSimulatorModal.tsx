import React, { useState } from 'react';
import { X, Sparkles, CheckCircle2, Code2, Play } from 'lucide-react';
import type { RestaurantInputPayload } from '../types';

interface WebhookSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSimulateWebhook: (payload: RestaurantInputPayload) => void;
}

const PRESET_PAYLOADS: { label: string; description: string; payload: RestaurantInputPayload }[] = [
  {
    label: 'SF Yelp Scraper → Delfina Pizzeria (Mission)',
    description: 'Scrapes reviews & extracts 24 complaints regarding 2-hour wait lines & missing GF crust.',
    payload: {
      restaurantName: 'Delfina Pizzeria',
      type: 'review_complaint',
      source: 'Apify Actor: sf-yelp-scraper',
      title: 'Scraped 24 Review Complaints: "2-Hour Outdoor Wait Lines & No Reservations"',
      description: 'Review sentiment analysis identified major guest friction around 2-hour walk-in wait times and zero gluten-free dough options.',
      sourceUrl: 'https://apify.com/store/yelp-scraper',
      actionableInsight: 'Diners are frustrated by long wait times and missing gluten-free pizza crust options at Delfina.',
    },
  },
  {
    label: 'SF Menu Scraper → Flour + Water (Mission)',
    description: 'Scrapes online menu prices. Detects 6% SF Health Mandate + 20% living wage fee.',
    payload: {
      restaurantName: 'Flour + Water',
      type: 'menu_price_change',
      source: 'Apify Actor: sf-restaurant-menu-scraper',
      title: 'Menu Scrape: Mandatory 6% SF Health Mandate + 20% Living Wage Fee Added',
      description: 'Menu pricing scrape detected mandatory 20% living wage surcharge added to all checks, increasing effective dinner check to $55+.',
      sourceUrl: 'https://apify.com/store/menu-scraper',
      actionableInsight: 'Customers complain about mandatory surcharges. Positioning transparent flat pricing builds instant local goodwill.',
    },
  },
  {
    label: 'SF Planning Permits → Beretta (Valencia St)',
    description: 'Monitors SF City Planning permits. Detects new outdoor parklet & late-night liquor filing.',
    payload: {
      restaurantName: 'Beretta',
      type: 'permit_expansion',
      source: 'Apify Actor: sf-city-permit-monitor',
      title: 'SF Planning Permit Scrape: Outdoor Heated Parklet & 1:00 AM Late-Night License',
      description: 'Municipal permit scraper detected plans to add heated outdoor parklet seats and extend weekend operating hours on Valencia St.',
      sourceUrl: 'https://sf.gov/permits',
      actionableInsight: 'Late-night weekend dining in Mission District is expanding rapidly. Consider late-night aperitivo hours.',
    },
  },
  {
    label: 'SF Google Places → New Opening',
    description: 'Detects new commercial kitchen permit issued on Valencia St.',
    payload: {
      restaurantName: 'Trattoria Bella',
      cuisine: 'Italian & Wood-Fired',
      priceTier: '$$$',
      address: '899 Valencia St, San Francisco',
      type: 'new_opening',
      source: 'Apify Actor: google-places-scraper',
      title: 'Google Places: New Health & Food Handler Permit Filed on Valencia St',
      description: 'New commercial kitchen permit issued for 80-seat Italian restaurant concept opening in 60 days.',
      sourceUrl: 'https://google.com/maps',
      actionableInsight: 'New Italian opening on Valencia St increases neighborhood Italian dining cluster strength.',
    },
  },
];

export const WebhookSimulatorModal: React.FC<WebhookSimulatorModalProps> = ({
  isOpen,
  onClose,
  onSimulateWebhook,
}) => {
  const [selectedPresetIndex, setSelectedPresetIndex] = useState<number>(0);
  const [jsonText, setJsonText] = useState<string>(
    JSON.stringify(PRESET_PAYLOADS[0].payload, null, 2)
  );
  const [lastResponse, setLastResponse] = useState<any | null>(null);

  if (!isOpen) return null;

  const handleSelectPreset = (index: number) => {
    setSelectedPresetIndex(index);
    setJsonText(JSON.stringify(PRESET_PAYLOADS[index].payload, null, 2));
    setLastResponse(null);
  };

  const handleRunSimulation = () => {
    try {
      const parsed: RestaurantInputPayload = JSON.parse(jsonText);
      onSimulateWebhook(parsed);
      
      setLastResponse({
        status: 200,
        statusText: 'OK',
        message: 'Live SF market data successfully fetched & analyzed',
        timestamp: new Date().toISOString(),
        payload: parsed,
      });
    } catch (e) {
      alert('Invalid JSON structure. Please check syntax.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-white border border-[#EAE5DB] rounded-2xl p-6 shadow-2xl text-[#1C201A] space-y-6">
        
        <div className="flex items-center justify-between pb-4 border-b border-[#EAE5DB]">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-[#557A60] text-white shadow-xs">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="font-extrabold text-lg text-[#1C201A]">Live SF Market Scraper Demo</h2>
                <span className="px-2.5 py-0.5 text-[10px] font-mono bg-[#E8F0E9] text-[#2D4234] border border-[#C4D7C8] rounded">
                  Mission District Scrapers
                </span>
              </div>
              <p className="text-xs text-[#5A6256]">
                Test how live web scrapers automatically pull Yelp reviews, menu price increases, and SF City permits for you.
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

        <div className="space-y-2">
          <label className="text-xs font-mono font-semibold uppercase text-[#5A6256]">
            Select San Francisco Market Event
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {PRESET_PAYLOADS.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectPreset(idx)}
                className={`text-left p-3 rounded-xl border text-xs transition-all ${
                  selectedPresetIndex === idx
                    ? 'bg-[#E8F0E9] border-[#A9C6B3] text-[#2D4234] font-semibold'
                    : 'bg-[#F9F7F2] border-[#E0D9CB] text-[#5A6256] hover:border-[#C8DCD0]'
                }`}
              >
                <div className="font-bold text-[#1C201A]">{preset.label}</div>
                <div className="text-[11px] text-[#5A6256] mt-1 line-clamp-1">{preset.description}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-[#1C201A] font-semibold flex items-center space-x-1">
              <Code2 className="h-4 w-4 text-[#557A60]" />
              <span>Simulated Data Payload</span>
            </span>
            <span className="text-[#5A6256]">JSON</span>
          </div>
          <textarea
            rows={6}
            value={jsonText}
            onChange={(e) => setJsonText(e.target.value)}
            className="w-full bg-[#F9F7F2] border border-[#E0D9CB] rounded-xl p-3 text-xs font-mono text-[#2D4234] focus:outline-none focus:border-[#557A60] leading-relaxed"
          ></textarea>
        </div>

        {lastResponse && (
          <div className="p-3.5 rounded-xl bg-[#E8F0E9] border border-[#C4D7C8] text-[#2D4234] text-xs font-mono flex items-start space-x-3">
            <CheckCircle2 className="h-5 w-5 text-[#557A60] shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-[#2D4234]">
                HTTP {lastResponse.status} {lastResponse.statusText} — Market Data Updated!
              </div>
              <div className="text-[11px] text-[#385341] mt-0.5">
                Dashboard updated instantly. Price averages &amp; winning strategies refreshed.
              </div>
            </div>
          </div>
        )}

        <div className="pt-4 border-t border-[#EAE5DB] flex items-center justify-between">
          <div className="text-xs text-[#5A6256] font-mono">
            Endpoint: <code className="text-[#557A60]">/api/webhooks/restaurant</code>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-[#F0ECE1] text-[#5A6256] hover:bg-[#E5DFD1] transition-colors"
            >
              Close
            </button>
            <button
              type="button"
              onClick={handleRunSimulation}
              className="flex items-center space-x-2 px-5 py-2 text-xs font-semibold rounded-lg bg-[#557A60] hover:bg-[#44634E] text-white shadow-md transition-all transform active:scale-95"
            >
              <Play className="h-3.5 w-3.5 fill-current" />
              <span>Fetch Live Market Data</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
