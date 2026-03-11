'use client';

import { t } from '@/lib/i18n';
import { loadSettings } from '@/lib/storage';
import AppNav from './AppNav';

export default function AppShellHeader() {
  const settings = loadSettings();

  return (
    <>
      <h1>{t(settings.uiLanguage, 'app.title')}</h1>
      <AppNav />
    </>
  );
}
