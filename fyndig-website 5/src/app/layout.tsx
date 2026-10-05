import type { Metadata, Viewport } from 'next';
import { Cormorant_Garamond, Inter, Lexend, Outfit, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { company, contact, siteUrl } from '@/data/company';
import Background from '@/components/Background';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['200', '300', '400', '500', '600'],
  variable: '--font-outfit',
  display: 'swap',
});

/**
 * Serif face — used only by subgroup wordmarks (see SubgroupLogo), which are
 * set in their own company's typeface rather than fyndig's.
 */
const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-cormorant',
  display: 'swap',
});

/** Campus's own face — see SubgroupLogo. */
const lexend = Lexend({
  subsets: ['latin'],
  weight: ['500', '600'],
  variable: '--font-lexend',
  display: 'swap',
});

/** The Trip's own face — see SubgroupLogo. */
const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['700'],
  variable: '--font-jakarta',
  display: 'swap',
});

export const metadata: Metadata = {
  title: `${company.name} — ${company.tagline}`,
  description: company.shortDescription[0],
  applicationName: company.name,
  keywords: [
    'software development',
    'IoT solutions',
    'IoT integrated applications',
    'automation',
    'smart products',
    'cloud solutions',
    'UI/UX design',
    'Tirupati',
    'Andhra Pradesh',
    'India',
  ],
  authors: [{ name: company.name }],
  icons: {
    icon: '/fyndig-mark.png',
    apple: '/fyndig-mark.png',
  },
  openGraph: {
    title: `${company.name} — ${company.tagline}`,
    description: company.shortDescription[0],
    siteName: company.name,
    locale: 'en_IN',
    type: 'website',
  },
  // No domain is hardcoded. `siteUrl` comes from NEXT_PUBLIC_SITE_URL at build
  // time; with it unset the key is simply omitted and Next falls back to
  // relative URLs, which is correct for a site that has no canonical home yet.
  ...(siteUrl ? { metadataBase: new URL(siteUrl), alternates: { canonical: '/' } } : {}),
};

export const viewport: Viewport = {
  themeColor: '#070B12',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable} ${cormorant.variable} ${lexend.variable} ${jakarta.variable}`}>
      <body className="font-sans antialiased">
        <a href="#main" className="skip-link">
          Skip to content
        </a>

        {/* Fixed cinematic background. Must stay a direct child of <body>. */}
        <Background />

        {children}

        {/* Organisation structured data — only facts provided by the company. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: company.name,
              description: company.shortDescription[0],
              foundingDate: company.founded,
              email: contact.email,
              telephone: contact.phones,
              address: {
                '@type': 'PostalAddress',
                streetAddress: contact.address.line1,
                addressLocality: contact.address.city,
                addressRegion: contact.address.state,
                postalCode: contact.address.postalCode,
                addressCountry: contact.address.country,
              },
            }),
          }}
        />
      </body>
    </html>
  );
}
