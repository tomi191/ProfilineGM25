import {setRequestLocale} from 'next-intl/server';
import {getSiteContent, getVisibility} from '@/lib/site-content';
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
import SettlingContours from '@/components/ui/SettlingContours';
import WaveDamping from '@/components/ui/WaveDamping';
import MicroSurface from '@/components/ui/MicroSurface';

export default async function Home({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  setRequestLocale(locale);

  const siteContent = await getSiteContent(locale);
  const visibility = getVisibility(siteContent);

  // Helper: check if a section is visible (defaults to true)
  const isVisible = (key: string) => visibility[key] !== false;

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <Header />
      {isVisible('hero') && <Hero cms={siteContent['hero']} />}
      {isVisible('trustBar') && <TrustBar cms={siteContent['trustBar']} />}
      {/* TrustBar (#0a0a0a) → Gallery (#050505) */}
      <SettlingContours from="#0a0a0a" to="#050505" />
      {isVisible('gallery') && <Gallery cms={siteContent['gallery']} />}
      {/* Gallery (#050505) → TechSpecs (#050505) */}
      <WaveDamping from="#050505" to="#050505" />
      {isVisible('techSpecs') && <TechSpecs cms={siteContent['techSpecs']} />}
      {/* TechSpecs (#050505) → Performance (#0a0a0a) */}
      <SettlingContours from="#050505" to="#0a0a0a" />
      {isVisible('performance') && <Performance cms={siteContent['performance']} />}
      {/* Performance (#0a0a0a) → WhatsInBox (#050505) */}
      <WaveDamping from="#0a0a0a" to="#050505" />
      {isVisible('whatsInBox') && <WhatsInBox cms={siteContent['whatsInBox']} />}
      {/* WhatsInBox (#050505) → FAQ (#0a0a0a) */}
      <MicroSurface from="#050505" to="#0a0a0a" />
      {isVisible('faq') && <FAQ cms={siteContent['faq']} />}
      {/* FAQ (#0a0a0a) → B2BForm (#0a0a0a) */}
      <SettlingContours from="#0a0a0a" to="#0a0a0a" />
      {isVisible('b2b') && <B2BForm cms={siteContent['b2b']} />}
      {isVisible('footer') && <Footer cms={siteContent['footer']} />}
      <CookieBanner />
    </main>
  );
}
