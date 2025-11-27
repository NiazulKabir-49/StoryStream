import React, { useState, useEffect } from 'react';
import { useApp } from '../store/AppContext';
import { AppView, Episode, Season } from '../types';
import { Heart, MessageSquare, Share2, Bookmark, ArrowLeft, Send, Eye } from 'lucide-react';

export const BookDetails: React.FC = () => {
  const { selectedBook, navigate, toggleFavorite, user } = useApp();
  const [activeTab, setActiveTab] = useState<'episodes' | 'about'>('episodes');
  const [activeSeasonId, setActiveSeasonId] = useState<string>('');

  useEffect(() => {
    if (selectedBook && selectedBook.seasons.length > 0) {
      setActiveSeasonId(selectedBook.seasons[0].id);
    }
  }, [selectedBook]);

  if (!selectedBook) return <div>Book not found</div>;

  const activeSeason = selectedBook.seasons.find(s => s.id === activeSeasonId);

  const isFav = user?.favorites.includes(selectedBook.id);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 pb-24">
      {/* Header */}
      <div className="flex flex-col md:flex-row gap-8 mb-12">
        <img 
          src={selectedBook.coverUrl} 
          alt={selectedBook.title}
          className="w-full md:w-64 h-96 object-cover rounded-xl shadow-2xl"
        />
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">{selectedBook.title}</h1>
              <p className="text-xl text-slate-400 mb-4">by <span className="text-indigo-400 cursor-pointer hover:underline">{selectedBook.authorName}</span></p>
            </div>
            <button 
              onClick={() => toggleFavorite(selectedBook.id)}
              className={`p-3 rounded-full transition-colors ${isFav ? 'bg-pink-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
            >
              <Heart className={`w-6 h-6 ${isFav ? 'fill-current' : ''}`} />
            </button>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            <span className="bg-slate-800 text-slate-300 px-3 py-1 rounded-full text-sm">{selectedBook.genre}</span>
            {selectedBook.tags.map(tag => (
              <span key={tag} className="bg-slate-800 text-slate-400 px-3 py-1 rounded-full text-sm border border-slate-700">#{tag}</span>
            ))}
          </div>

          <div className="flex gap-8 mb-8 text-slate-300">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{selectedBook.totalViews.toLocaleString()}</div>
              <div className="text-sm">Reads</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{selectedBook.seasons.length}</div>
              <div className="text-sm">Seasons</div>
            </div>
          </div>

          <p className="text-slate-300 leading-relaxed mb-8">{selectedBook.description}</p>
          
          <div className="flex gap-4">
             {/* Start Reading First Episode available */}
             <button 
               onClick={() => {
                 const firstEp = selectedBook.seasons[0]?.episodes[0];
                 if (firstEp) navigate(AppView.READ_EPISODE, selectedBook.id, selectedBook.seasons[0].id, firstEp.id);
               }}
               className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-bold transition-colors"
             >
               Start Reading
             </button>
             <button className="px-4 py-3 bg-slate-800 hover:bg-slate-700 rounded-lg text-white">
               <Share2 className="w-5 h-5" />
             </button>
          </div>
        </div>
      </div>

      {/* Season Tabs */}
      <div className="border-b border-slate-800 mb-6">
        <div className="flex gap-8">
          <button 
            onClick={() => setActiveTab('episodes')}
            className={`pb-4 text-lg font-medium transition-colors ${activeTab === 'episodes' ? 'text-indigo-400 border-b-2 border-indigo-400' : 'text-slate-500'}`}
          >
            Episodes
          </button>
          <button 
             onClick={() => setActiveTab('about')}
             className={`pb-4 text-lg font-medium transition-colors ${activeTab === 'about' ? 'text-indigo-400 border-b-2 border-indigo-400' : 'text-slate-500'}`}
          >
            About
          </button>
        </div>
      </div>

      {activeTab === 'episodes' && (
        <div>
          {/* Season Selector */}
          <div className="flex overflow-x-auto gap-2 mb-6 pb-2">
            {selectedBook.seasons.map(season => (
              <button
                key={season.id}
                onClick={() => setActiveSeasonId(season.id)}
                className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-colors ${activeSeasonId === season.id ? 'bg-white text-slate-900' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
              >
                Season {season.seasonNumber}
              </button>
            ))}
          </div>

          {/* Episode List */}
          <div className="grid gap-3">
            {activeSeason?.episodes.map(ep => (
              <div 
                key={ep.id} 
                onClick={() => navigate(AppView.READ_EPISODE, selectedBook.id, activeSeason.id, ep.id)}
                className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg hover:bg-slate-800 cursor-pointer border border-transparent hover:border-indigo-500/30 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-slate-400 font-bold">
                    {ep.episodeNumber}
                  </div>
                  <div>
                    <h3 className="text-white font-medium">{ep.title}</h3>
                    <p className="text-slate-500 text-xs">{new Date(ep.publishedAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-slate-500 text-sm">
                   <div className="flex items-center gap-1"><Eye className="w-3 h-3"/> {ep.views}</div>
                   <div className="flex items-center gap-1"><Heart className="w-3 h-3"/> {ep.likes}</div>
                </div>
              </div>
            ))}
            {(!activeSeason?.episodes || activeSeason.episodes.length === 0) && (
              <p className="text-slate-500 italic text-center py-8">No episodes published in this season yet.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export const EpisodeReader: React.FC = () => {
  const { 
    selectedBook, selectedSeason, selectedEpisode, 
    navigate, incrementViews, toggleLike, addComment 
  } = useApp();
  const [commentText, setCommentText] = useState('');

  // Increment view on mount
  useEffect(() => {
    if (selectedBook && selectedSeason && selectedEpisode) {
      incrementViews(selectedBook.id, selectedSeason.id, selectedEpisode.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedEpisode?.id]);

  if (!selectedBook || !selectedSeason || !selectedEpisode) return <div>Loading...</div>;

  const handleNextEpisode = () => {
    // Logic to find next ID
    const currentIdx = selectedSeason.episodes.findIndex(e => e.id === selectedEpisode.id);
    if (currentIdx < selectedSeason.episodes.length - 1) {
      navigate(AppView.READ_EPISODE, selectedBook.id, selectedSeason.id, selectedSeason.episodes[currentIdx + 1].id);
    } else {
      // Check next season? (Simplification: just stay or alert)
      alert("End of season! Check back later.");
    }
  };

  const handlePostComment = () => {
    if (!commentText.trim()) return;
    // Simple basic filter
    if (commentText.match(/badword|slang/i)) {
      alert("Please keep comments respectful.");
      return;
    }
    addComment(selectedBook.id, selectedSeason.id, selectedEpisode.id, commentText);
    setCommentText('');
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 pb-32">
      <button 
        onClick={() => navigate(AppView.BOOK_DETAILS, selectedBook.id)}
        className="flex items-center gap-2 text-slate-400 hover:text-white mb-6"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Episodes
      </button>

      <div className="text-center mb-10">
        <h2 className="text-slate-400 text-sm uppercase tracking-wider mb-2">
          {selectedBook.title} - Season {selectedSeason.seasonNumber}
        </h2>
        <h1 className="text-3xl md:text-4xl font-bold text-white">
          Ep {selectedEpisode.episodeNumber}: {selectedEpisode.title}
        </h1>
      </div>

      <div className="prose prose-invert prose-lg max-w-none mb-12 font-serif leading-loose text-slate-200">
        {selectedEpisode.content.split('\n').map((para, i) => (
          <p key={i}>{para}</p>
        ))}
      </div>

      {/* Interaction Bar */}
      <div className="flex items-center justify-between py-6 border-t border-b border-slate-800 mb-8">
        <div className="flex gap-6">
          <button 
            onClick={() => toggleLike(selectedBook.id, selectedSeason.id, selectedEpisode.id, true)}
            className="flex items-center gap-2 text-slate-400 hover:text-pink-500 transition-colors"
          >
            <Heart className="w-6 h-6" /> <span>{selectedEpisode.likes}</span>
          </button>
          <div className="flex items-center gap-2 text-slate-400">
             <MessageSquare className="w-6 h-6" /> <span>{selectedEpisode.comments.length}</span>
          </div>
        </div>
        <button 
          onClick={handleNextEpisode}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-full font-bold transition-colors"
        >
          Next Episode
        </button>
      </div>

      {/* Comments */}
      <div className="space-y-6">
        <h3 className="text-xl font-bold text-white">Comments</h3>
        <div className="flex gap-4">
          <input 
            type="text" 
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Write a comment..."
            className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
          />
          <button 
            onClick={handlePostComment}
            className="p-2 bg-indigo-600 rounded-lg hover:bg-indigo-700 text-white"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          {selectedEpisode.comments.map(comment => (
            <div key={comment.id} className="flex gap-3">
              <img src={comment.userAvatar} alt="" className="w-8 h-8 rounded-full" />
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-200 text-sm">{comment.username}</span>
                  <span className="text-xs text-slate-500">{new Date(comment.timestamp).toLocaleDateString()}</span>
                </div>
                <p className="text-slate-300 text-sm mt-1">{comment.content}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};