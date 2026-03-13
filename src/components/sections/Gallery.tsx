'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { X, ChevronLeft, ChevronRight, Maximize2, Camera } from 'lucide-react';

const photos = [
  { src: '/images/ai-webp/hero-cinematic.webp', alt: 'Profiline GM25 professional studio shot — side profile' },
  { src: '/images/ai-webp/studio-top.webp', alt: 'Profiline GM25 top-down view showing speed dial and ergonomic grip' },
  { src: '/images/ai-webp/studio-side.webp', alt: 'Profiline GM25 studio side view with cable' },
  { src: '/images/ai-webp/with-box-front.webp', alt: 'Profiline GM25 with branded lime green box — front view' },
  { src: '/images/ai-webp/in-action-polishing.webp', alt: 'Profiline GM25 in action — professional car polishing' },
  { src: '/images/ai-webp/in-action-detail.webp', alt: 'Profiline GM25 detail polishing on dark paint' },
  { src: '/images/ai-webp/lifestyle-workshop.webp', alt: 'Profiline GM25 in professional detailing workshop' },
  { src: '/images/ai-webp/flat-lay.webp', alt: 'Profiline GM25 complete kit flat lay — polisher, pads, manual' },
  { src: '/images/ai-webp/motor-internals.webp', alt: 'Profiline GM25 motor internals — copper windings and rotor' },
];

/* Map CMS field names to translation keys where they differ */
const cmsKeyMap: Record<string, string> = {
  desc: 'subtitle',
};

interface GalleryProps {
  cms?: Record<string, unknown>;
}

export default function Gallery({ cms }: GalleryProps) {
  const t = useTranslations('gallery');
  const c = (key: string) => {
    const cmsField = cmsKeyMap[key] ?? key;
    if (cms && cms[cmsField] !== undefined) return String(cms[cmsField]);
    return t(key);
  };
  
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);

  const goNext = useCallback(() => {
    setLightboxIndex((prev) => (prev !== null ? (prev + 1) % photos.length : null));
  }, []);

  const goPrev = useCallback(() => {
    setLightboxIndex((prev) => (prev !== null ? (prev - 1 + photos.length) % photos.length : null));
  }, []);

  /* Keyboard navigation */
  useEffect(() => {
    if (lightboxIndex === null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [lightboxIndex, goNext, goPrev]);

  /* Lock body scroll when lightbox is open */
  useEffect(() => {
    if (lightboxIndex !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [lightboxIndex]);

  return (
    <section id="gallery" ref={containerRef} className="py-24 relative bg-[#050505] overflow-hidden border-t border-[#111]">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(163,230,53,0.05)_0%,transparent_70%)]" />
      </div>

      <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#111] border border-[#222] mb-4"
            >
              <Camera className="w-3.5 h-3.5 text-lime-400" />
              <span className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">{c('badge')}</span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-3"
            >
              {c('title')}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-gray-400 text-lg max-w-xl"
            >
              {c('desc')}
            </motion.p>
          </div>
        </div>

        {/* Masonry Grid Layout (replaces Swiper) */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {photos.map((photo, i) => {
            // Calculate parallax direction based on column
            const isEven = i % 2 === 0;
            const yTransform = useTransform(
              scrollYProgress, 
              [0, 1], 
              [isEven ? 50 : -50, isEven ? -50 : 50]
            );

            // Make the first item large, and vary aspect ratios
            const isLarge = i === 0 || i === 5;
            const isTall = i === 2 || i === 7;

            return (
              <motion.div
                key={photo.src}
                style={{ y: yTransform }}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.6, delay: (i % 4) * 0.1 }}
                className={`relative group cursor-pointer ${
                  isLarge ? 'col-span-2 row-span-2' : 
                  isTall ? 'col-span-1 row-span-2' : 
                  'col-span-1 row-span-1'
                }`}
                onClick={() => openLightbox(i)}
              >
                {/* Image Container */}
                <div className={`relative w-full h-full rounded-2xl overflow-hidden bg-[#111] border border-[#1a1a1a] transition-all duration-500 group-hover:border-lime-500/30 ${
                  isLarge ? 'aspect-square md:aspect-[4/3]' : 
                  isTall ? 'aspect-[3/4]' : 
                  'aspect-video md:aspect-square'
                }`}>
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    sizes={isLarge ? '(max-width: 768px) 100vw, 50vw' : '25vw'}
                    className="object-cover opacity-60 group-hover:opacity-100 transition-all duration-700 group-hover:scale-110"
                  />
                  
                  {/* Overlay Gradient on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Hover Icon */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 scale-50 group-hover:scale-100">
                    <div className="w-12 h-12 rounded-full bg-lime-500/20 backdrop-blur-md flex items-center justify-center border border-lime-500/50">
                      <Maximize2 className="w-5 h-5 text-lime-400" />
                    </div>
                  </div>

                  {/* Corner brackets */}
                  <div className="absolute top-4 left-4 w-4 h-4 border-t border-l border-white/20 group-hover:border-lime-400 transition-colors" />
                  <div className="absolute bottom-4 right-4 w-4 h-4 border-b border-r border-white/20 group-hover:border-lime-400 transition-colors" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Cinematic Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl"
          >
            {/* Top Bar */}
            <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-10 bg-gradient-to-b from-black/80 to-transparent">
              <div className="text-lime-400 font-mono text-sm tracking-widest">
                {t('photoCounter', { current: lightboxIndex + 1, total: photos.length })}
              </div>
              <button
                onClick={closeLightbox}
                className="text-gray-400 hover:text-white transition-colors p-2 bg-white/5 hover:bg-white/10 rounded-full"
              >
                <X size={24} />
              </button>
            </div>

            {/* Prev Button */}
            <button
              onClick={(e) => { e.stopPropagation(); goPrev(); }}
              className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 p-4 text-gray-500 hover:text-lime-400 transition-colors z-10 group"
            >
              <ChevronLeft size={48} strokeWidth={1} className="group-hover:-translate-x-2 transition-transform" />
            </button>

            {/* Main Image Container */}
            <div className="relative w-full h-full max-w-7xl max-h-[85vh] p-4 md:p-12 flex flex-col items-center justify-center">
              <motion.div
                key={lightboxIndex}
                initial={{ opacity: 0, scale: 0.98, filter: 'blur(10px)' }}
                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, scale: 1.02, filter: 'blur(10px)' }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="relative w-full h-full flex items-center justify-center"
              >
                <Image
                  src={photos[lightboxIndex].src}
                  alt={photos[lightboxIndex].alt}
                  fill
                  className="object-contain"
                  quality={100}
                  sizes="100vw"
                  priority
                />
              </motion.div>
              
              {/* Dynamic Description Box */}
              <motion.div
                key={`desc-${lightboxIndex}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-[#0a0a0a]/80 backdrop-blur-md border border-[#222] px-6 py-4 rounded-2xl max-w-2xl text-center w-[90%] md:w-auto"
              >
                <h4 className="text-white font-bold mb-1">{t(`photos.${lightboxIndex}.title`)}</h4>
                <p className="text-gray-400 text-sm">{t(`photos.${lightboxIndex}.description`)}</p>
              </motion.div>
            </div>

            {/* Next Button */}
            <button
              onClick={(e) => { e.stopPropagation(); goNext(); }}
              className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 p-4 text-gray-500 hover:text-lime-400 transition-colors z-10 group"
            >
              <ChevronRight size={48} strokeWidth={1} className="group-hover:translate-x-2 transition-transform" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
