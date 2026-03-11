'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { SUPPORTED_LANGUAGES } from '@/lib/constants';
import { clearAllData, loadSettings, saveSettings } from '@/lib/storage';
import { getVoices } from '@/lib/tts';

export default function SettingsPage() {
  const router = useRouter();
  const [settings, setSettings] = useState(loadSettings());
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    setVoices(getVoices());
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = () => setVoices(getVoices());
    }
  }, []);

  const save = () => saveSettings(settings);

  return (
    <div className="card">
      <h2>Settings</h2>
      <label>Speech rate ({settings.speechRate.toFixed(2)})</label>
      <input type="range" min="0.6" max="1.4" step="0.05" value={settings.speechRate} onChange={(e) => setSettings({ ...settings, speechRate: Number(e.target.value) })} />

      <label style={{ marginTop: 12 }}>Slow mode default</label>
      <select value={String(settings.slowMode)} onChange={(e) => setSettings({ ...settings, slowMode: e.target.value === 'true' })}>
        <option value="false">Off</option>
        <option value="true">On</option>
      </select>

      <label style={{ marginTop: 12 }}>Voice for first target language</label>
      <select
        value={settings.selectedVoiceByLang[settings.targetLanguages[0]] ?? ''}
        onChange={(e) => setSettings({
          ...settings,
          selectedVoiceByLang: { ...settings.selectedVoiceByLang, [settings.targetLanguages[0]]: e.target.value }
        })}
      >
        <option value="">Default</option>
        {voices.map((v) => <option key={v.name} value={v.name}>{v.name} ({v.lang})</option>)}
      </select>

      <label style={{ marginTop: 12 }}>UI language</label>
      <select value={settings.uiLanguage} onChange={(e) => setSettings({ ...settings, uiLanguage: e.target.value })}>
        {SUPPORTED_LANGUAGES.map(([code, name]) => <option key={code} value={code}>{name}</option>)}
      </select>

      <div className="row" style={{ marginTop: 12 }}>
        <button className="btn btn-primary" onClick={save}>Save settings</button>
        <button className="btn btn-muted" onClick={() => { clearAllData(); router.push('/onboarding'); }}>Reset local data</button>
      </div>
    </div>
  );
}
