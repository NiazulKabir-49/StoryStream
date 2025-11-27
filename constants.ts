import { Book, User, UserRole, Ad } from './types';

export const GENRES = [
  "Fantasy", "Sci-Fi", "Romance", "Mystery", "Thriller", "Horror", "Historical", "Drama"
];

export const MOCK_ADS: Ad[] = [
  { id: '1', imageUrl: 'https://picsum.photos/1200/150?random=10', link: '#', alt: 'Premium Coffee' },
  { id: '2', imageUrl: 'https://picsum.photos/1200/150?random=11', link: '#', alt: 'Tech Gadgets' },
  { id: '3', imageUrl: 'https://picsum.photos/1200/150?random=12', link: '#', alt: 'Travel Agency' },
];

export const MOCK_USER: User = {
  id: 'u1',
  username: 'StoryLover99',
  email: 'reader@example.com',
  avatarUrl: 'https://picsum.photos/200/200?random=1',
  bio: 'I love reading mystery novels.',
  country: 'USA',
  contactNumber: '+1234567890',
  role: UserRole.AUTHOR,
  favorites: [],
  following: []
};

export const INITIAL_BOOKS: Book[] = [
  {
    id: 'b1',
    authorId: 'u1',
    authorName: 'StoryLover99',
    title: 'The Midnight Chronicles',
    coverUrl: 'https://picsum.photos/300/450?random=1',
    description: 'A detective discovers a hidden world beneath the city streets.',
    genre: 'Mystery',
    totalViews: 12500,
    tags: ['Detective', 'Magic', 'Noir'],
    createdAt: Date.now() - 10000000,
    updatedAt: Date.now(),
    seasons: [
      {
        id: 's1',
        seasonNumber: 1,
        episodes: [
          {
            id: 'e1',
            episodeNumber: 1,
            title: 'The First Clue',
            content: 'It was a dark and stormy night...',
            views: 5000,
            likes: 120,
            dislikes: 2,
            comments: [],
            publishedAt: Date.now() - 10000000
          },
          {
            id: 'e2',
            episodeNumber: 2,
            title: 'Shadows Move',
            content: 'The shadows seemed to dance on the walls...',
            views: 4500,
            likes: 110,
            dislikes: 1,
            comments: [],
            publishedAt: Date.now() - 9000000
          }
        ]
      },
      {
        id: 's2',
        seasonNumber: 2,
        episodes: [
          {
            id: 'e3',
            episodeNumber: 1,
            title: 'New Beginnings',
            content: 'Chapter 2 starts here...',
            views: 3000,
            likes: 90,
            dislikes: 5,
            comments: [],
            publishedAt: Date.now() - 5000000
          }
        ]
      }
    ]
  },
  {
    id: 'b2',
    authorId: 'u2',
    authorName: 'JaneDoe',
    title: 'Galactic Horizons',
    coverUrl: 'https://picsum.photos/300/450?random=2',
    description: 'Humanity reaches for the stars, but finds something else looking back.',
    genre: 'Sci-Fi',
    totalViews: 8900,
    tags: ['Space', 'Aliens', 'War'],
    createdAt: Date.now() - 8000000,
    updatedAt: Date.now(),
    seasons: [
      {
        id: 's1',
        seasonNumber: 1,
        episodes: [
          {
            id: 'e1',
            episodeNumber: 1,
            title: 'Liftoff',
            content: 'The engines roared to life...',
            views: 8900,
            likes: 300,
            dislikes: 10,
            comments: [],
            publishedAt: Date.now() - 8000000
          }
        ]
      }
    ]
  }
];