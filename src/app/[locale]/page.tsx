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

import InfinitePartnerScroll from '@/components/ui/InfinitePartnerScroll';

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
      <InfinitePartnerScroll />
      {/* Introduction / Engineering first */}
      {isVisible('performance') && <Performance cms={siteContent['performance']} />}
      
      {/* Wave transition into TrustBar */}
      <WaveDamping from="#0a0a0a" to="#050505" />
      {isVisible('trustBar') && <TrustBar cms={siteContent['trustBar']} />}
      
      {/* Wave transition into Specs */}
      <WaveDamping from="#050505" to="#050505" />
      {isVisible('techSpecs') && <TechSpecs cms={siteContent['techSpecs']} />}
      
      {/* Wave transition into Gallery */}
      <WaveDamping from="#050505" to="#050505" />
      {isVisible('gallery') && <Gallery cms={siteContent['gallery']} />}
      
      {/* Transition into Box & Logistics */}
      <SettlingContours from="#050505" to="#0a0a0a" />
      {isVisible('whatsInBox') && <WhatsInBox cms={siteContent['whatsInBox']} />}
      
      {/* Box (#0a0a0a) to FAQ (#050505) */}
      <WaveDamping from="#0a0a0a" to="#050505" />
      {isVisible('faq') && <FAQ cms={siteContent['faq']} />}
      
      {/* FAQ (#050505) to B2B Form (#050505) */}
      <SettlingContours from="#050505" to="#050505" />
      {isVisible('b2b') && <B2BForm cms={siteContent['b2b']} />}
      
      {isVisible('footer') && <Footer cms={siteContent['footer']} />}
      <CookieBanner />
    </main>
  );
}
