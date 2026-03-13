'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Lock, Shield, CreditCard, ChevronRight, Activity } from 'lucide-react';
import LegalModal from '@/components/ui/LegalModal';
import { motion } from 'motion/react';

type ModalType = 'privacy' | 'terms' | 'cookie' | null;

/* Map CMS field names to translation keys where they differ */
const cmsKeyMap: Record<string, string> = {
  desc: 'description',
};

interface FooterProps {
  cms?: Record<string, unknown>;
}

export default function Footer({ cms }: FooterProps) {
  const t = useTranslations('footer');
  const tNav = useTranslations('nav');
  const c = (key: string) => {
    const cmsField = cmsKeyMap[key] ?? key;
    if (cms && cms[cmsField] !== undefined) return String(cms[cmsField]);
    return t(key);
  };
  const [modalType, setModalType] = useState<ModalType>(null);

  const scrollTo = (id: string) => {
    const el = document.querySelector(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <footer className="bg-[#050505] border-t border-[#111] pt-24 pb-12 relative overflow-hidden">
        
        {/* Background Grid & Glow */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_100%_50%_at_50%_100%,#000_10%,transparent_100%)]" />
        </div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-px bg-gradient-to-r from-transparent via-lime-500/30 to-transparent" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-lime-500/5 blur-[100px] rounded-full pointer-events-none" />

        <div className="mx-auto max-w-7xl px-6 relative z-10">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-12 mb-16">
            
            {/* Col 1: Brand & Infrastructure */}
            <div className="lg:col-span-5 flex flex-col justify-between">
              <div>
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="mb-6"
                >
                  <Image 
                    src="/images/logo.png" 
                    alt="Profiline GM25 Logo" 
                    width={180} 
                    height={60} 
                    className="object-contain"
                  />
                </motion.div>
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="text-gray-400 text-sm leading-relaxed max-w-sm mb-8"
                >
                  {c('desc')}
                </motion.p>
              </div>

              {/* System Architecture Block */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl p-5 max-w-sm"
              >
                <div className="flex items-center justify-between mb-4 border-b border-[#222] pb-3">
                  <span className="text-[10px] text-gray-500 uppercase tracking-widest font-mono">B2B Infrastructure</span>
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-lime-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-lime-500"></span>
                    </span>
                    <span className="text-[10px] text-lime-400 font-mono">Operational</span>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <a href="https://www.facebook.com/profile.php?id=61579498340048" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#111] border border-[#222] hover:border-lime-500/50 hover:bg-[#1a1a1a] transition-colors group">
                    <svg className="w-4 h-4 text-gray-400 group-hover:text-lime-400 transition-colors" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                  </a>
                  <a href="#" className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#111] border border-[#222] hover:border-lime-500/50 hover:bg-[#1a1a1a] transition-colors group">
                    <svg className="w-4 h-4 text-gray-400 group-hover:text-lime-400 transition-colors" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>
                  </a>
                  <a href="#" className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#111] border border-[#222] hover:border-lime-500/50 hover:bg-[#1a1a1a] transition-colors group">
                    <svg className="w-4 h-4 text-gray-400 group-hover:text-lime-400 transition-colors" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>
                  </a>
                </div>
              </motion.div>
            </div>

            {/* Col 2: Navigation / Quick Links */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-3 lg:col-start-7"
            >
              <h4 className="font-mono text-xs uppercase tracking-widest text-lime-400 mb-6">
                System Links
              </h4>
              <ul className="space-y-4">
                {[
                  { name: tNav('product'), target: '#top' },
                  { name: tNav('gallery'), target: '#gallery' },
                  { name: tNav('specs'), target: '#specs' },
                  { name: tNav('faq'), target: '#faq' }
                ].map((link) => (
                  <li key={link.name}>
                    <button onClick={() => scrollTo(link.target)} className="group flex items-center text-sm text-gray-400 hover:text-white transition-colors cursor-pointer">
                      <ChevronRight className="w-4 h-4 mr-2 text-[#333] group-hover:text-lime-400 transition-colors" />
                      {link.name}
                    </button>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Col 3: Support & Legal */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-3"
            >
              <div className="mb-10">
                <h4 className="font-mono text-xs uppercase tracking-widest text-lime-400 mb-6">
                  {t('support')}
                </h4>
                <ul className="space-y-4">
                  <li><a href="#" className="group flex items-center text-sm text-gray-400 hover:text-white transition-colors"><ChevronRight className="w-4 h-4 mr-2 text-[#333] group-hover:text-lime-400 transition-colors" /> {t('manual')}</a></li>
                  <li><a href="#" className="group flex items-center text-sm text-gray-400 hover:text-white transition-colors"><ChevronRight className="w-4 h-4 mr-2 text-[#333] group-hover:text-lime-400 transition-colors" /> {t('warranty')}</a></li>
                  <li><a href="#b2b-section" className="group flex items-center text-sm text-gray-400 hover:text-white transition-colors"><ChevronRight className="w-4 h-4 mr-2 text-[#333] group-hover:text-lime-400 transition-colors" /> {t('contact')}</a></li>
                </ul>
              </div>

              <div>
                <h4 className="font-mono text-xs uppercase tracking-widest text-gray-600 mb-4">
                  {t('legal')}
                </h4>
                <ul className="flex flex-wrap gap-x-6 gap-y-2">
                  <li><button onClick={() => setModalType('terms')} className="text-xs text-gray-500 hover:text-white transition-colors">{t('terms')}</button></li>
                  <li><button onClick={() => setModalType('privacy')} className="text-xs text-gray-500 hover:text-white transition-colors">{t('privacy')}</button></li>
                  <li><button onClick={() => setModalType('cookie')} className="text-xs text-gray-500 hover:text-white transition-colors">{t('cookiePolicy')}</button></li>
                </ul>
              </div>
            </motion.div>

          </div>

          {/* Bottom Bar: Security & Copyright */}
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="border-t border-[#1a1a1a] pt-8 flex flex-col md:flex-row items-center justify-between gap-6"
          >
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 bg-[#111] border border-[#222] px-3 py-1.5 rounded-md">
                <Lock className="w-3.5 h-3.5 text-gray-400" />
                <span className="text-[10px] text-gray-400 font-mono uppercase tracking-wider">{t('ssl')}</span>
              </div>
              <div className="flex items-center gap-2 bg-[#111] border border-[#222] px-3 py-1.5 rounded-md">
                <Shield className="w-3.5 h-3.5 text-gray-400" />
                <span className="text-[10px] text-gray-400 font-mono uppercase tracking-wider">{t('verified')}</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 text-gray-600">
                <CreditCard className="w-4 h-4" />
              </div>
            </div>

            <div className="flex items-center gap-6">
              <p className="text-gray-600 text-xs font-mono">{t('rights')} | 2026.1</p>
              <div className="w-1 h-1 rounded-full bg-[#333]" />
              <p className="text-gray-500 text-xs font-mono">
                Developed by <a href="https://level8.bg" target="_blank" rel="noopener noreferrer" className="text-lime-500 hover:text-lime-400 transition-colors">Level8.bg</a>
              </p>
            </div>
          </motion.div>

        </div>
      </footer>

      <LegalModal
        isOpen={modalType !== null}
        onClose={() => setModalType(null)}
        type={modalType}
      />
    </>
  );
}
