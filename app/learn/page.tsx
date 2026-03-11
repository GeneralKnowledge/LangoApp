'use client';

import { useMemo, useState } from 'react';
import PhraseCard from '@/components/PhraseCard';
import { getPack } from '@/lib/packs';
import { MODULES, SUPPORTED_LANGUAGES } from '@/lib/constants';
import { t } from '@/lib/i18n';
import { loadFavorites, loadSettings, toggleFavorite } from '@/lib/storage';
import { speak } from '@/lib/tts';

export default function LearnPage() {
  const settings = loadSettings();
  const [targetLang, setTargetLang] = useState(settings.targetLanguages[0] ?? 'es');
  const [module, setModule] = useState('ALL');
  const [index, setIndex] = useState(0);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [favorites, setFavorites] = useState(loadFavorites());
  const pack = getPack(targetLang);

  const phrases = useMemo(() => {
    const source = pack?.phrases ?? [];
    const moduleFiltered = module === 'ALL' ? source : source.filter((p) => p.module === module);

    if (!showFavoritesOnly) return moduleFiltered;

    return moduleFiltered.filter((phrase) => favorites[`${targetLang}:${phrase.id}`]);
  }, [pack, module, showFavoritesOnly, favorites, targetLang]);

  const phrase = phrases[index] ?? phrases[0];
  const languageName = SUPPORTED_LANGUAGES.find(([code]) => code === targetLang)?.[1] ?? targetLang;

  const goToNext = () => {
    setIndex((i) => (i + 1) % phrases.length);
  };

  const handleToggleFavorite = () => {
    if (!phrase) return;
    const updated = toggleFavorite(targetLang, phrase.id);
    setFavorites(updated);
  };

  if (!pack) return <p>{t(settings.uiLanguage, 'learn.noPack')}</p>;
  if (!phrase) return <p>{t(settings.uiLanguage, 'learn.noPhrases')}</p>;

  const isFavorite = Boolean(favorites[`${targetLang}:${phrase.id}`]);

  return (
    <>
      <div className="card">
        <label>{t(settings.uiLanguage, 'common.targetLanguage')}</label>
        <select value={targetLang} onChange={(e) => { setTargetLang(e.target.value); setIndex(0); }}>
          {settings.targetLanguages.map((code) => (
            <option key={code} value={code}>{SUPPORTED_LANGUAGES.find(([langCode]) => langCode === code)?.[1] ?? code}</option>
          ))}
        </select>
        <label style={{ marginTop: 8 }}>{t(settings.uiLanguage, 'learn.moduleFilter')}</label>
        <select value={module} onChange={(e) => { setModule(e.target.value); setIndex(0); }}>
          <option value="ALL">{t(settings.uiLanguage, 'common.all')}</option>
          {MODULES.map((m) => <option key={m} value={m}>{m}</option>)}
        </select>
        <div className="row" style={{ marginTop: 10, justifyContent: 'space-between' }}>
          <span className="small">{t(settings.uiLanguage, 'learn.learningProgress').replace('{language}', languageName).replace('{index}', String(index + 1)).replace('{total}', String(phrases.length))}</span>
          <button className="btn btn-muted" onClick={() => { setShowFavoritesOnly((prev) => !prev); setIndex(0); }}>
            {showFavoritesOnly ? t(settings.uiLanguage, 'learn.showAll') : t(settings.uiLanguage, 'learn.favoritesOnly')}
          </button>
        </div>
      </div>
      <PhraseCard phrase={phrase} uiLanguage={settings.uiLanguage} />
      <div className="row">
        <button className="btn btn-muted" onClick={() => speak(phrase.say.native, targetLang, settings.slowMode ? 0.75 : settings.speechRate, settings.selectedVoiceByLang[targetLang])}>{t(settings.uiLanguage, 'learn.play')}</button>
        <button className="btn btn-muted" onClick={() => speak(phrase.say.native, targetLang, 0.7, settings.selectedVoiceByLang[targetLang])}>{t(settings.uiLanguage, 'learn.slow')}</button>
        <button className="btn btn-muted" onClick={handleToggleFavorite}>{isFavorite ? t(settings.uiLanguage, 'learn.favorited') : t(settings.uiLanguage, 'learn.favorite')}</button>
        <button className="btn btn-primary" onClick={goToNext}>{t(settings.uiLanguage, 'learn.next')}</button>
      </div>
    </>
  );
}
