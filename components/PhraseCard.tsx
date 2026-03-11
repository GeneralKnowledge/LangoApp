'use client';

import { PhraseItem } from '@/lib/types';

export default function PhraseCard({ phrase, uiLanguage }: { phrase: PhraseItem; uiLanguage: string }) {
  return (
    <div className="card">
      <div className="badge">{phrase.module}</div>
      <h2>{phrase.meaning[uiLanguage] ?? phrase.meaning.en}</h2>
      <p style={{ fontSize: 24, margin: '8px 0' }}>{phrase.say.native}</p>
      {phrase.say.romanization && <p className="small">{phrase.say.romanization}</p>}
      {phrase.notes && <p className="small">{phrase.notes}</p>}
    </div>
  );
}
