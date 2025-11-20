import React from 'react';
import { BookHeart } from 'lucide-react';

interface HeaderProps {
  onToggleNotebook: () => void;
  notebookCount: number;
}

export const Header: React.FC<HeaderProps> = ({ onToggleNotebook, notebookCount }) => {
  return (
    <header className="w-full py-4 px-6 flex items-center justify-end fixed top-0 z-40 pointer-events-none">
      <button 
        onClick={onToggleNotebook}
        className="pointer-events-auto relative group flex items-center gap-2 bg-white hover:bg-yellow-50 text-slate-700 px-5 py-3 rounded-[20px] font-bold shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all active:scale-95 border border-slate-100"
      >
        <div className="bg-yellow-400 p-1.5 rounded-full text-white">
           <BookHeart className="w-4 h-4 fill-current" />
        </div>
        <span className="hidden sm:inline text-sm">My Notebook</span>
        {notebookCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-sm border-2 border-white">
            {notebookCount}
          </span>
        )}
      </button>
    </header>
  );
};