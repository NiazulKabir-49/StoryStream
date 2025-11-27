import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Book, User, AppView, Season, Episode, Comment, UserRole } from '../types';
import { INITIAL_BOOKS, MOCK_USER } from '../constants';

interface AppContextType {
  user: User | null;
  books: Book[];
  currentView: AppView;
  selectedBook: Book | null;
  selectedEpisode: Episode | null;
  selectedSeason: Season | null;
  
  // Navigation
  navigate: (view: AppView, bookId?: string, seasonId?: string, episodeId?: string) => void;
  
  // Actions
  login: (userData: User) => void;
  logout: () => void;
  updateUserProfile: (data: Partial<User>) => void;
  
  // Content Actions
  addBook: (book: Book) => void;
  addSeason: (bookId: string) => void;
  addEpisode: (bookId: string, seasonId: string, episode: Episode) => void;
  incrementViews: (bookId: string, seasonId: string, episodeId: string) => void;
  toggleLike: (bookId: string, seasonId: string, episodeId: string, isLike: boolean) => void;
  addComment: (bookId: string, seasonId: string, episodeId: string, content: string) => void;
  toggleFavorite: (bookId: string) => void;
  toggleFollow: (authorId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(MOCK_USER); // Default logged in for demo
  const [books, setBooks] = useState<Book[]>(INITIAL_BOOKS);
  const [currentView, setCurrentView] = useState<AppView>(AppView.HOME);
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null);
  const [selectedSeasonId, setSelectedSeasonId] = useState<string | null>(null);
  const [selectedEpisodeId, setSelectedEpisodeId] = useState<string | null>(null);

  // Derived state helpers
  const selectedBook = books.find(b => b.id === selectedBookId) || null;
  const selectedSeason = selectedBook?.seasons.find(s => s.id === selectedSeasonId) || null;
  const selectedEpisode = selectedSeason?.episodes.find(e => e.id === selectedEpisodeId) || null;

  const navigate = (view: AppView, bookId?: string, seasonId?: string, episodeId?: string) => {
    setCurrentView(view);
    if (bookId) setSelectedBookId(bookId);
    if (seasonId) setSelectedSeasonId(seasonId);
    if (episodeId) setSelectedEpisodeId(episodeId);
    window.scrollTo(0, 0);
  };

  const login = (userData: User) => setUser(userData);
  const logout = () => {
    setUser(null);
    setCurrentView(AppView.AUTH);
  };

  const updateUserProfile = (data: Partial<User>) => {
    if (user) setUser({ ...user, ...data });
  };

  const addBook = (newBook: Book) => {
    setBooks(prev => [newBook, ...prev]);
  };

  const addSeason = (bookId: string) => {
    setBooks(prev => prev.map(book => {
      if (book.id !== bookId) return book;
      const nextSeasonNum = book.seasons.length + 1;
      const newSeason: Season = {
        id: `s${Date.now()}`,
        seasonNumber: nextSeasonNum,
        episodes: []
      };
      return { ...book, seasons: [...book.seasons, newSeason] };
    }));
  };

  const addEpisode = (bookId: string, seasonId: string, episode: Episode) => {
    setBooks(prev => prev.map(book => {
      if (book.id !== bookId) return book;
      return {
        ...book,
        seasons: book.seasons.map(season => {
          if (season.id !== seasonId) return season;
          return { ...season, episodes: [...season.episodes, episode] };
        }),
        updatedAt: Date.now()
      };
    }));
  };

  const incrementViews = (bookId: string, seasonId: string, episodeId: string) => {
    setBooks(prev => prev.map(book => {
      if (book.id !== bookId) return book;
      
      const newSeasons = book.seasons.map(season => {
        if (season.id !== seasonId) return season;
        const newEpisodes = season.episodes.map(ep => {
          if (ep.id !== episodeId) return ep;
          return { ...ep, views: ep.views + 1 };
        });
        return { ...season, episodes: newEpisodes };
      });

      return { ...book, totalViews: book.totalViews + 1, seasons: newSeasons };
    }));
  };

  const toggleLike = (bookId: string, seasonId: string, episodeId: string, isLike: boolean) => {
    setBooks(prev => prev.map(book => {
      if (book.id !== bookId) return book;
      return {
        ...book,
        seasons: book.seasons.map(season => {
          if (season.id !== seasonId) return season;
          return {
            ...season,
            episodes: season.episodes.map(ep => {
              if (ep.id !== episodeId) return ep;
              return {
                ...ep,
                likes: isLike ? ep.likes + 1 : ep.likes,
                dislikes: !isLike ? ep.dislikes + 1 : ep.dislikes
              };
            })
          };
        })
      };
    }));
  };

  const addComment = (bookId: string, seasonId: string, episodeId: string, content: string) => {
    if (!user) return;
    const newComment: Comment = {
      id: `c${Date.now()}`,
      userId: user.id,
      username: user.username,
      userAvatar: user.avatarUrl,
      content,
      timestamp: Date.now()
    };

    setBooks(prev => prev.map(book => {
      if (book.id !== bookId) return book;
      return {
        ...book,
        seasons: book.seasons.map(season => {
          if (season.id !== seasonId) return season;
          return {
            ...season,
            episodes: season.episodes.map(ep => {
              if (ep.id !== episodeId) return ep;
              return { ...ep, comments: [newComment, ...ep.comments] };
            })
          };
        })
      };
    }));
  };

  const toggleFavorite = (bookId: string) => {
    if (!user) return;
    const isFav = user.favorites.includes(bookId);
    const newFavs = isFav ? user.favorites.filter(id => id !== bookId) : [...user.favorites, bookId];
    setUser({ ...user, favorites: newFavs });
  };

  const toggleFollow = (authorId: string) => {
    if (!user) return;
    const isFollowing = user.following.includes(authorId);
    const newFollowing = isFollowing ? user.following.filter(id => id !== authorId) : [...user.following, authorId];
    setUser({ ...user, following: newFollowing });
  };

  return (
    <AppContext.Provider value={{
      user, books, currentView, selectedBook, selectedEpisode, selectedSeason,
      navigate, login, logout, updateUserProfile,
      addBook, addSeason, addEpisode, incrementViews, toggleLike, addComment,
      toggleFavorite, toggleFollow
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
};