'use client';

import createCache from '@emotion/cache';
import { useServerInsertedHTML } from 'next/navigation';
import { CacheProvider } from '@emotion/react';
import { useState } from 'react';

export function AppRouterCacheProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [cache] = useState(() => {
    const cache = createCache({ key: 'mui' });
    cache.compat = true;
    return cache;
  });

  useServerInsertedHTML(() => (
    <style
      data-emotion={`${cache.key} ${Object.keys(cache.inserted).join(' ')}`}
      dangerouslySetInnerHTML={{
        __html: Object.values(cache.inserted).join(' '),
      }}
    />
  ));

  return <CacheProvider value={cache}>{children}</CacheProvider>;
}
