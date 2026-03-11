'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { SUPPORTED_LANGUAGES } from '@/lib/constants';
import { t } from '@/lib/i18n';
import { clearAllData, loadSettings, saveSettings } from '@/lib/storage';
import { getVoices } from '@/lib/tts';

export default function SettingsPage() {
  const router = useRouter();
  const [settings, setSettings] = useState(loadSettings());
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const activeLang = settings.targetLanguages[0] ?? 'es';

  useEffect(() => {
    setVoices(getVoices());
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const handleVoicesChanged = () => setVoices(getVoices());
      window.speechSynthesis.addEventListener('voiceschanged', handleVoicesChanged);
      return () => window.speechSynthesis.removeEventListener('voiceschanged', handleVoicesChanged);
    }
  }, []);

  const save = () => saveSettings(settings);

  return (
    <div className="card">
      <h2>{t(settings.uiLanguage, 'settings.title')}</h2>
      <label>{t(settings.uiLanguage, 'settings.speechRate').replace('{rate}', settings.speechRate.toFixed(2))}</label>
      <input type="range" min="0.6" max="1.4" step="0.05" value={settings.speechRate} onChange={(e) => setSettings({ ...settings, speechRate: Number(e.target.value) })} />

      <label style={{ marginTop: 12 }}>{t(settings.uiLanguage, 'settings.slowMode')}</label>
      <select value={String(settings.slowMode)} onChange={(e) => setSettings({ ...settings, slowMode: e.target.value === 'true' })}>
        <option value="false">{t(settings.uiLanguage, 'settings.off')}</option>
        <option value="true">{t(settings.uiLanguage, 'settings.on')}</option>
      </select>

      <label style={{ marginTop: 12 }}>{t(settings.uiLanguage, 'settings.voice')}</label>
      <select
        value={settings.selectedVoiceByLang[activeLang] ?? ''}
        onChange={(e) => setSettings({
          ...settings,
          selectedVoiceByLang: { ...settings.selectedVoiceByLang, [activeLang]: e.target.value }
        })}
      >
        <option value="">{t(settings.uiLanguage, 'settings.defaultVoice')}</option>
        {voices.map((v) => <option key={v.name} value={v.name}>{v.name} ({v.lang})</option>)}
      </select>

      <label style={{ marginTop: 12 }}>{t(settings.uiLanguage, 'settings.uiLanguage')}</label>
      <select value={settings.uiLanguage} onChange={(e) => setSettings({ ...settings, uiLanguage: e.target.value })}>
        {SUPPORTED_LANGUAGES.map(([code, name]) => <option key={code} value={code}>{name}</option>)}
      </select>

      <div className="row" style={{ marginTop: 12 }}>
        <button className="btn btn-primary" onClick={save}>{t(settings.uiLanguage, 'settings.save')}</button>
        <button className="btn btn-muted" onClick={() => { clearAllData(); router.push('/onboarding'); }}>{t(settings.uiLanguage, 'settings.reset')}</button>
      </div>
    </div>
  );
}
