import React, { useEffect } from 'react';
import { Sparkles, X } from 'lucide-react';

interface ToastProps {
  message: string | null;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, onClose }) => {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce-short">
      <div className="bg-white border border-[#C4D7C8] text-[#1C201A] px-4 py-3 rounded-xl shadow-lg backdrop-blur-md flex items-center space-x-3 text-xs font-semibold">
        <div className="p-1 rounded-md bg-[#E8F0E9] text-[#557A60]">
          <Sparkles className="h-4 w-4" />
        </div>
        <span>{message}</span>
        <button onClick={onClose} className="text-[#71786D] hover:text-[#1C201A] ml-2">
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
