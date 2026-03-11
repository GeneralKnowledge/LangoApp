import { AppSettings, ModuleId } from './types';

export const SUPPORTED_LANGUAGES = [
  ['en', 'English'], ['es', 'Spanish'], ['fr', 'French'], ['ar', 'Arabic'], ['hi', 'Hindi'], ['zh', 'Mandarin Chinese'],
  ['pt', 'Portuguese'], ['ru', 'Russian'], ['de', 'German'], ['ja', 'Japanese'], ['sw', 'Swahili'], ['bn', 'Bengali'],
  ['ur', 'Urdu'], ['id', 'Indonesian'], ['tr', 'Turkish'], ['ko', 'Korean'], ['vi', 'Vietnamese'], ['it', 'Italian'], ['th', 'Thai']
] as const;

export const SUPPORTED_LANGUAGE_CODES = SUPPORTED_LANGUAGES.map(([code]) => code);

export const MODULES: ModuleId[] = ['GREETINGS', 'POLITENESS', 'BASICS', 'INTRO', 'NUMBERS', 'FOOD', 'DIRECTIONS', 'TRANSPORT', 'EMERGENCY'];

export const DEFAULT_SETTINGS: AppSettings = {
  schemaVersion: 1,
  uiLanguage: 'en',
  targetLanguages: ['es'],
  speechRate: 1,
  slowMode: false,
  selectedVoiceByLang: {}
};
