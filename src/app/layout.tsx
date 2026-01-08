import type { Metadata } from 'next';
import { BackgroundLayers } from '@/components/layout/BackgroundLayers';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://helixbytes.com'),
  title: {
    default: 'Helixbytes | AI-Native Software Solutions',
    template: '%s | Helixbytes',
  },
  description:
    'Canadian software development agency specializing in full-stack engineering, AI integration, intelligent web applications, cybersecurity, and cloud architecture.',
  authors: [{ name: 'Helixbytes Digital Solutions' }],
  openGraph: {
    type: 'website',
    locale: 'en_CA',
    siteName: 'Helixbytes',
    title: 'Helixbytes | AI-Native Software Solutions',
    description:
      'Canadian software development agency specializing in AI, full-stack development, and cloud solutions.',
    url: 'https://helixbytes.com',
    images: [
      {
        url: '/images/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Helixbytes - AI-Native Software Solutions',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Helixbytes | AI-Native Software Solutions',
    description:
      'Canadian software development agency specializing in AI, full-stack development, and cloud solutions.',
    images: ['/images/og-image.png'],
  },
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

// Organization structured data for rich results
const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Helixbytes Digital Solutions',
  alternateName: 'Helixbytes',
  url: 'https://helixbytes.com',
  logo: 'https://helixbytes.com/images/hlx-logo-optimized.svg',
  description:
    'Canadian software development agency specializing in full-stack engineering, AI integration, intelligent web applications, cybersecurity, and cloud architecture.',
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'CA',
  },
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'Customer Service',
    url: 'https://helixbytes.com/contact',
  },
  sameAs: [
    // Add social profiles when available
    // 'https://linkedin.com/company/helixbytes',
    // 'https://github.com/helixbytes',
  ],
};

// WebSite structured data for sitelinks search box
const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Helixbytes',
  url: 'https://helixbytes.com',
  publisher: {
    '@type': 'Organization',
    name: 'Helixbytes Digital Solutions',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema),
          }}
        />
      </head>
      <body>
        <BackgroundLayers />
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
