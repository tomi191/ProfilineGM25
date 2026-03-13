'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { motion, useScroll, useTransform } from 'motion/react';
import { ChevronRight, ChevronDown, ShieldCheck } from 'lucide-react';

const heroSlides = [
  { src: '/images/ai-webp/hero-cinematic.webp', alt: 'Profiline GM25 side profile studio shot' },
  { src: '/images/ai-webp/in-action-polishing.webp', alt: 'Profiline GM25 professional car polishing' },
  { src: '/images/ai-webp/lifestyle-workshop.webp', alt: 'Profiline GM25 in detailing workshop' },
  { src: '/images/ai-webp/in-action-detail.webp', alt: 'Profiline GM25 detail polishing on dark paint' },
];

interface HeroProps {
  cms?: Record<string, unknown>;
}

export default function Hero({ cms }: HeroProps) {
  const t = useTranslations('hero');
  const c = (key: string) =>
    cms && cms[key] !== undefined ? String(cms[key]) : t(key);
    
  const [activeIndex, setActiveIndex] = useState(0);
  const [glowActive, setGlowActive] = useState(false);
  
  // Parallax scroll effect for background
  const { scrollY } = useScroll();
  const yBg = useTransform(scrollY, [0, 1000], [0, 200]);

  // Trigger glow after hero entrance animation completes (~1.15s)
  const startGlow = useCallback(() => {
    if (!glowActive) {
      setTimeout(() => setGlowActive(true), 1150);
    }
  }, [glowActive]);

  useEffect(() => {
    startGlow();
  }, [startGlow]);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.querySelector(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden bg-[#050505] perspective-1000">
      
      {/* Dynamic 3D Grid Layer */}
      <div className="absolute inset-0 pointer-events-none z-[1] opacity-20">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(163,230,53,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(163,230,53,0.1)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_0%,#000_10%,transparent_100%)] transform-gpu rotate-x-60 scale-150 origin-top" />
      </div>

      {/* Background slideshow — Parallax mapped */}
      <motion.div style={{ y: yBg }} className="absolute inset-0 w-full h-[120%] -top-[10%]">
        {heroSlides.map((slide, i) => (
          <div
            key={slide.src}
            className="absolute inset-0 transition-opacity duration-[2000ms] ease-in-out"
            style={{ opacity: i === activeIndex ? 1 : 0 }}
          >
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              className="object-cover opacity-30 mix-blend-luminosity"
              priority={i === 0}
              sizes="100vw"
            />
          </div>
        ))}
      </motion.div>

      {/* Dark gradient overlay — Engineering focus */}
      <div className="absolute inset-0 z-[2] bg-gradient-to-b from-[#050505]/80 via-[#050505]/60 to-[#050505]" />

      {/* Main Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 max-w-5xl mx-auto mt-10 md:mt-16 pb-32">
        
        {/* Tech Badge */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full border border-lime-500/20 bg-lime-500/5 mb-8 backdrop-blur-md"
        >
          <div className="w-2 h-2 rounded-full bg-lime-400 animate-pulse" />
          <span className="text-lime-400 uppercase tracking-[0.2em] text-xs font-bold">
            {c('badge')}
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-4xl sm:text-5xl md:text-7xl font-extrabold leading-[1.1] mb-6 tracking-tight"
        >
          PROFILINE GM25
          <br />
          <span className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl bg-gradient-to-r from-gray-100 via-gray-300 to-gray-500 bg-clip-text text-transparent block mt-2">
            {c('headline')}
          </span>
        </motion.h1>

        {/* Sub-description */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-lg md:text-xl text-[#888] max-w-2xl mx-auto mb-12 font-medium leading-relaxed"
        >
          {c('heroDesc')}
        </motion.p>

        {/* CTA Area */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center justify-center gap-4"
        >
          <button
            onClick={() => scrollTo('#b2b-section')}
            className={`group relative inline-flex items-center gap-3 bg-[#A3E635] text-black font-bold px-8 py-4 rounded-xl transition-all duration-300 hover:bg-[#b0f240] hover:scale-105 cursor-pointer ${glowActive ? 'shadow-[0_0_40px_rgba(163,230,53,0.3)]' : ''}`}
          >
            <span className="text-sm md:text-base uppercase tracking-wider">{c('ctaButton')}</span>
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" strokeWidth={3} />
            
            {/* Inner glow line */}
            <div className="absolute inset-0 rounded-xl border border-white/40 pointer-events-none mix-blend-overlay" />
          </button>
          
          {/* Micro Trust */}
          <div className="flex items-center gap-2 text-xs text-gray-500 mt-3 font-medium">
            <ShieldCheck className="w-4 h-4 text-lime-500/70" />
            <span>{c('ctaTrust')}</span>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator - Architectural line */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center"
      >
        <span className="text-[10px] text-gray-600 uppercase tracking-widest mb-4">{c('scrollDown')}</span>
        <div className="w-[1px] h-16 bg-gradient-to-b from-lime-500/50 to-transparent relative overflow-hidden">
          <motion.div 
            animate={{ y: ['-100%', '100%'] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
            className="absolute inset-0 w-full h-1/2 bg-gradient-to-b from-transparent via-lime-400 to-transparent"
          />
        </div>
      </motion.div>
    </section>
  );
}
