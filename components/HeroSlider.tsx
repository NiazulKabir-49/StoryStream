import React, { useState, useEffect } from 'react';
import { useApp } from '../store/AppContext';
import { AppView } from '../types';

const HeroSlider: React.FC = () => {
  const { books, navigate } = useApp();
  // Get top 5 trending books
  const featuredBooks = [...books].sort((a, b) => b.totalViews - a.totalViews).slice(0, 5);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredBooks.length);
    }, 5000); // Change every 5 seconds
    return () => clearInterval(timer);
  }, [featuredBooks.length]);

  if (featuredBooks.length === 0) return null;

  const currentBook = featuredBooks[currentIndex];

  return (
    <div className="relative w-full h-[500px] overflow-hidden bg-slate-900">
      {/* Background Image with Blur */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-in-out blur-sm opacity-50"
        style={{ backgroundImage: `url(${currentBook.coverUrl})` }}
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />

      {/* Content */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="max-w-7xl mx-auto px-4 w-full flex flex-col md:flex-row items-center gap-8">
          
          {/* Book Cover */}
          <img 
            src={currentBook.coverUrl} 
            alt={currentBook.title}
            className="w-48 md:w-64 h-72 md:h-96 object-cover rounded-lg shadow-2xl border-2 border-slate-700 transform transition-transform duration-700 hover:scale-105 z-10"
          />

          {/* Info */}
          <div className="z-10 text-center md:text-left">
            <span className="inline-block px-3 py-1 bg-indigo-600 text-xs font-bold rounded-full mb-4">
              Trending Now
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4 drop-shadow-lg">
              {currentBook.title}
            </h1>
            <p className="text-lg text-slate-200 mb-6 line-clamp-3 max-w-xl">
              {currentBook.description}
            </p>
            <div className="flex flex-col md:flex-row gap-4 justify-center md:justify-start">
              <button 
                onClick={() => navigate(AppView.BOOK_DETAILS, currentBook.id)}
                className="px-8 py-3 bg-white text-slate-900 font-bold rounded-full hover:bg-gray-100 transition-colors"
              >
                Read Now
              </button>
              <div className="flex items-center justify-center gap-2 text-slate-300">
                <span className="text-indigo-400 font-semibold">{currentBook.totalViews.toLocaleString()}</span> Reads
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Dots */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2 z-20">
        {featuredBooks.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`w-2 h-2 rounded-full transition-all ${
              idx === currentIndex ? 'w-8 bg-indigo-500' : 'bg-slate-500 hover:bg-slate-400'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSlider;