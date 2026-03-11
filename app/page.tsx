'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { loadSettings } from '@/lib/storage';

export default function HomePage() {
  const router = useRouter();
  useEffect(() => {
    const settings = loadSettings();
    if (!settings.targetLanguages.length) router.replace('/onboarding');
    else router.replace('/learn');
  }, [router]);

  return <p>Loading…</p>;
}
