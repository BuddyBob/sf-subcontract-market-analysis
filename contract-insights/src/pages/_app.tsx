'use client';

import type { AppProps } from 'next/app';
import Head from 'next/head';
import '@/styles/globals.css';
import { DataProvider } from '@/context/DataContext';
import { ThemeProvider, useTheme } from '@/components/theme-provider';
import { Navigation } from '@/components/navigation';

function AppContent({ Component, pageProps }: AppProps) {
  const { darkMode, setDarkMode } = useTheme();
  
  return (
    <>
      <Head>
        <title>SF Contract Insights - 2020 Subcontract Market Analysis</title>
        <meta name="description" content="Interactive dashboard analyzing market concentration, LBE equity, and dominant firm patterns in San Francisco's 2020 subcontract marketplace." />
        <meta name="keywords" content="San Francisco, subcontract, market analysis, LBE, equity, concentration, dashboard" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navigation darkMode={darkMode} setDarkMode={setDarkMode} />
        <main>
          <Component {...pageProps} />
        </main>
      </div>
    </>
  );
}

export default function App(props: AppProps) {
  return (
    <ThemeProvider>
      <DataProvider>
        <AppContent {...props} />
      </DataProvider>
    </ThemeProvider>
  );
}
