export type ModuleId = 'GREETINGS' | 'POLITENESS' | 'BASICS' | 'INTRO' | 'NUMBERS' | 'FOOD' | 'DIRECTIONS' | 'TRANSPORT' | 'EMERGENCY';
export type Grade = 'again' | 'hard' | 'good' | 'easy';

export interface PhraseItem {
  id: string;
  module: ModuleId;
  difficulty: 1 | 2 | 3;
  meaning: Record<string, string>;
  say: { native: string; romanization?: string | null };
  notes?: string;
}

export interface PhrasePack {
  languageCode: string;
  languageName: string;
  version: number;
  phrases: PhraseItem[];
}

export interface ReviewState {
  phraseId: string;
  targetLang: string;
  dueAt: string;
  intervalDays: number;
  easeFactor: number;
  repetitions: number;
  lastGrade: Grade | null;
  lastReviewedAt?: string;
  isNew: boolean;
}

export interface AppSettings {
  uiLanguage: string;
  targetLanguages: string[];
  speechRate: number;
  slowMode: boolean;
  selectedVoiceByLang: Record<string, string>;
}
