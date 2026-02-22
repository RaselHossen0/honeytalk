import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AppRouterCacheProvider } from '@/components/providers/AppRouterCacheProvider';
import { ThemeRegistry } from '@/components/providers/ThemeRegistry';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'HoneyTalk Admin Panel',
  description: 'Admin dashboard for HoneyTalk live streaming platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}>
        <AppRouterCacheProvider>
          <ThemeRegistry>{children}</ThemeRegistry>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
