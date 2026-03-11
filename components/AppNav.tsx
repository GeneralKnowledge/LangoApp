'use client';

import Link from 'next/link';
import { loadSettings } from '@/lib/storage';
import { t } from '@/lib/i18n';

export default function AppNav() {
  const settings = loadSettings();

  return (
    <div className="nav" aria-label="Primary navigation">
      <Link href="/learn">{t(settings.uiLanguage, 'nav.learn')}</Link>
      <Link href="/review">{t(settings.uiLanguage, 'nav.review')}</Link>
      <Link href="/settings">{t(settings.uiLanguage, 'nav.settings')}</Link>
    </div>
  );
}
