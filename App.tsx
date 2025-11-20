import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { InputSection } from './components/InputSection';
import { TranslationResult } from './components/TranslationResult';
import { Notebook } from './components/Notebook';
import { translateText, generateIllustration } from './services/geminiService';
import { TranslationResult as TranslationResultType, SavedItem } from './types';

export default function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [result, setResult] = useState<TranslationResultType | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Notebook State
  const [notebookOpen, setNotebookOpen] = useState(false);
  const [savedItems, setSavedItems] = useState<SavedItem[]>([]);

  // Load saved items from local storage on mount
  useEffect(() => {
    const stored = localStorage.getItem('meme_translator_notebook');
    if (stored) {
      try {
        setSavedItems(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse saved items");
      }
    }
  }, []);

  // Save to local storage whenever items change
  useEffect(() => {
    localStorage.setItem('meme_translator_notebook', JSON.stringify(savedItems));
  }, [savedItems]);

  const handleSaveItem = (item: Omit<SavedItem, 'id' | 'timestamp'>) => {
    const newItem: SavedItem = {
      ...item,
      id: Date.now().toString(),
      timestamp: Date.now(),
    };
    // Prevent duplicates roughly
    if (!savedItems.some(i => i.content === item.content)) {
      setSavedItems(prev => [newItem, ...prev]);
      setNotebookOpen(true); // Open notebook to show it happened
    }
  };

  const handleRemoveItem = (id: string) => {
    setSavedItems(prev => prev.filter(item => item.id !== id));
  };

  const handleTranslate = async (input: string) => {
    setIsLoading(true);
    setIsImageLoading(false);
    setError(null);
    setResult(null);
    setImageUrl(null);

    try {
      const translationData = await translateText(input);
      setResult(translationData);
      setIsLoading(false);
      
      if (translationData.imagePrompt) {
        setIsImageLoading(true);
        try {
          const img = await generateIllustration(translationData.imagePrompt);
          setImageUrl(img);
        } catch (imgErr) {
          console.error("Image gen error", imgErr);
        } finally {
          setIsImageLoading(false);
        }
      }

    } catch (err) {
      console.error(err);
      setError("Oops! Something went wrong. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f2f4f6] font-sans text-slate-800">
      <Header 
        onToggleNotebook={() => setNotebookOpen(true)} 
        notebookCount={savedItems.length}
      />
      
      <Notebook 
        isOpen={notebookOpen} 
        onClose={() => setNotebookOpen(false)} 
        savedItems={savedItems}
        onRemove={handleRemoveItem}
      />

      <main className={`flex-grow flex flex-col w-full relative transition-all duration-500 ${result ? 'pt-8' : 'justify-center pb-32'}`}>
        
        <div className="w-full max-w-3xl mx-auto px-4 z-10">
          <InputSection onTranslate={handleTranslate} isLoading={isLoading} />
        </div>

        {error && (
          <div className="mt-8 mx-auto max-w-md p-4 bg-red-50 border border-red-200 text-red-500 rounded-2xl font-bold text-center shadow-sm">
            {error}
          </div>
        )}

        {result && (
          <TranslationResult 
            data={result} 
            imageUrl={imageUrl} 
            isImageLoading={isImageLoading} 
            onSave={handleSaveItem}
            savedIds={savedItems.map(i => i.id)}
          />
        )}
      </main>
    </div>
  );
}