import React, { useState } from 'react';
import { useApp } from '../store/AppContext';
import { UserRole } from '../types';
import { AppView } from '../types';

export const Auth: React.FC = () => {
  const { login, navigate } = useApp();
  const [isSignup, setIsSignup] = useState(false);
  const [role, setRole] = useState<UserRole>(UserRole.READER);
  const [username, setUsername] = useState('');

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock Login
    login({
      id: `u${Date.now()}`,
      username: username || 'NewUser',
      email: `${username}@example.com`,
      avatarUrl: `https://picsum.photos/200/200?random=${Date.now()}`,
      bio: 'Just joined!',
      country: 'Unknown',
      contactNumber: '',
      role: role,
      favorites: [],
      following: []
    });
    navigate(AppView.HOME);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-slate-900 to-indigo-900">
      <div className="bg-slate-800 p-8 rounded-2xl shadow-2xl w-full max-w-md border border-slate-700">
        <h2 className="text-3xl font-bold text-white mb-6 text-center">{isSignup ? 'Join StoryStream' : 'Welcome Back'}</h2>
        
        <form onSubmit={handleAuth} className="space-y-4">
          <div>
            <label className="block text-slate-400 text-sm mb-1">Username</label>
            <input 
              type="text" 
              required 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none" 
            />
          </div>
          
          {isSignup && (
             <div>
               <label className="block text-slate-400 text-sm mb-1">Account Type</label>
               <div className="flex bg-slate-900 rounded-lg p-1">
                 <button 
                   type="button"
                   onClick={() => setRole(UserRole.READER)}
                   className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${role === UserRole.READER ? 'bg-slate-700 text-white' : 'text-slate-400'}`}
                 >
                   Reader
                 </button>
                 <button 
                   type="button"
                   onClick={() => setRole(UserRole.AUTHOR)}
                   className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${role === UserRole.AUTHOR ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}
                 >
                   Author
                 </button>
               </div>
             </div>
          )}

          <button 
            type="submit" 
            className="w-full bg-gradient-to-r from-indigo-500 to-cyan-500 text-white font-bold py-3 rounded-lg hover:opacity-90 transition-opacity mt-4"
          >
            {isSignup ? 'Create Account' : 'Login'}
          </button>
        </form>

        <p className="text-center text-slate-400 mt-6 text-sm">
          {isSignup ? 'Already have an account?' : "Don't have an account?"} {' '}
          <button onClick={() => setIsSignup(!isSignup)} className="text-indigo-400 hover:underline">
            {isSignup ? 'Login' : 'Sign Up'}
          </button>
        </p>
      </div>
    </div>
  );
};