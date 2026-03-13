import {NextIntlClientProvider} from 'next-intl';
import {getMessages, setRequestLocale} from 'next-intl/server';
import {routing} from '@/i18n/routing';
import {Inter} from 'next/font/google';
import {Metadata, Viewport} from 'next';
import {WebSiteJsonLd, ProductJsonLd, FAQJsonLd} from '@/components/seo/JsonLd';
import GoogleAnalytics from '@/components/seo/GoogleAnalytics';
import '../globals.css';

const inter = Inter({subsets: ['latin', 'cyrillic']});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}

export const viewport: Viewport = {
  themeColor: '#A3E635',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export async function generateMetadata({params}: {params: Promise<{locale: string}>}): Promise<Metadata> {
  const {locale} = await params;
  const isBg = locale === 'bg';

  return {
    metadataBase: new URL('https://profilinegm25.eu'),
    title: isBg
      ? 'Profiline GM25 Полираща Машина | Професионален Орбитален Полиш | Произведено в Европа'
      : 'Profiline GM25 Dual Action Polisher | Professional Orbital Polisher | Made in Europe',
    description: isBg
      ? 'Profiline GM25 — професионална dual-action полираща машина с 1200W мотор, 25мм орбитален ход, 2.60кг. Проектирана в България, CE сертифицирана. 2 години гаранция.'
      : 'Profiline GM25 — professional dual-action orbital polisher with 1200W motor, 25mm throw, 2.60kg. Engineered in Bulgaria, CE certified. 2-year warranty.',
    keywords: isBg
      ? ['Profiline GM25', 'полираща машина', 'орбитален полиш', 'детайлинг', 'корекция на лак']
      : ['Profiline GM25', 'dual action polisher', 'orbital polisher', 'car detailing', 'paint correction'],
    authors: [{ name: 'Profiline Tools' }],
    openGraph: {
      title: isBg ? 'Profiline GM25 Полираща Машина' : 'Profiline GM25 Dual Action Polisher',
      description: isBg
        ? 'Професионална полираща машина с 1200W мотор и 25мм орбитален ход.'
        : 'Professional orbital polisher with 1200W motor and 25mm throw.',
      url: `https://profilinegm25.eu/${locale}`,
      siteName: 'Profiline GM25',
      images: [{ url: '/images/product/gm25-side-view.jpg', width: 1200, height: 630, alt: 'Profiline GM25 Polisher' }],
      locale: isBg ? 'bg_BG' : 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: isBg ? 'Profiline GM25 Полираща Машина' : 'Profiline GM25 Dual Action Polisher',
      description: isBg
        ? 'Професионална полираща машина с 1200W мотор.'
        : 'Professional orbital polisher with 1200W motor.',
      images: ['/images/product/gm25-side-view.jpg'],
    },
    alternates: {
      canonical: `https://profilinegm25.eu/${locale}`,
      languages: {
        'bg': 'https://profilinegm25.eu/bg',
        'en': 'https://profilinegm25.eu/en',
      },
    },
    icons: {
      icon: [
        { url: '/favicon.ico', sizes: '32x32' },
        { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      ],
      apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
    },
    manifest: '/manifest.webmanifest',
    other: {
      'msapplication-TileColor': '#050505',
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale} className="scroll-smooth">
      <body className={`${inter.className} bg-[#050505] text-white antialiased`}>
        <NextIntlClientProvider messages={messages}>
          <GoogleAnalytics />
          <WebSiteJsonLd locale={locale} />
          <ProductJsonLd locale={locale} />
          <FAQJsonLd locale={locale} />
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
