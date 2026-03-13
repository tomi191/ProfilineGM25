'use client';

import React from 'react';
import { motion } from 'motion/react';
import Image from 'next/image';

const logos = [
  { src: '/images/partners-logo/20.jpg', alt: 'Partner 1' },
  { src: '/images/partners-logo/300945749_536995064894413_1005253511202459443_n.jpg', alt: 'Partner 2' },
  { src: '/images/partners-logo/bxqo3llz_image_0.jpg', alt: 'Partner 3' },
  { src: '/images/partners-logo/viber_изображение_2026-03-13_14-57-22-327.png', alt: 'Partner 4' },
];

export default function InfinitePartnerScroll() {
  // Duplicate logos to create a seamless infinite loop
  const scrollItems = [...logos, ...logos, ...logos, ...logos];

  return (
    <div className="w-full relative bg-[#050505] pt-8 pb-12 border-t border-[#111]">
      {/* Label - Positioned relatively so it doesn't get clipped by any hidden overflow */}
      <div className="flex justify-center mb-6">
        <div className="px-4 py-1.5 bg-[#050505] border border-[#1a1a1a] rounded-full flex items-center gap-2 shadow-[0_0_15px_rgba(0,0,0,0.5)]">
          <div className="w-1.5 h-1.5 rounded-full bg-lime-400 animate-pulse" />
          <span className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold">Доверен избор на професионалистите</span>
        </div>
      </div>

      <div className="relative overflow-hidden w-full">
        {/* Fade Edges */}
      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#050505] to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#050505] to-transparent z-10 pointer-events-none" />

      {/* Scrolling Track */}
      <div className="flex items-center w-full">
        <motion.div
          animate={{ x: ['0%', '-50%'] }}
          transition={{
            repeat: Infinity,
            ease: "linear",
            duration: 30, // Slow, elegant scroll
          }}
          className="flex items-center gap-16 md:gap-24 px-8 w-max"
        >
          {scrollItems.map((logo, index) => (
            <div 
              key={index} 
              className="relative w-[120px] h-[50px] grayscale hover:grayscale-0 opacity-40 hover:opacity-100 transition-all duration-500 flex items-center justify-center mix-blend-screen"
            >
              <Image
                src={logo.src}
                alt={logo.alt}
                fill
                className="object-contain"
                sizes="120px"
              />
            </div>
          ))}
        </motion.div>
      </div>
      </div>
    </div>
  );
}
