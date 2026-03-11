'use client';

import { useMemo, useState } from 'react';
import PhraseCard from '@/components/PhraseCard';
import ReviewButtons from '@/components/ReviewButtons';
import { MODULES, SUPPORTED_LANGUAGES } from '@/lib/constants';
import { t } from '@/lib/i18n';
import { getPack } from '@/lib/packs';
import { buildQueue, QueueCard } from '@/lib/queue';
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
  const [requeue, setRequeue] = useState<QueueCard[]>([]);

  const pack = getPack(targetLang);
  const baseQueue = useMemo(() => buildQueue(pack?.phrases ?? [], progress, targetLang, module, 20), [pack, progress, targetLang, module]);
  const queue = [...baseQueue, ...requeue];
  const current = queue[cursor];
  const totalSeen = Math.min(cursor, queue.length);
  const completionPct = queue.length ? Math.round((totalSeen / queue.length) * 100) : 0;
  const statusCounts = queue.reduce(
    (acc, item) => {
      acc[item.status] += 1;
      return acc;
    },
    { NEW: 0, DUE: 0 } as Record<'NEW' | 'DUE', number>
  );

  const onGrade = (grade: Grade) => {
    if (!current) return;
    const key = `${targetLang}:${current.phrase.id}`;
    const existing = progress[key] ?? createInitialState(current.phrase.id, targetLang);
    const next = applyGrade(existing, grade);
    const updated = { ...progress, [key]: next };
    setProgress(updated);
    saveProgress(updated);

    if (grade === 'again' || grade === 'hard') {
      setRequeue((prev) => [...prev, { ...current, state: next, status: 'DUE' }]);
    }

    setCursor((i) => i + 1);
  };

  if (!pack) return <p>{t(settings.uiLanguage, 'learn.noPack')}</p>;
  if (!current) return <p>{t(settings.uiLanguage, 'review.complete')}</p>;

  const languageLabel = SUPPORTED_LANGUAGES.find(([code]) => code === targetLang)?.[1] ?? targetLang;

  return (
    <>
      <div className="card">
        <div className="row">
          <div style={{ flex: 1 }}>
            <label>{t(settings.uiLanguage, 'common.targetLanguage')}</label>
            <select value={targetLang} onChange={(e) => { setTargetLang(e.target.value); setCursor(0); setRequeue([]); }}>
              {settings.targetLanguages.map((code) => <option key={code} value={code}>{SUPPORTED_LANGUAGES.find(([langCode]) => langCode === code)?.[1] ?? code}</option>)}
            </select>
          </div>
          <div style={{ flex: 1 }}>
            <label>{t(settings.uiLanguage, 'common.module')}</label>
            <select value={module} onChange={(e) => { setModule(e.target.value); setCursor(0); setRequeue([]); }}>
              <option value="ALL">{t(settings.uiLanguage, 'common.all')}</option>
              {MODULES.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
        </div>
        <p className="small">{t(settings.uiLanguage, 'review.cardProgress').replace('{index}', String(cursor + 1)).replace('{total}', String(queue.length)).replace('{status}', current.status).replace('{pct}', String(completionPct))}</p>
        <p className="small">{t(settings.uiLanguage, 'review.statusCounts').replace('{newCount}', String(statusCounts.NEW)).replace('{dueCount}', String(statusCounts.DUE))}</p>
        <p className="small">{languageLabel}</p>
      </div>
      <PhraseCard phrase={current.phrase} uiLanguage={settings.uiLanguage} />
      <div className="row" style={{ marginBottom: 10 }}>
        <button className="btn btn-muted" onClick={() => speak(current.phrase.say.native, targetLang, settings.slowMode ? 0.75 : settings.speechRate, settings.selectedVoiceByLang[targetLang])}>{t(settings.uiLanguage, 'review.playAudio')}</button>
        <button className="btn btn-muted" onClick={() => { setCursor(0); setRequeue([]); }}>{t(settings.uiLanguage, 'review.restart')}</button>
      </div>
      <ReviewButtons
        onGrade={onGrade}
        labels={{
          again: t(settings.uiLanguage, 'review.again'),
          hard: t(settings.uiLanguage, 'review.hard'),
          good: t(settings.uiLanguage, 'review.good'),
          easy: t(settings.uiLanguage, 'review.easy')
        }}
      />
    </>
  );
}
