'use client';

import { useMemo, useState } from 'react';
import PhraseCard from '@/components/PhraseCard';
import ReviewButtons from '@/components/ReviewButtons';
import { MODULES } from '@/lib/constants';
import { getPack } from '@/lib/packs';
import { buildQueue } from '@/lib/queue';
import { applyGrade, createInitialState } from '@/lib/srs';
import { loadProgress, loadSettings, saveProgress } from '@/lib/storage';
import { speak } from '@/lib/tts';
import { Grade } from '@/lib/types';

export default function ReviewPage() {
  const settings = loadSettings();
  const [targetLang, setTargetLang] = useState(settings.targetLanguages[0] ?? 'es');
  const [module, setModule] = useState('ALL');
  const [cursor, setCursor] = useState(0);
  const [progress, setProgress] = useState(loadProgress());

  const pack = getPack(targetLang);
  const queue = useMemo(() => buildQueue(pack?.phrases ?? [], progress, targetLang, module, 20), [pack, progress, targetLang, module]);
  const current = queue[cursor];

  const onGrade = (grade: Grade) => {
    if (!current) return;
    const key = `${targetLang}:${current.phrase.id}`;
    const existing = progress[key] ?? createInitialState(current.phrase.id, targetLang);
    const next = applyGrade(existing, grade);
    const updated = { ...progress, [key]: next };
    setProgress(updated);
    saveProgress(updated);
    setCursor((i) => i + 1);
  };

  if (!pack) return <p>No pack available.</p>;
  if (!current) return <p>Review complete. Come back later for due cards.</p>;

  return (
    <>
      <div className="card">
        <div className="row">
          <div style={{ flex: 1 }}>
            <label>Target language</label>
            <select value={targetLang} onChange={(e) => { setTargetLang(e.target.value); setCursor(0); }}>
              {settings.targetLanguages.map((code) => <option key={code} value={code}>{code}</option>)}
            </select>
          </div>
          <div style={{ flex: 1 }}>
            <label>Module</label>
            <select value={module} onChange={(e) => { setModule(e.target.value); setCursor(0); }}>
              <option value="ALL">All</option>
              {MODULES.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
        </div>
        <p className="small">Card {cursor + 1} / {queue.length} · {current.status}</p>
      </div>
      <PhraseCard phrase={current.phrase} uiLanguage={settings.uiLanguage} />
      <div className="row" style={{ marginBottom: 10 }}>
        <button className="btn btn-muted" onClick={() => speak(current.phrase.say.native, targetLang, settings.slowMode ? 0.75 : settings.speechRate, settings.selectedVoiceByLang[targetLang])}>Play audio</button>
      </div>
      <ReviewButtons onGrade={onGrade} />
    </>
  );
}
