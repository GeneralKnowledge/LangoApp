import { PhraseItem, ReviewState } from './types';
import { createInitialState } from './srs';

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
    if (!state) fresh.push({ phrase, status: 'NEW', state: createInitialState(phrase.id, targetLang) });
  }

  due.sort((a, b) => new Date(a.state.dueAt).getTime() - new Date(b.state.dueAt).getTime());
  fresh.sort((a, b) => a.phrase.difficulty - b.phrase.difficulty || a.phrase.module.localeCompare(b.phrase.module));

  const queue: QueueCard[] = [];
  let dueIdx = 0;
  let newIdx = 0;
  while (queue.length < size && (dueIdx < due.length || newIdx < fresh.length)) {
    if (dueIdx < due.length) queue.push(due[dueIdx++]);
    if (queue.length < size && newIdx < fresh.length) queue.push(fresh[newIdx++]);
  }

  return queue;
}
