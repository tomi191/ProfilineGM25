'use client';

import {useState, useCallback} from 'react';
import Image from 'next/image';
import {useTranslations} from 'next-intl';
import {motion, AnimatePresence} from 'motion/react';
import {X, ChevronLeft, ChevronRight} from 'lucide-react';
import {Swiper, SwiperSlide} from 'swiper/react';
import {Navigation, Pagination, Autoplay} from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const photos = [
  {src: '/images/ai-webp/hero-cinematic.webp', alt: 'Profiline GM25 professional studio shot — side profile'},
  {src: '/images/ai-webp/studio-top.webp', alt: 'Profiline GM25 top-down view showing speed dial and ergonomic grip'},
  {src: '/images/ai-webp/studio-side.webp', alt: 'Profiline GM25 studio side view with cable'},
  {src: '/images/ai-webp/with-box-front.webp', alt: 'Profiline GM25 with branded lime green box — front view'},
  {src: '/images/ai-webp/in-action-polishing.webp', alt: 'Profiline GM25 in action — professional car polishing'},
  {src: '/images/ai-webp/in-action-detail.webp', alt: 'Profiline GM25 detail polishing on dark paint'},
  {src: '/images/ai-webp/lifestyle-workshop.webp', alt: 'Profiline GM25 in professional detailing workshop'},
  {src: '/images/ai-webp/flat-lay.webp', alt: 'Profiline GM25 complete kit flat lay — polisher, pads, manual'},
  {src: '/images/ai-webp/motor-internals.webp', alt: 'Profiline GM25 motor internals — copper windings and rotor'},
];

/* Map CMS field names to translation keys where they differ */
const cmsKeyMap: Record<string, string> = {
  desc: 'subtitle',
};

interface GalleryProps {
  cms?: Record<string, unknown>;
}

export default function Gallery({cms}: GalleryProps) {
  const t = useTranslations('gallery');
  const c = (key: string) => {
    const cmsField = cmsKeyMap[key] ?? key;
    if (cms && cms[cmsField] !== undefined) return String(cms[cmsField]);
    return t(key);
  };
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);

  const goNext = useCallback(() => {
    setLightboxIndex((prev) => (prev !== null ? (prev + 1) % photos.length : null));
  }, []);

  const goPrev = useCallback(() => {
    setLightboxIndex((prev) => (prev !== null ? (prev - 1 + photos.length) % photos.length : null));
  }, []);

  return (
    <section id="gallery" className="py-20 md:py-28 relative">
      <div className="mx-auto max-w-7xl px-6">
        {/* Section header */}
        <div className="text-center mb-14">
          <motion.h2
            initial={{opacity: 0, y: 20}}
            whileInView={{opacity: 1, y: 0}}
            viewport={{once: true}}
            transition={{duration: 0.5}}
            className="text-3xl md:text-5xl font-extrabold mb-4"
          >
            {c('title')}
          </motion.h2>
          <motion.p
            initial={{opacity: 0, y: 20}}
            whileInView={{opacity: 1, y: 0}}
            viewport={{once: true}}
            transition={{duration: 0.5, delay: 0.1}}
            className="text-gray-400 text-lg max-w-xl mx-auto"
          >
            {c('desc')}
          </motion.p>
        </div>

        {/* Swiper carousel */}
        <motion.div
          initial={{opacity: 0, y: 30}}
          whileInView={{opacity: 1, y: 0}}
          viewport={{once: true}}
          transition={{duration: 0.6, delay: 0.2}}
        >
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            slidesPerView={1}
            spaceBetween={16}
            navigation
            pagination={{clickable: true}}
            autoplay={{delay: 4000, disableOnInteraction: false}}
            breakpoints={{
              768: {slidesPerView: 2},
              1024: {slidesPerView: 3},
            }}
            className="gallery-swiper"
          >
            {photos.map((photo, i) => (
              <SwiperSlide key={photo.src}>
                <button
                  onClick={() => openLightbox(i)}
                  className="block w-full cursor-pointer group"
                >
                  <div className="relative aspect-[4/3] overflow-hidden rounded-lg border border-[#222] bg-[#111]">
                    <Image
                      src={photo.src}
                      alt={photo.alt}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                </button>
              </SwiperSlide>
            ))}
          </Swiper>
        </motion.div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            transition={{duration: 0.2}}
            className="fixed inset-0 z-[60] bg-black/90 flex items-center justify-center"
            onClick={closeLightbox}
          >
            {/* Close button */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors cursor-pointer z-10"
              aria-label="Close lightbox"
            >
              <X size={32} />
            </button>

            {/* Previous arrow */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                goPrev();
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors cursor-pointer z-10"
              aria-label="Previous photo"
            >
              <ChevronLeft size={40} />
            </button>

            {/* Next arrow */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                goNext();
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors cursor-pointer z-10"
              aria-label="Next photo"
            >
              <ChevronRight size={40} />
            </button>

            {/* Image */}
            <motion.div
              key={lightboxIndex}
              initial={{opacity: 0, scale: 0.9}}
              animate={{opacity: 1, scale: 1}}
              exit={{opacity: 0, scale: 0.9}}
              transition={{duration: 0.2}}
              className="relative w-[90vw] h-[80vh] max-w-5xl"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={photos[lightboxIndex].src}
                alt={photos[lightboxIndex].alt}
                fill
                sizes="90vw"
                className="object-contain"
                priority
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
