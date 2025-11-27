import React from 'react';
import { AppProvider, useApp } from './store/AppContext';
import Navbar from './components/Navbar';
import AdBanner from './components/AdBanner';
import Home from './pages/Home';
import { BookDetails, EpisodeReader } from './pages/BookView';
import { Dashboard } from './pages/Dashboard';
import { Profile } from './pages/Profile';
import { Auth } from './pages/Auth';
import { AppView } from './types';

const MainContent: React.FC = () => {
  const { currentView } = useApp();

  // Route Rendering Logic
  const renderView = () => {
    switch (currentView) {
      case AppView.HOME:
        return <Home />;
      case AppView.BOOK_DETAILS:
        return <BookDetails />;
      case AppView.READ_EPISODE:
        return <EpisodeReader />;
      case AppView.DASHBOARD:
        return <Dashboard />;
      case AppView.PROFILE:
        return <Profile />;
      case AppView.AUTH:
        return <Auth />;
      default:
        return <Home />;
    }
  };

  if (currentView === AppView.AUTH) {
    return <Auth />;
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans selection:bg-indigo-500/30">
      <Navbar />
      <main>
        {renderView()}
      </main>
      <AdBanner />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
};

export default App;