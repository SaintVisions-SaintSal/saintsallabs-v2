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
  title: 'SaintSal™ Labs — Elite AI Intelligence Platform',
  description: 'Research, build, and analyze across every vertical — powered by Claude, GPT, Gemini, and Grok. Your Gotta Guy™. US Patent #10,290,222.',
  keywords: 'AI intelligence, real estate AI, finance AI, AI builder, GHL, SaintSal, HACP protocol, Patent 10290222',
  authors: [{ name: 'Saint Vision Technologies LLC' }],
  manifest: '/manifest.json',
  icons: { icon: '/helmet.png', apple: '/helmet.png' },
  openGraph: {
    title: 'SaintSal™ Labs — Your Gotta Guy™ Is Ready',
    description: 'Claude + GPT + Gemini + Grok. Research, build, analyze, automate. Patent #10,290,222.',
    siteName: 'SaintSal™ Labs',
    type: 'website',
    url: 'https://saintsallabs.com',
    images: [{ url: '/helmet.png', width: 1024, height: 1024, alt: 'SaintSal Labs' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SaintSal™ Labs — Elite AI Platform',
    description: 'Powered by Patent #10,290,222 HACP Protocol. Claude + GPT + Gemini + Grok.',
    images: ['/helmet.png'],
    creator: '@saintsallabs',
  },
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://saintsallabs.com' },
  appleWebApp: { capable: true, statusBarStyle: 'black-translucent', title: 'SaintSal Labs' },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        {/* Google Search Console verification */}
        <meta name="google-site-verification" content="PASTE_YOUR_CODE_HERE" />
        {/* GA4 — SaintSal Labs */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXX" />
        <script dangerouslySetInnerHTML={{ __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-XXXXXXXX', {
            page_title: document.title,
            page_location: window.location.href,
            send_page_view: true,
          });
        `}} />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
