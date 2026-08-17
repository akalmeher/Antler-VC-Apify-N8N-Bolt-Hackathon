import { useState, useEffect, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { MetricsBar } from './components/MetricsBar';
import { CompanyCard } from './components/CompanyCard';
import { CompanyTable } from './components/CompanyTable';
import { CompanyDetailDrawer } from './components/CompanyDetailDrawer';
import { ManualSignalModal } from './components/ManualSignalModal';
import { WebhookSimulatorModal } from './components/WebhookSimulatorModal';
import { Toast } from './components/Toast';
import type { Restaurant, RestaurantInputPayload } from './types';
import { getRestaurants, addRestaurantSignalPayload, resetToSeedData, subscribeToStore } from './lib/storage';
import { Search, LayoutGrid, Table, UtensilsCrossed } from 'lucide-react';

export function App() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>(getRestaurants());
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  
  // UI filters
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [opportunityFilter, setOpportunityFilter] = useState<string>('ALL');
  const [cuisineFilter, setCuisineFilter] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Modals & Toast
  const [isManualModalOpen, setIsManualModalOpen] = useState<boolean>(false);
  const [isSimulatorModalOpen, setIsSimulatorModalOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    const unsub = subscribeToStore(() => {
      const updated = getRestaurants();
      setRestaurants(updated);

      if (selectedRestaurant) {
        const found = updated.find((r) => r.id === selectedRestaurant.id);
        if (found) setSelectedRestaurant(found);
      }
    });
    return unsub;
  }, [selectedRestaurant]);

  const handleManualSignal = (payload: any) => {
    const { restaurant } = addRestaurantSignalPayload(payload);
    setToastMessage(`Added signal for ${restaurant.name}! Market analysis updated.`);
  };

  const handleSimulateWebhook = (payload: RestaurantInputPayload) => {
    const { restaurant } = addRestaurantSignalPayload(payload);
    setToastMessage(`⚡ Fetched live SF market data for ${restaurant.name}.`);
  };

  const handleResetDemo = () => {
    if (confirm('Reset San Francisco restaurant dataset to baseline?')) {
      resetToSeedData();
      setToastMessage('SF market dataset reset to clean baseline.');
    }
  };

  const filteredRestaurants = useMemo(() => {
    return restaurants.filter((r) => {
      const matchesSearch =
        r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.cuisine.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.menuHighlights.some((m) => m.name.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesOpp =
        opportunityFilter === 'ALL' || r.opportunityLevel === opportunityFilter;

      const matchesCuisine =
        cuisineFilter === 'ALL' || r.cuisine.toLowerCase().includes(cuisineFilter.toLowerCase());

      return matchesSearch && matchesOpp && matchesCuisine;
    });
  }, [restaurants, searchQuery, opportunityFilter, cuisineFilter]);

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1C201A] flex flex-col selection:bg-[#557A60] selection:text-white">
      <Navbar
        onOpenManualModal={() => setIsManualModalOpen(true)}
        onOpenSimulatorModal={() => setIsSimulatorModalOpen(true)}
        onResetDemo={handleResetDemo}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-6">
        
        {/* Simplified Executive Hero Banner */}
        <div className="bg-white rounded-2xl p-6 border border-[#EAE5DB] shadow-xs relative overflow-hidden">
          <div className="max-w-3xl space-y-2">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 text-xs font-bold font-mono bg-[#E8F0E9] text-[#2D4234] border border-[#C4D7C8] rounded-full">
                San Francisco Hospitality Research
              </span>
              <span className="text-xs text-[#5A6256]">• Mission District &amp; Hayes Valley</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1C201A] tracking-tight">
              Scout nearby SF competitors, <span className="text-[#557A60]">menu prices &amp; market gaps</span>
            </h1>
            <p className="text-xs sm:text-sm text-[#5A6256] leading-relaxed">
              Designed for busy restaurant owners: We automatically scrape Yelp reviews, menu price increases, and SF planning permits so you know <strong className="text-[#1C201A]">where to open and how to win.</strong>
            </p>
          </div>
        </div>

        {/* 3 Executive Takeaway Cards */}
        <MetricsBar restaurants={restaurants} />

        {/* Simplified Search & Filter Controls */}
        <div className="bg-white rounded-2xl p-4 border border-[#EAE5DB] shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
          
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#71786D]" />
            <input
              type="text"
              placeholder="Search spots, cuisines, pasta, burritos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#F9F7F2] border border-[#E0D9CB] rounded-xl pl-9 pr-4 py-2 text-xs text-[#1C201A] placeholder-[#71786D] focus:outline-none focus:border-[#557A60] font-sans"
            />
          </div>

          <div className="flex items-center flex-wrap gap-2 w-full md:w-auto">
            <div className="flex items-center space-x-1 bg-[#F9F7F2] p-1 rounded-xl border border-[#E0D9CB] text-xs">
              <button
                onClick={() => setOpportunityFilter('ALL')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                  opportunityFilter === 'ALL' ? 'bg-[#557A60] text-white' : 'text-[#5A6256] hover:text-[#1C201A]'
                }`}
              >
                All Spots
              </button>
              <button
                onClick={() => setOpportunityFilter('BEST OPPORTUNITY')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                  opportunityFilter === 'BEST OPPORTUNITY' ? 'bg-[#E8F0E9] text-[#2D4234] border border-[#C4D7C8]' : 'text-[#5A6256] hover:text-[#1C201A]'
                }`}
              >
                Best Opportunities
              </button>
              <button
                onClick={() => setOpportunityFilter('HIGH COMPETITION')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                  opportunityFilter === 'HIGH COMPETITION' ? 'bg-[#FDF2F2] text-[#9B2C2C] border border-[#F8B4B4]' : 'text-[#5A6256] hover:text-[#1C201A]'
                }`}
              >
                High Competition
              </button>
            </div>

            <select
              value={cuisineFilter}
              onChange={(e) => setCuisineFilter(e.target.value)}
              className="bg-[#F9F7F2] border border-[#E0D9CB] rounded-xl px-3 py-2 text-xs font-semibold text-[#1C201A] focus:outline-none focus:border-[#557A60]"
            >
              <option value="ALL">All Cuisines</option>
              <option value="italian">🍕 Italian &amp; Pizza</option>
              <option value="tacos">🌮 Tacos &amp; Burritos</option>
              <option value="greek">🥗 Greek &amp; Mediterranean</option>
            </select>
          </div>

          <div className="flex items-center space-x-1 bg-[#F9F7F2] p-1 rounded-xl border border-[#E0D9CB] shrink-0">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'grid' ? 'bg-white text-[#557A60] shadow-xs' : 'text-[#71786D] hover:text-[#1C201A]'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'table' ? 'bg-white text-[#557A60] shadow-xs' : 'text-[#71786D] hover:text-[#1C201A]'
              }`}
              title="Table View"
            >
              <Table className="h-4 w-4" />
            </button>
          </div>

        </div>

        {/* Competitor Cards */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <h2 className="font-extrabold text-lg text-[#1C201A]">San Francisco Competitors &amp; Opportunities</h2>
              <span className="text-xs font-mono text-[#5A6256] bg-white px-2.5 py-0.5 rounded-full border border-[#E0D9CB]">
                {filteredRestaurants.length} local spots
              </span>
            </div>
            <span className="text-xs text-[#5A6256] hidden sm:block font-mono">
              Mission District &amp; Hayes Valley (1.0 mi radius)
            </span>
          </div>

          {filteredRestaurants.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-[#EAE5DB] shadow-xs space-y-3">
              <UtensilsCrossed className="h-8 w-8 text-[#71786D] mx-auto" />
              <h3 className="font-bold text-[#1C201A] text-base">No restaurants match your search</h3>
              <p className="text-xs text-[#5A6256] max-w-sm mx-auto">
                Try clearing your search query or switching to All Spots.
              </p>
              <button
                onClick={() => { setSearchQuery(''); setOpportunityFilter('ALL'); setCuisineFilter('ALL'); }}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-[#E8F0E9] text-[#2D4234] hover:bg-[#D5E4D8] transition-colors inline-block"
              >
                Clear Filters
              </button>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredRestaurants.map((restaurant, index) => (
                <CompanyCard
                  key={restaurant.id}
                  company={restaurant}
                  rank={index + 1}
                  onSelectCompany={(r) => setSelectedRestaurant(r)}
                />
              ))}
            </div>
          ) : (
            <CompanyTable
              companies={filteredRestaurants}
              onSelectCompany={(r) => setSelectedRestaurant(r)}
            />
          )}
        </div>

      </main>

      <CompanyDetailDrawer
        company={selectedRestaurant}
        onClose={() => setSelectedRestaurant(null)}
        onShowToast={(msg) => setToastMessage(msg)}
      />

      <ManualSignalModal
        isOpen={isManualModalOpen}
        onClose={() => setIsManualModalOpen(false)}
        onSubmitSignal={handleManualSignal}
        existingRestaurants={restaurants}
      />

      <WebhookSimulatorModal
        isOpen={isSimulatorModalOpen}
        onClose={() => setIsSimulatorModalOpen(false)}
        onSimulateWebhook={handleSimulateWebhook}
      />

      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
    </div>
  );
}

export default App;
