import React, { useState } from 'react';
import { useApp } from '../store/AppContext';
import { UserRole } from '../types';
import BookList from '../components/BookList';
import { Settings, Save } from 'lucide-react';

export const Profile: React.FC = () => {
  const { user, books, updateUserProfile } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  
  // Edit State
  const [bio, setBio] = useState(user?.bio || '');
  const [country, setCountry] = useState(user?.country || '');
  const [phone, setPhone] = useState(user?.contactNumber || '');

  if (!user) return <div>Please login</div>;

  const myFavorites = books.filter(b => user.favorites.includes(b.id));
  const myStories = books.filter(b => b.authorId === user.id);

  const handleSave = () => {
    updateUserProfile({ bio, country, contactNumber: phone });
    setIsEditing(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 pb-24">
      <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700 mb-12">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <img src={user.avatarUrl} alt="Profile" className="w-32 h-32 rounded-full border-4 border-slate-600" />
          
          <div className="flex-1 w-full">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-3xl font-bold text-white mb-1">{user.username}</h1>
                <p className="text-indigo-400 font-medium">{user.role === UserRole.AUTHOR ? 'Author' : 'Reader'}</p>
                <p className="text-slate-500 text-sm">{user.email}</p>
              </div>
              <button 
                onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                {isEditing ? <Save className="w-4 h-4"/> : <Settings className="w-4 h-4"/>}
                {isEditing ? 'Save Changes' : 'Edit Profile'}
              </button>
            </div>

            {isEditing ? (
              <div className="grid gap-4 bg-slate-900/50 p-4 rounded-lg">
                <div>
                  <label className="text-xs text-slate-500">Bio</label>
                  <textarea className="w-full bg-slate-800 rounded p-2 text-sm text-white border border-slate-700" value={bio} onChange={e => setBio(e.target.value)} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-slate-500">Country</label>
                    <input type="text" className="w-full bg-slate-800 rounded p-2 text-sm text-white border border-slate-700" value={country} onChange={e => setCountry(e.target.value)} />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500">Phone</label>
                    <input type="text" className="w-full bg-slate-800 rounded p-2 text-sm text-white border border-slate-700" value={phone} onChange={e => setPhone(e.target.value)} />
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-slate-300 space-y-2">
                <p>{user.bio || "No bio yet."}</p>
                <div className="flex gap-4 text-sm text-slate-500 mt-4">
                  <span>📍 {user.country || "Unknown"}</span>
                  {user.role === UserRole.AUTHOR && <span>📞 {user.contactNumber || "Hidden"}</span>}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {user.role === UserRole.AUTHOR && myStories.length > 0 && (
         <BookList title="My Published Stories" books={myStories} />
      )}

      <BookList title="My Reading List" books={myFavorites} />

      {myFavorites.length === 0 && user.role !== UserRole.AUTHOR && (
        <div className="text-center py-12 text-slate-500">
          You haven't added any stories to your library yet.
        </div>
      )}
    </div>
  );
};