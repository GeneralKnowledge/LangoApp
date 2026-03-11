'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DEFAULT_SETTINGS, SUPPORTED_LANGUAGES } from '@/lib/constants';
import { saveSettings } from '@/lib/storage';

export default function OnboardingPage() {
  const router = useRouter();
  const [uiLanguage, setUiLanguage] = useState('en');
  const [targets, setTargets] = useState<string[]>(['es']);

  const toggle = (code: string) => {
    setTargets((prev) => (prev.includes(code) ? prev.filter((x) => x !== code) : [...prev, code]));
  };

  return (
    <div className="card">
      <h2>Welcome</h2>
      <p className="small">No account needed. Your progress stays on this device only.</p>
      <label>UI language</label>
      <select value={uiLanguage} onChange={(e) => setUiLanguage(e.target.value)}>
        {SUPPORTED_LANGUAGES.map(([code, name]) => <option key={code} value={code}>{name}</option>)}
      </select>

      <label style={{ marginTop: 12 }}>Target language(s)</label>
      <div className="row">
        {SUPPORTED_LANGUAGES.filter(([code]) => code !== uiLanguage).map(([code, name]) => (
          <button key={code} className="btn btn-muted" onClick={() => toggle(code)} style={{ background: targets.includes(code) ? '#bfdbfe' : undefined }}>
            {name}
          </button>
        ))}
      </div>

      <button
        className="btn btn-primary"
        style={{ marginTop: 12 }}
        onClick={() => {
          saveSettings({ ...DEFAULT_SETTINGS, uiLanguage, targetLanguages: targets.length ? targets : ['es'] });
          router.push('/learn');
        }}
      >
        Start Learning
      </button>
    </div>
  );
}
