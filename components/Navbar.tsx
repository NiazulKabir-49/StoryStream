import React from 'react';
import { useApp } from '../store/AppContext';
import { AppView, UserRole } from '../types';
import { BookOpen, Search, User as UserIcon, LogOut, LayoutDashboard } from 'lucide-react';

const Navbar: React.FC = () => {
  const { user, navigate, logout } = useApp();

  return (
    <nav className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <div 
            className="flex items-center cursor-pointer gap-2" 
            onClick={() => navigate(AppView.HOME)}
          >
            <BookOpen className="h-8 w-8 text-indigo-500" />
            <span className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
              StoryStream
            </span>
          </div>

          {/* Search Bar - Hidden on mobile for simplicity */}
          <div className="hidden md:block flex-1 max-w-md mx-8">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="h-5 w-5 text-slate-400" />
              </span>
              <input 
                type="text" 
                placeholder="Search stories, genres, authors..."
                className="w-full bg-slate-800 border border-slate-700 rounded-full py-2 pl-10 pr-4 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              />
            </div>
          </div>

          {/* Right Menu */}
          <div className="flex items-center gap-4">
            {user ? (
              <>
                {user.role === UserRole.AUTHOR && (
                  <button 
                    onClick={() => navigate(AppView.DASHBOARD)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition-colors"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    <span className="hidden sm:inline">Dashboard</span>
                  </button>
                )}
                
                <div 
                  className="flex items-center gap-2 cursor-pointer hover:bg-slate-800 p-2 rounded-full transition-colors"
                  onClick={() => navigate(AppView.PROFILE)}
                >
                  <img src={user.avatarUrl} alt="Avatar" className="h-8 w-8 rounded-full border border-slate-600 object-cover" />
                </div>
                
                <button 
                  onClick={logout}
                  className="p-2 text-slate-400 hover:text-red-400 transition-colors"
                  title="Logout"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </>
            ) : (
              <button 
                onClick={() => navigate(AppView.AUTH)}
                className="text-sm font-medium text-white bg-indigo-600 px-4 py-2 rounded-full hover:bg-indigo-700 transition-all"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;