'use client';

import Image from 'next/image';
import {useTranslations} from 'next-intl';
import {motion} from 'motion/react';
import {ChevronRight, ChevronDown} from 'lucide-react';

export default function Hero() {
  const t = useTranslations('hero');

  const scrollTo = (id: string) => {
    const el = document.querySelector(id);
    if (el) {
      el.scrollIntoView({behavior: 'smooth'});
    }
  };

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <Image
        src="/images/product/gm25-with-box.jpg"
        alt="Profiline GM25"
        fill
        className="object-cover opacity-30"
        priority
      />

      {/* Dark gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-[#050505]" />

      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 max-w-5xl mx-auto">
        <motion.span
          initial={{opacity: 0, y: 30}}
          animate={{opacity: 1, y: 0}}
          transition={{duration: 0.6, delay: 0.1}}
          className="inline-block text-lime-400 uppercase tracking-widest text-sm font-bold mb-6"
        >
          {t('subtitle')}
        </motion.span>

        <motion.h1
          initial={{opacity: 0, y: 30}}
          animate={{opacity: 1, y: 0}}
          transition={{duration: 0.6, delay: 0.25}}
          className="text-5xl md:text-7xl lg:text-8xl font-extrabold leading-tight mb-6"
        >
          {t('title1')}
          <br />
          <span className="bg-gradient-to-r from-gray-200 to-gray-600 bg-clip-text text-transparent">
            {t('title2')}
          </span>
        </motion.h1>

        <motion.p
          initial={{opacity: 0, y: 30}}
          animate={{opacity: 1, y: 0}}
          transition={{duration: 0.6, delay: 0.4}}
          className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-10"
        >
          {t('desc')}
        </motion.p>

        <motion.button
          initial={{opacity: 0, y: 30}}
          animate={{opacity: 1, y: 0}}
          transition={{duration: 0.6, delay: 0.55}}
          onClick={() => scrollTo('#b2b-section')}
          className="inline-flex items-center gap-2 bg-lime-500 hover:bg-lime-400 text-black font-bold px-8 py-4 rounded-lg transition-colors cursor-pointer"
        >
          {t('cta')}
          <ChevronRight size={20} />
        </motion.button>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{opacity: 0}}
        animate={{opacity: 1}}
        transition={{delay: 1}}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{y: [0, 10, 0]}}
          transition={{repeat: Infinity, duration: 1.5, ease: 'easeInOut'}}
        >
          <ChevronDown size={28} className="text-gray-400" />
        </motion.div>
      </motion.div>
    </section>
  );
}
