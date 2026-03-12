import {NextIntlClientProvider} from 'next-intl';
import {getMessages, setRequestLocale} from 'next-intl/server';
import {routing} from '@/i18n/routing';
import {Inter} from 'next/font/google';
import '../globals.css';

const inter = Inter({subsets: ['latin', 'cyrillic']});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}

export async function generateMetadata({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  return {
    title: locale === 'bg'
      ? 'Profiline GM25 Полираща Машина | Професионален Орбитален Полиш'
      : 'Profiline GM25 Dual Action Polisher | Professional Orbital Polisher',
    description: locale === 'bg'
      ? 'Profiline GM25 — професионална dual-action полираща машина с 1200W мотор, 25мм орбитален ход. Проектирана в България, CE сертифицирана.'
      : 'Profiline GM25 — professional dual-action orbital polisher with 1200W motor, 25mm throw. Engineered in Bulgaria, CE certified.',
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
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
