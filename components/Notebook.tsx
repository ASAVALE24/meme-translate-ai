import React from 'react';
import { SavedItem } from '../types';
import { Trash2, Volume2, X } from 'lucide-react';

interface NotebookProps {
  isOpen: boolean;
  onClose: () => void;
  savedItems: SavedItem[];
  onRemove: (id: string) => void;
}

export const Notebook: React.FC<NotebookProps> = ({ isOpen, onClose, savedItems, onRemove }) => {
  const handleSpeak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-slate-900/10 backdrop-blur-sm z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <div className={`fixed top-0 right-0 h-full w-full sm:w-[400px] bg-[#fffdf5] z-50 shadow-[-20px_0_50px_rgba(0,0,0,0.05)] transform transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1) flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-6 flex items-center justify-between">
          <h2 className="text-2xl font-black text-slate-800 flex items-center gap-2">
            Notebook
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-yellow-100 rounded-full text-slate-400 hover:text-yellow-600 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {savedItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center opacity-40">
              <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mb-4 text-4xl">🐣</div>
              <p className="text-slate-800 font-bold">Empty Nest</p>
            </div>
          ) : (
            savedItems.map((item) => (
              <div key={item.id} className="bg-white p-5 rounded-[24px] shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.05)] border border-slate-50 transition-all group">
                <div className="flex justify-between items-start mb-3">
                   <span className="text-[10px] font-black uppercase tracking-wider bg-yellow-100 text-yellow-600 px-2.5 py-1 rounded-lg">
                     {item.type}
                   </span>
                   <div className="flex gap-1">
                     <button 
                       onClick={() => handleSpeak(item.content)}
                       className="p-1.5 text-slate-300 hover:text-yellow-500 hover:bg-yellow-50 rounded-full transition-colors"
                     >
                       <Volume2 className="w-4 h-4" />
                     </button>
                     <button 
                       onClick={() => onRemove(item.id)}
                       className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                     >
                       <Trash2 className="w-4 h-4" />
                     </button>
                   </div>
                </div>
                <div className="font-bold text-slate-800 text-lg break-words mb-1">{item.content}</div>
                {item.subContent && (
                  <div className="text-slate-400 text-sm font-medium">{item.subContent}</div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};