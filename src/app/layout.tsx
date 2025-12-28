import type { Metadata } from 'next';
import { BackgroundLayers } from '@/components/layout/BackgroundLayers';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Helixbytes | AI-Native Software Solutions',
    template: '%s | Helixbytes',
  },
  description: 'Full-stack development, AI integration, intelligent web solutions, and cloud architecture.',
  keywords: ['software development', 'AI integration', 'web development', 'cloud solutions'],
  authors: [{ name: 'Helixbytes' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Helixbytes',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <BackgroundLayers />
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
