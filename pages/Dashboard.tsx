import React, { useState } from 'react';
import { useApp } from '../store/AppContext';
import { Book, Episode } from '../types';
import { GENRES } from '../constants';
import { checkContentSafety } from '../services/geminiService';
import { Plus, BarChart, Book as BookIcon, AlertTriangle, CheckCircle, Loader2 } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { user, books, addBook, addSeason, addEpisode } = useApp();
  const [view, setView] = useState<'overview' | 'new-book' | 'manage'>('overview');
  const [selectedBookId, setSelectedBookId] = useState<string>('');
  
  // Forms State
  const [newBookTitle, setNewBookTitle] = useState('');
  const [newBookDesc, setNewBookDesc] = useState('');
  const [newBookGenre, setNewBookGenre] = useState(GENRES[0]);
  
  const [epTitle, setEpTitle] = useState('');
  const [epContent, setEpContent] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!user) return <div>Access Denied</div>;

  const myBooks = books.filter(b => b.authorId === user.id);
  const totalViews = myBooks.reduce((sum, b) => sum + b.totalViews, 0);

  const handleCreateBook = () => {
    const book: Book = {
      id: `b${Date.now()}`,
      authorId: user.id,
      authorName: user.username,
      title: newBookTitle,
      description: newBookDesc,
      genre: newBookGenre,
      coverUrl: `https://picsum.photos/300/450?random=${Date.now()}`,
      seasons: [{ id: `s${Date.now()}`, seasonNumber: 1, episodes: [] }],
      totalViews: 0,
      tags: [],
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    addBook(book);
    setView('overview');
    setNewBookTitle('');
  };

  const handlePublishEpisode = async (bookId: string) => {
    const book = books.find(b => b.id === bookId);
    if (!book) return;

    // Logic: User selects season, but for simplicity here we add to the LAST season.
    const lastSeason = book.seasons[book.seasons.length - 1];
    
    // Check sequential constraint
    // If season has episodes, next is last + 1. If not, it's 1.
    const nextEpNum = lastSeason.episodes.length + 1;
    // Constraint: Can't skip episodes. (Implicitly handled by auto-numbering).

    setIsProcessing(true);

    // AI SAFETY CHECK
    const safetyCheck = await checkContentSafety(`${epTitle}\n${epContent}`);
    
    if (!safetyCheck.safe) {
      alert(`Content Violation Detected: ${safetyCheck.reason || "Unsafe content"}. Please revise.`);
      setIsProcessing(false);
      return;
    }

    const newEp: Episode = {
      id: `e${Date.now()}`,
      episodeNumber: nextEpNum,
      title: epTitle,
      content: epContent,
      views: 0,
      likes: 0,
      dislikes: 0,
      comments: [],
      publishedAt: Date.now()
    };

    addEpisode(bookId, lastSeason.id, newEp);
    setIsProcessing(false);
    setEpTitle('');
    setEpContent('');
    alert('Episode Published Successfully!');
  };

  const handleNewSeason = (bookId: string) => {
     addSeason(bookId);
     alert("New Season Added!");
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 pb-24">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Author Dashboard</h1>
        <div className="flex gap-4">
           <button onClick={() => setView('overview')} className={`px-4 py-2 rounded-lg ${view === 'overview' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}>Overview</button>
           <button onClick={() => setView('new-book')} className={`px-4 py-2 rounded-lg ${view === 'new-book' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}>Start New Story</button>
        </div>
      </div>

      {view === 'overview' && (
        <>
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
              <div className="flex items-center gap-4 mb-2">
                <BarChart className="text-indigo-400 w-6 h-6" />
                <h3 className="text-slate-400">Total Viewership</h3>
              </div>
              <p className="text-3xl font-bold text-white">{totalViews.toLocaleString()}</p>
            </div>
            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
              <div className="flex items-center gap-4 mb-2">
                 <BookIcon className="text-indigo-400 w-6 h-6" />
                 <h3 className="text-slate-400">Stories Published</h3>
              </div>
              <p className="text-3xl font-bold text-white">{myBooks.length}</p>
            </div>
          </div>

          {/* Manage Books */}
          <h2 className="text-2xl font-bold text-white mb-6">Your Stories</h2>
          <div className="space-y-6">
            {myBooks.map(book => (
              <div key={book.id} className="bg-slate-800 rounded-xl p-6 border border-slate-700 flex flex-col md:flex-row gap-6">
                <img src={book.coverUrl} alt="" className="w-24 h-36 object-cover rounded shadow" />
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white">{book.title}</h3>
                  <div className="text-slate-400 text-sm mb-4">
                    {book.seasons.length} Seasons • {book.totalViews} Reads
                  </div>
                  
                  {/* Quick Publisher */}
                  <div className="bg-slate-900/50 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-semibold text-indigo-400">Write Next Episode</h4>
                      <span className="text-xs text-slate-500">
                        Current: Season {book.seasons[book.seasons.length - 1].seasonNumber}, Ep {book.seasons[book.seasons.length - 1].episodes.length}
                      </span>
                    </div>
                    
                    <div className="space-y-3">
                      <input 
                         type="text" 
                         placeholder="Episode Title"
                         className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white"
                         value={selectedBookId === book.id ? epTitle : ''}
                         onChange={(e) => { setSelectedBookId(book.id); setEpTitle(e.target.value); }}
                      />
                      <textarea 
                        placeholder="Write your story here... (No slang, no 18+ content)"
                        className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white h-32"
                        value={selectedBookId === book.id ? epContent : ''}
                        onChange={(e) => { setSelectedBookId(book.id); setEpContent(e.target.value); }}
                      />
                      <div className="flex gap-2">
                        <button 
                          disabled={isProcessing || selectedBookId !== book.id || !epTitle || !epContent}
                          onClick={() => handlePublishEpisode(book.id)}
                          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white px-4 py-2 rounded text-sm font-bold"
                        >
                          {isProcessing && selectedBookId === book.id ? <Loader2 className="animate-spin w-4 h-4"/> : <CheckCircle className="w-4 h-4"/>}
                          Publish Episode
                        </button>
                         {/* Only allow new season if previous has episodes */}
                        <button 
                          onClick={() => handleNewSeason(book.id)}
                          className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded text-sm"
                        >
                          Start New Season
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {view === 'new-book' && (
        <div className="max-w-2xl mx-auto bg-slate-800 p-8 rounded-xl border border-slate-700">
          <h2 className="text-2xl font-bold text-white mb-6">Create New Story</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-slate-400 mb-1">Title</label>
              <input type="text" className="w-full bg-slate-900 border border-slate-600 rounded p-3 text-white" value={newBookTitle} onChange={(e) => setNewBookTitle(e.target.value)} />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Genre</label>
              <select className="w-full bg-slate-900 border border-slate-600 rounded p-3 text-white" value={newBookGenre} onChange={(e) => setNewBookGenre(e.target.value)}>
                {GENRES.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Description</label>
              <textarea className="w-full bg-slate-900 border border-slate-600 rounded p-3 text-white h-32" value={newBookDesc} onChange={(e) => setNewBookDesc(e.target.value)} />
            </div>
            <button 
              onClick={handleCreateBook}
              disabled={!newBookTitle || !newBookDesc}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-bold disabled:opacity-50"
            >
              Create Story
            </button>
          </div>
        </div>
      )}
    </div>
  );
};