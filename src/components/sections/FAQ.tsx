'use client';

import {useState} from 'react';
import {useTranslations} from 'next-intl';
import {motion, AnimatePresence} from 'motion/react';
import {ChevronDown} from 'lucide-react';

interface FAQProps {
  cms?: Record<string, unknown>;
}

export default function FAQ({cms}: FAQProps) {
  const t = useTranslations('faq');
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const c = (key: string) => {
    if (cms && cms[key] !== undefined) return String(cms[key]);
    return t(key);
  };

  // Build FAQ keys dynamically: use CMS pairs if available, otherwise hardcoded 6
  const faqKeys: string[] = [];
  if (cms) {
    let i = 1;
    while (cms[`q${i}`] !== undefined) {
      faqKeys.push(`q${i}`);
      i++;
    }
  }
  if (faqKeys.length === 0) {
    faqKeys.push('q1', 'q2', 'q3', 'q4', 'q5', 'q6');
  }

  return (
    <section id="faq" className="bg-[#0a0a0a] py-24">
      <div className="mx-auto max-w-4xl px-6">
        <motion.h2
          initial={{opacity: 0, y: 20}}
          whileInView={{opacity: 1, y: 0}}
          viewport={{once: true, margin: '-100px'}}
          transition={{duration: 0.5}}
          className="text-3xl md:text-5xl font-bold text-center mb-14"
        >
          {c('title')}
        </motion.h2>

        <div className="space-y-4">
          {faqKeys.map((key, i) => {
            const isOpen = openIndex === i;
            const answerKey = key.replace('q', 'a');

            return (
              <motion.div
                key={key}
                initial={{opacity: 0, y: 20}}
                whileInView={{opacity: 1, y: 0}}
                viewport={{once: true, margin: '-100px'}}
                transition={{duration: 0.4, delay: i * 0.08}}
                className="border border-[#222] rounded-2xl bg-[#111] overflow-hidden"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full flex items-center justify-between px-4 sm:px-6 py-5 text-left cursor-pointer min-h-[44px]"
                >
                  <span className="font-semibold text-white pr-4">{c(key)}</span>
                  <motion.span
                    animate={{rotate: isOpen ? 180 : 0}}
                    transition={{duration: 0.3}}
                    className="flex-shrink-0"
                  >
                    <ChevronDown className="w-5 h-5 text-lime-400" />
                  </motion.span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{height: 0, opacity: 0}}
                      animate={{height: 'auto', opacity: 1}}
                      exit={{height: 0, opacity: 0}}
                      transition={{duration: 0.3, ease: 'easeInOut'}}
                    >
                      <div className="px-4 sm:px-6 pb-5 text-gray-400">
                        {c(answerKey)}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
