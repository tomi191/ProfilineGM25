'use client';

import {useState, useEffect} from 'react';
import Image from 'next/image';
import {useTranslations} from 'next-intl';
import {useLocale} from 'next-intl';
import {useRouter, usePathname} from '@/i18n/navigation';
import {motion, AnimatePresence} from 'motion/react';
import {Menu, X} from 'lucide-react';

const navLinks = [
  {key: 'product', href: '#product'},
  {key: 'specs', href: '#specs'},
  {key: 'gallery', href: '#gallery'},
  {key: 'faq', href: '#faq'},
  {key: 'contact', href: '#b2b-section'},
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
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#050505]/90 backdrop-blur-md border-b border-[#1a1a1a]'
          : 'bg-transparent'
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Image
              src="/images/logo.png"
              alt="Profiline"
              width={150}
              height={40}
              className="h-8 w-auto"
              priority
            />
          </div>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.key}
                onClick={() => handleNavClick(link.href)}
                className="text-sm font-medium text-gray-300 hover:text-white transition-colors cursor-pointer"
              >
                {t(link.key)}
              </button>
            ))}
          </nav>

          {/* Right side: language switcher + mobile hamburger */}
          <div className="flex items-center gap-4">
            <button
              onClick={toggleLanguage}
              className="text-sm font-medium text-gray-300 hover:text-white transition-colors px-2 py-1 rounded border border-gray-700 hover:border-gray-500 cursor-pointer"
            >
              {locale === 'bg' ? 'EN' : 'BG'}
            </button>

            <button
              className="md:hidden text-gray-300 hover:text-white cursor-pointer"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile overlay menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            transition={{duration: 0.2}}
            className="fixed inset-0 z-50 bg-[#050505]/95 backdrop-blur-lg flex flex-col items-center justify-center md:hidden"
          >
            <button
              className="absolute top-4 right-4 text-gray-300 hover:text-white cursor-pointer"
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
            >
              <X size={28} />
            </button>

            <nav className="flex flex-col items-center gap-8">
              {navLinks.map((link, i) => (
                <motion.button
                  key={link.key}
                  initial={{opacity: 0, y: 20}}
                  animate={{opacity: 1, y: 0}}
                  transition={{delay: i * 0.05}}
                  onClick={() => handleNavClick(link.href)}
                  className="text-2xl font-medium text-gray-200 hover:text-lime-400 transition-colors cursor-pointer"
                >
                  {t(link.key)}
                </motion.button>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
