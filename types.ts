export enum UserRole {
  READER = 'READER',
  AUTHOR = 'AUTHOR'
}

export interface User {
  id: string;
  username: string;
  email: string;
  avatarUrl: string;
  bio: string;
  country: string;
  contactNumber: string;
  role: UserRole;
  favorites: string[]; // Book IDs
  following: string[]; // Author IDs
}

export interface Comment {
  id: string;
  userId: string;
  username: string;
  userAvatar: string;
  content: string;
  timestamp: number;
}

export interface Episode {
  id: string;
  episodeNumber: number;
  title: string;
  content: string;
  views: number;
  likes: number;
  dislikes: number;
  comments: Comment[];
  publishedAt: number;
}

export interface Season {
  id: string;
  seasonNumber: number;
  episodes: Episode[];
}

export interface Book {
  id: string;
  authorId: string;
  authorName: string;
  title: string;
  coverUrl: string;
  description: string;
  genre: string;
  seasons: Season[];
  totalViews: number;
  tags: string[];
  createdAt: number;
  updatedAt: number;
}

export enum AppView {
  HOME = 'HOME',
  BOOK_DETAILS = 'BOOK_DETAILS',
  READ_EPISODE = 'READ_EPISODE',
  DASHBOARD = 'DASHBOARD',
  PROFILE = 'PROFILE',
  AUTH = 'AUTH'
}

export interface Ad {
  id: string;
  imageUrl: string;
  link: string;
  alt: string;
}