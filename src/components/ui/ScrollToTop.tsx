'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronUp } from 'lucide-react';

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  // Show button when page is scrolled down 500px
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 500) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 20 }}
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-[90] p-3 rounded-xl bg-[#111]/80 backdrop-blur-md border border-[#222] text-gray-400 hover:text-lime-400 hover:border-lime-500/50 hover:bg-[#1a1a1a] shadow-[0_0_20px_rgba(0,0,0,0.5)] transition-all duration-300 group cursor-pointer"
          aria-label="Scroll to top"
        >
          <ChevronUp size={24} strokeWidth={2} className="group-hover:-translate-y-1 transition-transform relative z-10" />
          
          {/* Subtle green glow behind the button */}
          <div className="absolute inset-0 bg-lime-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-0" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
