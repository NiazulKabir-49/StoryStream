import React from 'react';
import { useApp } from '../store/AppContext';
import HeroSlider from '../components/HeroSlider';
import BookList from '../components/BookList';
import { Trophy } from 'lucide-react';

const Home: React.FC = () => {
  const { books } = useApp();

  // Filter Data
  const recentReleases = [...books].sort((a, b) => b.createdAt - a.createdAt).slice(0, 10);
  const trending = [...books].sort((a, b) => b.totalViews - a.totalViews).slice(0, 10);
  const thisWeekTrending = [...books].filter(b => (Date.now() - b.updatedAt) < 604800000); 

  // Group by Genre (Demo: Just Fantasy and Mystery)
  const mysteryBooks = books.filter(b => b.genre === 'Mystery');
  const sciFiBooks = books.filter(b => b.genre === 'Sci-Fi');

  return (
    <div className="min-h-screen pb-24">
      <HeroSlider />

      <div className="max-w-7xl mx-auto space-y-4">
        
        <BookList title="Recent Releases" books={recentReleases} />
        <BookList title="Trending Now" books={trending} />
        {thisWeekTrending.length > 0 && <BookList title="This Week's Hits" books={thisWeekTrending} />}
        
        {/* Genre Sections */}
        <BookList title="Mystery & Thriller" books={mysteryBooks} />
        <BookList title="Sci-Fi & Fantasy" books={sciFiBooks} />

        {/* Leaderboard Section */}
        <div className="px-4 py-12">
          <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-8 border border-slate-700 shadow-xl">
            <div className="flex items-center gap-3 mb-8">
              <Trophy className="w-8 h-8 text-yellow-500" />
              <h2 className="text-3xl font-bold text-white">Top Stories Leaderboard</h2>
            </div>
            
            <div className="grid gap-4">
              {trending.slice(0, 5).map((book, idx) => (
                <div key={book.id} className="flex items-center gap-4 bg-slate-800/50 p-4 rounded-lg hover:bg-slate-700 transition-colors">
                  <div className={`text-2xl font-bold w-12 text-center ${idx === 0 ? 'text-yellow-400' : idx === 1 ? 'text-gray-300' : idx === 2 ? 'text-amber-700' : 'text-slate-500'}`}>
                    #{idx + 1}
                  </div>
                  <img src={book.coverUrl} alt="" className="w-12 h-16 object-cover rounded" />
                  <div className="flex-1">
                    <h4 className="font-bold text-lg text-white">{book.title}</h4>
                    <p className="text-slate-400 text-sm">by {book.authorName}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-indigo-400 font-bold">{book.totalViews.toLocaleString()}</div>
                    <div className="text-xs text-slate-500">Reads</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;