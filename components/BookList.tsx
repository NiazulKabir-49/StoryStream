import React from 'react';
import { Book, AppView } from '../types';
import { useApp } from '../store/AppContext';
import { Eye, User } from 'lucide-react';

interface BookListProps {
  title: string;
  books: Book[];
}

const BookList: React.FC<BookListProps> = ({ title, books }) => {
  const { navigate } = useApp();

  if (books.length === 0) return null;

  return (
    <div className="py-8">
      <h2 className="text-2xl font-bold text-white mb-6 px-4 border-l-4 border-indigo-500 ml-4 md:ml-0">
        {title}
      </h2>
      
      <div className="flex overflow-x-auto gap-6 px-4 pb-4 snap-x hide-scrollbar">
        {books.map((book) => (
          <div 
            key={book.id}
            onClick={() => navigate(AppView.BOOK_DETAILS, book.id)}
            className="flex-shrink-0 w-40 md:w-48 cursor-pointer group snap-start"
          >
            <div className="relative aspect-[2/3] rounded-lg overflow-hidden mb-3">
              <img 
                src={book.coverUrl} 
                alt={book.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                <div className="flex items-center gap-1 text-xs text-slate-300">
                  <Eye className="w-3 h-3" />
                  {book.totalViews}
                </div>
              </div>
            </div>
            
            <h3 className="text-white font-semibold truncate group-hover:text-indigo-400 transition-colors">
              {book.title}
            </h3>
            <div className="flex items-center gap-1 text-sm text-slate-400">
              <User className="w-3 h-3" />
              <span className="truncate">{book.authorName}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookList;