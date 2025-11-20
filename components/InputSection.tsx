import React, { useState } from 'react';
import { ArrowRight, Loader2, Sparkles } from 'lucide-react';

interface InputSectionProps {
  onTranslate: (text: string) => void;
  isLoading: boolean;
}

export const InputSection: React.FC<InputSectionProps> = ({ onTranslate, isLoading }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onTranslate(text);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (text.trim()) onTranslate(text);
    }
  };

  return (
    <section className="w-full relative z-10">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative bg-white rounded-[32px] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.08)] p-3 flex flex-col md:flex-row gap-3 transition-all border border-slate-50">
          
          <div className="flex-grow relative">
             <div className="absolute top-5 left-5 bg-yellow-100 text-yellow-500 p-2 rounded-xl pointer-events-none">
               <Sparkles className="w-5 h-5" />
             </div>
            <textarea
              className="w-full pl-16 pr-4 py-4 text-xl text-slate-700 placeholder-slate-300 bg-transparent border-none focus:ring-0 resize-none min-h-[100px] rounded-3xl outline-none"
              placeholder="Enter text to translate..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
            />
          </div>
          
          <button
            type="submit"
            disabled={!text.trim() || isLoading}
            className={`
              flex items-center justify-center gap-2 px-8 rounded-[24px] font-bold text-lg transition-all duration-300 flex-shrink-0 min-h-[60px] md:min-h-auto
              ${text.trim() && !isLoading 
                ? 'bg-yellow-400 hover:bg-yellow-500 text-white shadow-lg shadow-yellow-200 transform hover:-translate-y-1' 
                : 'bg-slate-100 text-slate-300 cursor-not-allowed'}
            `}
          >
            {isLoading ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <>
                Go <ArrowRight className="w-6 h-6" />
              </>
            )}
          </button>
        </div>
      </form>
    </section>
  );
};