'use client';

import {useState} from 'react';
import {useTranslations} from 'next-intl';
import {Lock, Shield, CreditCard} from 'lucide-react';
import LegalModal from '@/components/ui/LegalModal';

type ModalType = 'privacy' | 'terms' | 'cookie' | null;

/* Map CMS field names to translation keys where they differ */
const cmsKeyMap: Record<string, string> = {
  desc: 'description',
};

interface FooterProps {
  cms?: Record<string, unknown>;
}

export default function Footer({cms}: FooterProps) {
  const t = useTranslations('footer');
  const c = (key: string) => {
    const cmsField = cmsKeyMap[key] ?? key;
    if (cms && cms[cmsField] !== undefined) return String(cms[cmsField]);
    return t(key);
  };
  const tLegal = useTranslations('legal');
  const [modalType, setModalType] = useState<ModalType>(null);

  return (
    <>
      <footer className="bg-[#050505] border-t border-[#1a1a1a] pt-16 pb-8">
        <div className="mx-auto max-w-7xl px-6">
          {/* Main grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            {/* Col 1-2: Brand */}
            <div className="md:col-span-2">
              <h3 className="text-2xl font-bold tracking-tight text-white mb-3">
                PROFILINE
              </h3>
              <p className="text-gray-500 mb-6 max-w-md">{c('desc')}</p>

              {/* Social icons */}
              <div className="flex gap-3">
                {/* Facebook */}
                <a
                  href="https://www.facebook.com/profile.php?id=61579498340048"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-11 h-11 flex items-center justify-center bg-[#111] border border-[#222] rounded-full hover:border-lime-400 hover:bg-[#1a1a1a] transition-colors"
                  aria-label="Facebook"
                >
                  <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>

                {/* Instagram */}
                <a
                  href="#"
                  className="w-11 h-11 flex items-center justify-center bg-[#111] border border-[#222] rounded-full hover:border-lime-400 hover:bg-[#1a1a1a] transition-colors"
                  aria-label="Instagram"
                >
                  <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                  </svg>
                </a>

                {/* YouTube */}
                <a
                  href="#"
                  className="w-11 h-11 flex items-center justify-center bg-[#111] border border-[#222] rounded-full hover:border-lime-400 hover:bg-[#1a1a1a] transition-colors"
                  aria-label="YouTube"
                >
                  <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Col 3: Support */}
            <div>
              <h4 className="font-bold uppercase text-sm tracking-wider text-white mb-4">
                {t('support')}
              </h4>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-gray-500 hover:text-lime-400 transition-colors text-sm">
                    {t('manual')}
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-500 hover:text-lime-400 transition-colors text-sm">
                    {t('warranty')}
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-500 hover:text-lime-400 transition-colors text-sm">
                    {t('parts')}
                  </a>
                </li>
                <li>
                  <a
                    href="#b2b-section"
                    className="text-gray-500 hover:text-lime-400 transition-colors text-sm"
                  >
                    {t('contact')}
                  </a>
                </li>
              </ul>
            </div>

            {/* Col 4: Legal */}
            <div>
              <h4 className="font-bold uppercase text-sm tracking-wider text-white mb-4">
                {t('legal')}
              </h4>
              <ul className="space-y-3">
                <li>
                  <button
                    onClick={() => setModalType('terms')}
                    className="text-gray-500 hover:text-lime-400 transition-colors text-sm cursor-pointer"
                  >
                    {t('terms')}
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setModalType('privacy')}
                    className="text-gray-500 hover:text-lime-400 transition-colors text-sm cursor-pointer"
                  >
                    {t('privacy')}
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setModalType('cookie')}
                    className="text-gray-500 hover:text-lime-400 transition-colors text-sm cursor-pointer"
                  >
                    {t('cookiePolicy')}
                  </button>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-[#1a1a1a] pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
            <p className="text-gray-600 text-sm">{t('rights')}</p>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 text-gray-600 text-xs">
                <Lock className="w-4 h-4" />
                <span>{t('ssl')}</span>
              </div>
              <div className="flex items-center gap-1.5 text-gray-600 text-xs">
                <Shield className="w-4 h-4" />
                <span>{t('verified')}</span>
              </div>
              <div className="flex items-center gap-1.5 text-gray-600 text-xs">
                <CreditCard className="w-4 h-4" />
              </div>
            </div>
          </div>
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
