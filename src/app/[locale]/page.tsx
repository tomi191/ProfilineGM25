import {setRequestLocale} from 'next-intl/server';
import Header from '@/components/sections/Header';
import Hero from '@/components/sections/Hero';

export default async function Home({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  setRequestLocale(locale);

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <Header />
      <Hero />
    </main>
  );
}
