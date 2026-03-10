import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import './globals.css';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});

const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

export const viewport: Viewport = {
  themeColor: '#0a0a0a',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: 'SaintSal Labs — Responsible Intelligence',
  description:
    'SAL is the AI research engine for SaintSal™ Labs, backed by US Patent #10,290,222 HACP Protocol. Search, sports, news, tech, finance, real estate, and medical intelligence.',
  openGraph: {
    title: 'SaintSal Labs',
    description:
      'Responsible Intelligence — AI-powered search and vertical intelligence platform.',
    siteName: 'SaintSal Labs',
    type: 'website',
    url: 'https://saintsallabs.com',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'SaintSal Labs',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
