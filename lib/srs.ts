import { Grade, ReviewState } from './types';

export function createInitialState(phraseId: string, targetLang: string): ReviewState {
  return {
    phraseId,
    targetLang,
    dueAt: new Date().toISOString(),
    intervalDays: 0,
    easeFactor: 2.5,
    repetitions: 0,
    lapses: 0,
    lastGrade: null,
    isNew: true
  };
}

export function applyGrade(state: ReviewState, grade: Grade): ReviewState {
  const next = { ...state, lastGrade: grade, lastReviewedAt: new Date().toISOString(), isNew: false };
  if (grade === 'again') {
    next.repetitions = 0;
    next.lapses += 1;
    next.intervalDays = 0;
    next.easeFactor = Math.max(1.3, next.easeFactor - 0.2);
  } else if (grade === 'hard') {
    next.repetitions += 1;
    next.intervalDays = Math.max(1, Math.round(Math.max(1, next.intervalDays) * 1.2));
    next.easeFactor = Math.max(1.3, next.easeFactor - 0.15);
  } else if (grade === 'good') {
    next.repetitions += 1;
    if (next.repetitions === 1) next.intervalDays = 1;
    else if (next.repetitions === 2) next.intervalDays = 3;
    else next.intervalDays = Math.max(1, Math.round(next.intervalDays * next.easeFactor));
  } else {
    next.repetitions += 1;
    if (next.repetitions === 1) next.intervalDays = 2;
    else next.intervalDays = Math.max(1, Math.round(next.intervalDays * next.easeFactor * 1.3));
    next.easeFactor = next.easeFactor + 0.1;
  }
  const due = new Date();
  due.setDate(due.getDate() + next.intervalDays);
  next.dueAt = due.toISOString();
  return next;
}
