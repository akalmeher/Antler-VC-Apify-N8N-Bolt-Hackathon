import React from 'react';
import { Utensils, Sparkles, Plus, RotateCcw, MapPin } from 'lucide-react';

interface NavbarProps {
  onOpenManualModal: () => void;
  onOpenSimulatorModal: () => void;
  onResetDemo: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenManualModal,
  onOpenSimulatorModal,
  onResetDemo,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#EAE5DB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand */}
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-xl bg-[#557A60] flex items-center justify-center text-white shadow-xs">
              <Utensils className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-xl tracking-tight text-[#1C201A]">
                  Restaurant<span className="text-[#557A60]">Scout</span>
                </span>
                <span className="px-2.5 py-0.5 text-[10px] font-semibold uppercase bg-[#E8F0E9] text-[#2D4234] border border-[#C4D7C8] rounded-full">
                  San Francisco Guide
                </span>
              </div>
              <p className="text-xs text-[#5A6256] hidden sm:block">
                Instant competitor &amp; menu pricing research for San Francisco restaurant owners
              </p>
            </div>
          </div>

          {/* Location Badge */}
          <div className="hidden lg:flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white border border-[#E0D9CB] text-xs text-[#2D332A] shadow-xs">
            <MapPin className="h-3.5 w-3.5 text-[#557A60] shrink-0" />
            <span className="text-[#5A6256]">Target Location:</span>
            <span className="text-[#1C201A] font-bold">San Francisco — Mission District &amp; Hayes Valley</span>
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            
            {/* Live SF Data Button */}
            <button
              onClick={onOpenSimulatorModal}
              className="flex items-center space-x-1.5 px-3 py-1.5 sm:px-4 sm:py-2 text-xs font-semibold rounded-xl bg-[#557A60] hover:bg-[#44634E] text-white shadow-xs transition-all active:scale-95"
            >
              <Sparkles className="h-3.5 w-3.5 text-emerald-200" />
              <span>Fetch Live SF Data</span>
            </button>

            {/* Add Restaurant */}
            <button
              onClick={onOpenManualModal}
              className="flex items-center space-x-1.5 px-3 py-1.5 sm:px-4 sm:py-2 text-xs font-semibold rounded-xl bg-white hover:bg-[#F2ECE1] text-[#1C201A] border border-[#E0D9CB] transition-all active:scale-95"
            >
              <Plus className="h-3.5 w-3.5 text-[#557A60]" />
              <span>Add Restaurant</span>
            </button>

            {/* Reset */}
            <button
              onClick={onResetDemo}
              title="Reset Demo Data"
              className="p-2 text-[#5A6256] hover:text-[#1C201A] hover:bg-[#EFECE4] rounded-xl transition-colors"
            >
              <RotateCcw className="h-4 w-4" />
            </button>

          </div>

        </div>
      </div>
    </header>
  );
};
