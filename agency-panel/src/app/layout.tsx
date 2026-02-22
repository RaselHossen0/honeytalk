import type { Metadata } from 'next';
import { AppRouterCacheProvider } from '@/components/providers/AppRouterCacheProvider';
import { ThemeRegistry } from '@/components/providers/ThemeRegistry';
import './globals.css';

export const metadata: Metadata = {
  title: 'HoneyTalk Agency Panel',
  description: 'Agency dashboard for HoneyTalk hosts & commission management',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AppRouterCacheProvider>
          <ThemeRegistry>{children}</ThemeRegistry>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
