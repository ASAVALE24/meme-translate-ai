import React from 'react';
import { TranslationResult as TranslationResultType, InputAnalysis, SavedItem } from '../types';
import { BookOpen, Image as ImageIcon, Layers, MessageCircle, Volume2, Star, AlertTriangle } from 'lucide-react';

interface Props {
  data: TranslationResultType;
  imageUrl: string | null;
  isImageLoading: boolean;
  onSave: (item: Omit<SavedItem, 'id' | 'timestamp'>) => void;
  savedIds: string[];
}

export const TranslationResult: React.FC<Props> = ({ data, imageUrl, isImageLoading, onSave, savedIds }) => {
  
  const playAudio = (text: string, lang: 'en' | 'zh' = 'en') => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang === 'zh' ? 'zh-CN' : 'en-US';
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="w-full max-w-5xl mx-auto mt-12 px-4 pb-20 space-y-8">
      
      {/* Correction Card - Full Width */}
      {data.inputAnalysis && data.inputAnalysis.hasIssue && (
        <div className="bg-white rounded-[32px] p-6 shadow-[0_10px_30px_rgba(0,0,0,0.05)] flex flex-col md:flex-row items-start gap-4 relative overflow-hidden border border-red-50">
           <div className="bg-red-50 p-3 rounded-2xl shrink-0 text-red-400">
             <AlertTriangle className="w-6 h-6" />
           </div>
           <div className="relative z-10">
             <h3 className="font-bold text-slate-800 text-lg mb-1">Did you mean...?</h3>
             <p className="text-slate-500 mb-3">{data.inputAnalysis.explanation}</p>
             <div className="bg-slate-50 rounded-xl p-3 inline-flex items-center gap-2">
               <span className="font-bold text-slate-800">{data.inputAnalysis.corrected}</span>
               <button 
                  onClick={() => playAudio(data.inputAnalysis.corrected)}
                  className="p-1 text-slate-400 hover:text-yellow-500 transition-colors"
               >
                  <Volume2 className="w-4 h-4" />
               </button>
             </div>
           </div>
        </div>
      )}

      {/* Masonry Layout for Symmetrical Columns */}
      <div className="columns-1 lg:columns-2 gap-8 space-y-8">
        
        {/* Main Translation */}
        <div className="break-inside-avoid bg-white rounded-[32px] shadow-[0_10px_30px_rgba(0,0,0,0.05)] overflow-hidden p-8 group border border-slate-50 mb-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-yellow-100 p-2.5 rounded-2xl text-yellow-600">
                <MessageCircle className="w-5 h-5 fill-current" />
              </div>
              <h2 className="font-bold text-slate-800 text-lg">Translation</h2>
            </div>
            <div className="flex gap-2">
               <button 
                 onClick={() => playAudio(data.mainTranslation, data.isChineseInput ? 'en' : 'zh')}
                 className="p-2.5 rounded-2xl bg-slate-50 hover:bg-yellow-100 text-slate-400 hover:text-yellow-600 transition-colors"
               >
                 <Volume2 className="w-5 h-5" />
               </button>
               <button 
                 onClick={() => onSave({ type: 'term', content: data.mainTranslation, subContent: data.inputAnalysis.corrected })}
                 className="p-2.5 rounded-2xl bg-slate-50 hover:bg-yellow-100 text-slate-400 hover:text-yellow-500 transition-colors"
               >
                 <Star className="w-5 h-5" />
               </button>
            </div>
          </div>
          <div className="text-4xl font-black text-slate-800 leading-tight">
            {data.mainTranslation}
          </div>
        </div>

        {/* Illustration - Moves naturally now */}
        <div className="break-inside-avoid bg-white rounded-[32px] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] border border-slate-50 overflow-hidden p-2 mb-8">
           <div className="bg-slate-50 rounded-[24px] p-4 flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-slate-400" />
                <h2 className="font-bold text-slate-600">Illustration</h2>
              </div>
              {isImageLoading && <span className="text-xs font-bold text-yellow-500 bg-yellow-50 px-3 py-1 rounded-full animate-pulse">Drawing...</span>}
           </div>
           
           <div className="relative w-full aspect-[4/3] bg-slate-100 rounded-[24px] overflow-hidden flex items-center justify-center group">
              {imageUrl ? (
                <img 
                  src={imageUrl} 
                  alt="Generated Illustration" 
                  className="w-full h-full object-cover" 
                />
              ) : isImageLoading ? (
                <div className="flex flex-col items-center">
                   <div className="w-12 h-12 border-4 border-slate-200 border-t-yellow-400 rounded-full animate-spin mb-4"></div>
                   <p className="text-slate-400 text-sm font-bold">Generating...</p>
                </div>
              ) : (
                 <div className="text-slate-300 flex flex-col items-center gap-2">
                   <ImageIcon className="w-10 h-10 opacity-50" />
                 </div>
              )}
           </div>
           <div className="p-4">
             <p className="text-xs text-slate-400 text-center leading-relaxed line-clamp-2">{data.imagePrompt}</p>
           </div>
        </div>

        {/* Variations (if available) */}
        {data.isChineseInput && data.variations && data.variations.length > 0 && (
          <div className="break-inside-avoid bg-white rounded-[32px] shadow-[0_10px_30px_rgba(0,0,0,0.05)] overflow-hidden p-6 border border-slate-50 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-orange-100 p-2.5 rounded-2xl text-orange-500">
                <Layers className="w-5 h-5" />
              </div>
              <h2 className="font-bold text-slate-800 text-lg">10 Expressions</h2>
            </div>
            <div className="grid grid-cols-1 gap-2">
              {data.variations.map((variant, idx) => (
                <div key={idx} className="group flex items-center justify-between p-4 rounded-2xl hover:bg-orange-50/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center text-xs font-bold">
                      {idx + 1}
                    </span>
                    <span className="text-slate-700 font-bold">{variant}</span>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                     <button onClick={() => playAudio(variant, 'en')} className="p-2 hover:bg-white rounded-full text-slate-400 hover:text-orange-500">
                       <Volume2 className="w-4 h-4" />
                     </button>
                     <button onClick={() => onSave({ type: 'phrase', content: variant })} className="p-2 hover:bg-white rounded-full text-slate-300 hover:text-yellow-500">
                       <Star className="w-4 h-4" />
                     </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Context Card */}
        <div className="break-inside-avoid bg-yellow-300 rounded-[32px] shadow-[0_15px_40px_-10px_rgba(250,204,21,0.4)] p-8 text-yellow-900 relative overflow-hidden mb-8">
          <div className="relative z-10">
            <h3 className="font-black text-xl mb-4 flex items-center gap-2 opacity-90">
               Context & Meme Check
            </h3>
            <p className="text-lg font-medium leading-relaxed opacity-90 mb-6">
              {data.culturalContext}
            </p>
            <div className="flex gap-2">
               <button 
                 onClick={() => playAudio(data.culturalContext)} 
                 className="p-2 bg-white/20 hover:bg-white/40 rounded-xl text-yellow-900 transition-colors"
               >
                 <Volume2 className="w-5 h-5" />
               </button>
               <button 
                 onClick={() => onSave({ type: 'context', content: data.culturalContext })} 
                 className="p-2 bg-white/20 hover:bg-white/40 rounded-xl text-yellow-900 transition-colors"
               >
                 <Star className="w-5 h-5" />
               </button>
            </div>
          </div>
        </div>

        {/* Examples */}
        <div className="break-inside-avoid bg-white rounded-[32px] shadow-[0_10px_30px_rgba(0,0,0,0.05)] overflow-hidden p-6 border border-slate-50 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-slate-100 p-2.5 rounded-2xl text-slate-500">
              <BookOpen className="w-5 h-5" />
            </div>
            <h2 className="font-bold text-slate-800 text-lg">Examples</h2>
          </div>
          <div className="space-y-2">
            {data.examples.map((ex, idx) => (
              <div key={idx} className="p-5 rounded-3xl hover:bg-slate-50 transition-colors group relative">
                <p className="text-slate-800 font-bold text-lg mb-1">{ex.original}</p>
                <p className="text-slate-400 font-medium">{ex.translated}</p>
                <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                   <button onClick={() => playAudio(ex.original)} className="p-2 bg-white rounded-full shadow-sm text-slate-400 hover:text-yellow-500">
                     <Volume2 className="w-4 h-4" />
                   </button>
                   <button 
                     onClick={() => onSave({ type: 'phrase', content: ex.original, subContent: ex.translated })} 
                     className="p-2 bg-white rounded-full shadow-sm text-slate-300 hover:text-yellow-500"
                   >
                     <Star className="w-4 h-4" />
                   </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
