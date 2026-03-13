'use client';

import {useState, useEffect} from 'react';
import Image from 'next/image';
import {useTranslations} from 'next-intl';
import {useLocale} from 'next-intl';
import {useRouter, usePathname} from '@/i18n/navigation';
import {motion, AnimatePresence} from 'motion/react';
import {Menu, X, Globe} from 'lucide-react';

const navLinks = [
  {key: 'performance', href: '#performance'},
  {key: 'specs', href: '#specs'},
  {key: 'gallery', href: '#gallery'},
  {key: 'faq', href: '#faq'},
] as const;

export default function Header() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, {passive: true});
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleLanguage = () => {
    router.replace(pathname, {locale: locale === 'bg' ? 'en' : 'bg'});
  };

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({behavior: 'smooth'});
    }
  };

  return (
    <>
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-[#050505]/80 backdrop-blur-xl border-b border-lime-500/10 shadow-[0_4px_30px_rgba(0,0,0,0.8)] py-2'
          : 'bg-gradient-to-b from-[#050505]/80 to-transparent py-4'
      }`}
    >
      <div className="mx-auto max-w-[1400px] px-6">
        <div className="flex items-center justify-between">
          
          {/* Logo */}
          <div className="flex-shrink-0 cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
            <Image
              src="/images/logo.png"
              alt="Profiline GM25"
              width={160}
              height={40}
              className="h-8 w-auto object-contain"
              priority
            />
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <button
                key={link.key}
                onClick={() => handleNavClick(link.href)}
                className="text-xs font-semibold text-gray-400 hover:text-white uppercase tracking-widest transition-colors cursor-pointer relative group"
              >
                {t(link.key)}
                <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-lime-400 transition-all duration-300 group-hover:w-full" />
              </button>
            ))}
          </nav>

          {/* Right side: B2B CTA + language switcher + mobile hamburger */}
          <div className="flex items-center gap-6">
            
            {/* Language Switcher - Tech Style */}
            <button
              onClick={toggleLanguage}
              className="hidden sm:flex items-center gap-2 text-xs font-mono font-bold text-gray-400 hover:text-white transition-colors cursor-pointer group"
            >
              <Globe className="w-4 h-4 text-gray-500 group-hover:text-lime-400 transition-colors" />
              <span className={locale === 'en' ? 'text-lime-400' : ''}>EN</span>
              <span className="text-[#333]">/</span>
              <span className={locale === 'bg' ? 'text-lime-400' : ''}>BG</span>
            </button>

            {/* B2B Contact CTA - Always visible on desktop */}
            <button
              onClick={() => handleNavClick('#b2b-section')}
              className="hidden md:flex items-center gap-2 bg-[#111] border border-[#222] hover:border-lime-500/50 hover:bg-[#1a1a1a] text-white text-xs font-bold uppercase tracking-widest px-5 py-2.5 rounded-lg transition-all duration-300 group cursor-pointer"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-lime-400 animate-pulse" />
              {t('b2bCta')}
            </button>

            {/* Mobile hamburger */}
            <button
              className="md:hidden w-10 h-10 flex items-center justify-center text-gray-300 hover:text-lime-400 cursor-pointer bg-[#111] border border-[#222] rounded-lg transition-colors"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={20} />
            </button>
          </div>
        </div>
      </div>
    </header>

      {/* Mobile overlay menu - Moved OUTSIDE header to avoid stacking context issues from backdrop-blur */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            transition={{duration: 0.3}}
            className="fixed inset-0 z-[100] bg-[#050505]/98 backdrop-blur-xl flex flex-col md:hidden"
          >
            {/* Mobile Menu Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#1a1a1a]">
              <div className="text-lime-400 font-mono text-xs uppercase tracking-widest">
                System Menu
              </div>
              <button
                className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-white bg-[#111] border border-[#222] rounded-lg transition-colors"
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
              >
                <X size={20} />
              </button>
            </div>

            {/* Mobile Nav Links */}
            <nav className="flex flex-col px-6 py-10 gap-8 flex-grow">
              {navLinks.map((link, i) => (
                <motion.button
                  key={link.key}
                  initial={{opacity: 0, x: -20}}
                  animate={{opacity: 1, x: 0}}
                  transition={{delay: i * 0.05 + 0.1}}
                  onClick={() => handleNavClick(link.href)}
                  className="text-2xl font-bold text-gray-300 hover:text-lime-400 transition-colors text-left uppercase tracking-widest flex items-center justify-between"
                >
                  {t(link.key)}
                  <span className="text-xs font-mono text-gray-600">[0{i + 1}]</span>
                </motion.button>
              ))}
            </nav>

            {/* Mobile Bottom Action Bar */}
            <motion.div 
              initial={{opacity: 0, y: 20}}
              animate={{opacity: 1, y: 0}}
              transition={{delay: 0.3}}
              className="p-6 border-t border-[#1a1a1a] bg-[#0a0a0a]"
            >
              {/* Language Switcher Mobile */}
              <div className="flex items-center justify-between mb-6">
                <span className="text-xs font-mono text-gray-500 uppercase tracking-widest">Language / Език</span>
                <button
                  onClick={toggleLanguage}
                  className="flex items-center gap-3 text-sm font-mono font-bold text-gray-400 bg-[#111] px-4 py-2 border border-[#222] rounded-lg"
                >
                  <Globe className="w-4 h-4 text-lime-400" />
                  <span className={locale === 'en' ? 'text-white' : ''}>EN</span>
                  <span className="text-[#333]">|</span>
                  <span className={locale === 'bg' ? 'text-white' : ''}>BG</span>
                </button>
              </div>

              {/* B2B CTA Mobile */}
              <button
                onClick={() => handleNavClick('#b2b-section')}
                className="w-full flex items-center justify-center gap-3 bg-[#A3E635] text-black text-sm font-extrabold uppercase tracking-widest px-6 py-4 rounded-xl shadow-[0_0_20px_rgba(163,230,53,0.2)]"
              >
                <div className="w-2 h-2 rounded-full bg-black animate-pulse" />
                {t('b2bCta')}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
