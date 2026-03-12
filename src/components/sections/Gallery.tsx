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
  {src: '/images/product/gm25-side-view.jpg', alt: 'Profiline GM25 side view showing ergonomic grip design'},
  {src: '/images/product/gm25-with-box.jpg', alt: 'Profiline GM25 complete package with branded carry box'},
  {src: '/images/product/gm25-speed-dial.jpg', alt: 'Profiline GM25 6-speed variable control dial close-up'},
  {src: '/images/product/gm25-rear-view.jpg', alt: 'Profiline GM25 rear view showing motor housing and cable'},
  {src: '/images/product/gm25-backing-plate-top.jpg', alt: 'Profiline GM25 backing plate top view showing mounting mechanism'},
  {src: '/images/product/gm25-logo-closeup.jpg', alt: 'Profiline GM25 brand logo engraved on the polisher body'},
  {src: '/images/product/gm25-specs-label.jpg', alt: 'Profiline GM25 technical specifications label with CE marking'},
  {src: '/images/product/gm25-motor-internals.jpg', alt: 'Profiline GM25 motor internals showing copper windings and brushes'},
];

export default function Gallery() {
  const t = useTranslations('gallery');
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
            {t('title')}
          </motion.h2>
          <motion.p
            initial={{opacity: 0, y: 20}}
            whileInView={{opacity: 1, y: 0}}
            viewport={{once: true}}
            transition={{duration: 0.5, delay: 0.1}}
            className="text-gray-400 text-lg max-w-xl mx-auto"
          >
            {t('desc')}
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
