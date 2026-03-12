import {setRequestLocale} from 'next-intl/server';
import Header from '@/components/sections/Header';
import Hero from '@/components/sections/Hero';
import TrustBar from '@/components/sections/TrustBar';
import Gallery from '@/components/sections/Gallery';
import TechSpecs from '@/components/sections/TechSpecs';
import Performance from '@/components/sections/Performance';
import WhatsInBox from '@/components/sections/WhatsInBox';
import FAQ from '@/components/sections/FAQ';
import B2BForm from '@/components/sections/B2BForm';
import Footer from '@/components/sections/Footer';
import CookieBanner from '@/components/ui/CookieBanner';

export default async function Home({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  setRequestLocale(locale);

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <Header />
      <Hero />
      <TrustBar />
      <Gallery />
      <TechSpecs />
      <Performance />
      <WhatsInBox />
      <FAQ />
      <B2BForm />
      <Footer />
      <CookieBanner />
    </main>
  );
}
