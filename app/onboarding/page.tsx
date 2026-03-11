'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DEFAULT_SETTINGS, SUPPORTED_LANGUAGES } from '@/lib/constants';
import { t } from '@/lib/i18n';
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
      <h2>{t(uiLanguage, 'onboarding.welcome')}</h2>
      <p className="small">{t(uiLanguage, 'onboarding.subtitle')}</p>
      <label>{t(uiLanguage, 'onboarding.uiLanguage')}</label>
      <select value={uiLanguage} onChange={(e) => setUiLanguage(e.target.value)}>
        {SUPPORTED_LANGUAGES.map(([code, name]) => <option key={code} value={code}>{name}</option>)}
      </select>

      <label style={{ marginTop: 12 }}>{t(uiLanguage, 'onboarding.targetLanguages')}</label>
      <div className="row" role="group" aria-label={t(uiLanguage, 'onboarding.targetLanguages')}>
        {SUPPORTED_LANGUAGES.filter(([code]) => code !== uiLanguage).map(([code, name]) => (
          <button
            key={code}
            className="btn btn-muted"
            onClick={() => toggle(code)}
            aria-pressed={targets.includes(code)}
            style={{ background: targets.includes(code) ? '#bfdbfe' : undefined }}
          >
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
        {t(uiLanguage, 'onboarding.start')}
      </button>
    </div>
  );
}
