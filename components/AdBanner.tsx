import React, { useState, useEffect } from 'react';
import { MOCK_ADS } from '../constants';

const AdBanner: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % MOCK_ADS.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const ad = MOCK_ADS[currentIndex];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-slate-900 border-t border-slate-800 hidden md:block">
      <div className="max-w-4xl mx-auto h-16 flex items-center justify-between px-4 relative">
        <span className="absolute -top-3 left-2 bg-slate-800 text-[10px] px-1 text-slate-400 border border-slate-700">Sponsored</span>
        
        <div className="flex-1 flex items-center justify-center overflow-hidden">
          <img 
            key={ad.id}
            src={ad.imageUrl} 
            alt={ad.alt}
            className="h-12 w-full object-cover rounded animate-fade-in"
          />
        </div>
        
        <button 
          className="ml-4 text-xs text-slate-500 hover:text-white"
          onClick={(e) => {
             e.currentTarget.parentElement?.parentElement?.remove(); // Simple close
          }}
        >
          X
        </button>
      </div>
    </div>
  );
};

export default AdBanner;