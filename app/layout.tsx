import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from './providers';
import { SettingsProvider } from './settings-provider';
import { I18nProvider } from '@/lib/i18n';
import { Sidebar } from '@/components/Sidebar';
import { DynamicFavicon } from '@/components/DynamicFavicon';
import { OnboardingWizard } from '@/components/OnboardingWizard';
import { LiveStreamWidget } from '@/components/LiveStreamWidget';

export const metadata: Metadata = {
  title: 'ClawPort - 指挥中心',
  description: 'OpenClaw AI agent 指挥中心',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" data-theme="dark" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <SettingsProvider>
            <I18nProvider>
              <DynamicFavicon />
              <OnboardingWizard />
              <LiveStreamWidget />
              <div
                className="flex h-screen overflow-hidden"
                style={{ background: 'var(--bg)' }}
              >
                {/* Client-side shell handles both desktop sidebar + mobile */}
                <Sidebar />

                {/* Main content */}
                <main className="flex-1 overflow-hidden relative">
                  {/* Mobile spacer for fixed header */}
                  <div className="md:hidden" style={{ height: '48px', flexShrink: 0 }} />
                  {children}
                </main>
              </div>
            </I18nProvider>
          </SettingsProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
