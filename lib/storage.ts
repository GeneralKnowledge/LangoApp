import { AppSettings, ReviewState } from './types';
import { DEFAULT_SETTINGS, SUPPORTED_LANGUAGE_CODES } from './constants';

const SETTINGS_KEY = 'usp.settings';
const PROGRESS_KEY = 'usp.progress';
const FAVORITES_KEY = 'usp.favorites';

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function sanitizeSettings(input: Partial<AppSettings>): AppSettings {
  const uiLanguage = SUPPORTED_LANGUAGE_CODES.includes(input.uiLanguage ?? '') ? input.uiLanguage! : DEFAULT_SETTINGS.uiLanguage;
  const targetLanguages = Array.isArray(input.targetLanguages)
    ? input.targetLanguages.filter((code): code is string => SUPPORTED_LANGUAGE_CODES.includes(code))
    : DEFAULT_SETTINGS.targetLanguages;

  return {
    schemaVersion: DEFAULT_SETTINGS.schemaVersion,
    uiLanguage,
    targetLanguages: targetLanguages.length ? targetLanguages : DEFAULT_SETTINGS.targetLanguages,
    speechRate: typeof input.speechRate === 'number' ? Math.min(1.4, Math.max(0.6, input.speechRate)) : DEFAULT_SETTINGS.speechRate,
    slowMode: Boolean(input.slowMode),
    selectedVoiceByLang: typeof input.selectedVoiceByLang === 'object' && input.selectedVoiceByLang ? input.selectedVoiceByLang : {}
  };
}

export function loadSettings(): AppSettings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;
  const parsed = safeParse<Partial<AppSettings>>(localStorage.getItem(SETTINGS_KEY), DEFAULT_SETTINGS);
  return sanitizeSettings(parsed);
}

export function saveSettings(settings: AppSettings): void {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(sanitizeSettings(settings)));
}

export function loadProgress(): Record<string, ReviewState> {
  if (typeof window === 'undefined') return {};
  return safeParse<Record<string, ReviewState>>(localStorage.getItem(PROGRESS_KEY), {});
}

export function saveProgress(progress: Record<string, ReviewState>): void {
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
}

export function clearAllData(): void {
  localStorage.removeItem(SETTINGS_KEY);
  localStorage.removeItem(PROGRESS_KEY);
  localStorage.removeItem(FAVORITES_KEY);
}

export function loadFavorites(): Record<string, boolean> {
  if (typeof window === 'undefined') return {};
  return safeParse<Record<string, boolean>>(localStorage.getItem(FAVORITES_KEY), {});
}

export function saveFavorites(favorites: Record<string, boolean>): void {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
}

export function toggleFavorite(targetLang: string, phraseId: string): Record<string, boolean> {
  const favorites = loadFavorites();
  const key = `${targetLang}:${phraseId}`;
  const updated = { ...favorites };

  if (updated[key]) delete updated[key];
  else updated[key] = true;

  saveFavorites(updated);
  return updated;
}
