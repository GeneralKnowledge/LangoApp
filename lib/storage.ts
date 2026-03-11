import { AppSettings, ReviewState } from './types';
import { DEFAULT_SETTINGS } from './constants';

const SETTINGS_KEY = 'usp.settings';
const PROGRESS_KEY = 'usp.progress';

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
}
