'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { t } from '@/lib/i18n';
import { loadSettings } from '@/lib/storage';

export default function HomePage() {
  const router = useRouter();
  const settings = loadSettings();

  useEffect(() => {
    if (!settings.targetLanguages.length) router.replace('/onboarding');
    else router.replace('/learn');
  }, [router, settings.targetLanguages.length]);

  return <p>{t(settings.uiLanguage, 'common.loading')}</p>;
}
