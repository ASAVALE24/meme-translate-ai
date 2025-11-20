export interface ExampleSentence {
  original: string;
  translated: string;
}

export interface InputAnalysis {
  hasIssue: boolean;
  original: string;
  corrected: string;
  issueType: 'spelling' | 'grammar' | 'ambiguity' | 'stiff' | 'none';
  explanation: string;
}

export interface TranslationResult {
  inputAnalysis: InputAnalysis;
  isChineseInput: boolean;
  mainTranslation: string;
  variations: string[]; // Used if input is Chinese (need 10)
  culturalContext: string; // Explanation of slang/memes
  examples: ExampleSentence[];
  imagePrompt: string; // The prompt to generate the illustration
}

export interface SavedItem {
  id: string;
  type: 'term' | 'phrase' | 'context';
  content: string;
  subContent?: string;
  timestamp: number;
}

export interface AppState {
  inputText: string;
  isLoading: boolean;
  isImageLoading: boolean;
  result: TranslationResult | null;
  imageUrl: string | null;
  error: string | null;
  notebookOpen: boolean;
}