'use client';

import { useMemo, useState } from 'react';
import PhraseCard from '@/components/PhraseCard';
import { getPack } from '@/lib/packs';
import { MODULES } from '@/lib/constants';
import { loadSettings } from '@/lib/storage';
import { speak } from '@/lib/tts';

export default function LearnPage() {
  const settings = loadSettings();
  const [targetLang, setTargetLang] = useState(settings.targetLanguages[0] ?? 'es');
  const [module, setModule] = useState('ALL');
  const [index, setIndex] = useState(0);
  const pack = getPack(targetLang);

  const phrases = useMemo(() => {
    const source = pack?.phrases ?? [];
    return module === 'ALL' ? source : source.filter((p) => p.module === module);
  }, [pack, module]);

  const phrase = phrases[index] ?? phrases[0];

  if (!pack) return <p>No pack available for this language yet.</p>;
  if (!phrase) return <p>No phrases found.</p>;

  return (
    <>
      <div className="card">
        <label>Target language</label>
        <select value={targetLang} onChange={(e) => { setTargetLang(e.target.value); setIndex(0); }}>
          {settings.targetLanguages.map((code) => <option key={code} value={code}>{code}</option>)}
        </select>
        <label style={{ marginTop: 8 }}>Module filter</label>
        <select value={module} onChange={(e) => { setModule(e.target.value); setIndex(0); }}>
          <option value="ALL">All</option>
          {MODULES.map((m) => <option key={m} value={m}>{m}</option>)}
        </select>
      </div>
      <PhraseCard phrase={phrase} uiLanguage={settings.uiLanguage} />
      <div className="row">
        <button className="btn btn-muted" onClick={() => speak(phrase.say.native, targetLang, settings.slowMode ? 0.75 : settings.speechRate, settings.selectedVoiceByLang[targetLang])}>Play</button>
        <button className="btn btn-muted" onClick={() => speak(phrase.say.native, targetLang, 0.7, settings.selectedVoiceByLang[targetLang])}>Slow</button>
        <button className="btn btn-primary" onClick={() => setIndex((i) => (i + 1) % phrases.length)}>Next</button>
      </div>
    </>
  );
}
