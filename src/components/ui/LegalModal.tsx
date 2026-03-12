'use client';

import {useTranslations} from 'next-intl';
import {motion, AnimatePresence} from 'motion/react';
import {X} from 'lucide-react';

type ModalType = 'privacy' | 'terms' | 'cookie' | null;

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: ModalType;
}

const titleKeys: Record<string, string> = {
  privacy: 'privacyTitle',
  terms: 'termsTitle',
  cookie: 'cookieTitle',
};

const contentKeys: Record<string, string> = {
  privacy: 'privacyContent',
  terms: 'termsContent',
  cookie: 'cookieContent',
};

function renderLegalContent(content: string) {
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.trim() === '') {
      continue;
    }

    if (line.startsWith('## ')) {
      elements.push(
        <h4 key={i} className="text-white font-semibold text-base mt-5 mb-2">
          {line.replace('## ', '')}
        </h4>
      );
    } else if (line.startsWith('# ')) {
      elements.push(
        <h3 key={i} className="text-white font-bold text-lg mt-6 mb-3 first:mt-0">
          {line.replace('# ', '')}
        </h3>
      );
    } else if (line.startsWith('- ')) {
      elements.push(
        <li key={i} className="text-gray-400 leading-relaxed ml-4 list-disc">
          {line.replace('- ', '')}
        </li>
      );
    } else {
      elements.push(
        <p key={i} className="text-gray-400 leading-relaxed mb-2">
          {line}
        </p>
      );
    }
  }

  return elements;
}

export default function LegalModal({isOpen, onClose, type}: LegalModalProps) {
  const t = useTranslations('legal');

  return (
    <AnimatePresence>
      {isOpen && type && (
        <motion.div
          initial={{opacity: 0}}
          animate={{opacity: 1}}
          exit={{opacity: 0}}
          transition={{duration: 0.2}}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          {/* Backdrop */}
          <motion.div
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal card */}
          <motion.div
            initial={{opacity: 0, scale: 0.95, y: 20}}
            animate={{opacity: 1, scale: 1, y: 0}}
            exit={{opacity: 0, scale: 0.95, y: 20}}
            transition={{duration: 0.3}}
            className="relative w-full max-w-2xl bg-[#111] border border-[#333] rounded-2xl max-h-[85vh] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#222]">
              <h3 className="text-xl font-bold text-white">
                {t(titleKeys[type])}
              </h3>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#222] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {/* Scrollable body */}
            <div className="flex-1 overflow-y-auto px-6 py-6">
              {renderLegalContent(t(contentKeys[type]))}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-[#222]">
              <button
                onClick={onClose}
                className="w-full bg-lime-500 hover:bg-lime-600 text-black font-bold py-3 rounded-lg transition-colors cursor-pointer"
              >
                {t('close')}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
