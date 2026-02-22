'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Redirect /dashboard/users/levels to Female Levels (default subpage).
 */
export default function LevelsPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/dashboard/users/levels/female');
  }, [router]);

  return null;
}
