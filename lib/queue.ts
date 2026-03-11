import { PhraseItem, ReviewState } from './types';

export interface QueueCard {
  phrase: PhraseItem;
  status: 'NEW' | 'DUE';
  state: ReviewState;
}

export function buildQueue(
  phrases: PhraseItem[],
  progress: Record<string, ReviewState>,
  targetLang: string,
  moduleFilter: string,
  size = 20
): QueueCard[] {
  const now = new Date();
  const scoped = moduleFilter === 'ALL' ? phrases : phrases.filter((p) => p.module === moduleFilter);
  const due: QueueCard[] = [];
  const fresh: QueueCard[] = [];

  for (const phrase of scoped) {
    const key = `${targetLang}:${phrase.id}`;
    const state = progress[key];
    if (state && new Date(state.dueAt) <= now) due.push({ phrase, status: 'DUE', state });
    if (!state) {
      fresh.push({
        phrase,
        status: 'NEW',
        state: { phraseId: phrase.id, targetLang, dueAt: now.toISOString(), intervalDays: 0, easeFactor: 2.5, repetitions: 0, lastGrade: null, isNew: true }
      });
    }
  }

  fresh.sort((a, b) => a.phrase.difficulty - b.phrase.difficulty || a.phrase.module.localeCompare(b.phrase.module));
  return [...due, ...fresh].slice(0, size);
}
