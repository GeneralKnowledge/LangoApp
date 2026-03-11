import { AppSettings, ReviewState } from './types';
import { DEFAULT_SETTINGS } from './constants';

const SETTINGS_KEY = 'usp.settings';
const PROGRESS_KEY = 'usp.progress';
const FAVORITES_KEY = 'usp.favorites';

export function loadSettings(): AppSettings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;
  const raw = localStorage.getItem(SETTINGS_KEY);
  return raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : DEFAULT_SETTINGS;
}

export function saveSettings(settings: AppSettings): void {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

export function loadProgress(): Record<string, ReviewState> {
  if (typeof window === 'undefined') return {};
  const raw = localStorage.getItem(PROGRESS_KEY);
  return raw ? JSON.parse(raw) : {};
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
  const raw = localStorage.getItem(FAVORITES_KEY);
  return raw ? JSON.parse(raw) : {};
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
