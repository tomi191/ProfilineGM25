'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, Database, Terminal, ShieldQuestion } from 'lucide-react';

interface FAQProps {
  cms?: Record<string, unknown>;
}

export default function FAQ({ cms }: FAQProps) {
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
    <section id="faq" className="bg-[#050505] py-32 relative overflow-hidden border-t border-[#111]">
      
      {/* Background Architectural Grid */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_0%,#000_20%,transparent_100%)]" />
      </div>

      <div className="mx-auto max-w-7xl px-6 relative z-10">
        
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-20">
          
          {/* Left Panel - Tech Support Context */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-4 flex flex-col"
          >
            <div className="sticky top-32">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#111] border border-[#222] mb-6">
                <Database className="w-3.5 h-3.5 text-lime-400" />
                <span className="text-[10px] text-gray-400 uppercase tracking-widest font-mono">Knowledge Base</span>
              </div>
              
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-6">
                {c('title')}
              </h2>
              
              <p className="text-gray-400 leading-relaxed mb-10">
                Достъп до нашата техническа база данни. Всичко, което трябва да знаете за интеграцията на Profiline GM25 във вашия бизнес.
              </p>

              {/* Decorative Support Status */}
              <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-6 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-lime-500/5 blur-3xl rounded-full" />
                <div className="flex items-center gap-4 mb-4 relative z-10">
                  <div className="w-10 h-10 rounded-full bg-[#111] border border-[#222] flex items-center justify-center">
                    <Terminal className="w-4 h-4 text-lime-400" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 uppercase tracking-widest font-mono mb-1">Support Status</div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-lime-500 animate-pulse shadow-[0_0_8px_rgba(163,230,53,0.8)]" />
                      <span className="text-sm text-white font-bold tracking-wide">SYSTEM.ONLINE</span>
                    </div>
                  </div>
                </div>
                <div className="text-xs text-gray-500 font-mono border-t border-[#1a1a1a] pt-4 relative z-10">
                  Network: B2B-EU-EAST<br/>
                  Latency: 12ms
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Panel - Accordion List */}
          <div className="lg:col-span-8 space-y-3">
            {faqKeys.map((key, i) => {
              const isOpen = openIndex === i;
              const answerKey = key.replace('q', 'a');
              const indexFormatted = String(i + 1).padStart(2, '0');

              return (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className={`border rounded-2xl overflow-hidden transition-all duration-300 ${
                    isOpen 
                      ? 'bg-[#0a0a0a] border-lime-500/30 shadow-[0_0_30px_rgba(163,230,53,0.05)]' 
                      : 'bg-[#050505] border-[#1a1a1a] hover:border-[#333] hover:bg-[#0a0a0a]'
                  }`}
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                    className="w-full flex items-center gap-4 px-5 sm:px-8 py-6 text-left cursor-pointer group"
                  >
                    {/* Mono Index */}
                    <div className={`text-[10px] font-mono tracking-widest flex-shrink-0 transition-colors duration-300 ${isOpen ? 'text-lime-400' : 'text-gray-600 group-hover:text-gray-400'}`}>
                      [Q:{indexFormatted}]
                    </div>
                    
                    {/* Question Text */}
                    <span className={`font-bold flex-grow pr-4 transition-colors duration-300 ${isOpen ? 'text-white' : 'text-gray-300 group-hover:text-white'}`}>
                      {c(key)}
                    </span>
                    
                    {/* Icon */}
                    <motion.div
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center border transition-colors duration-300 ${
                        isOpen ? 'bg-lime-500/10 border-lime-500/30 text-lime-400' : 'bg-[#111] border-[#222] text-gray-500 group-hover:text-white'
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" strokeWidth={2.5} />
                    </motion.div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <div className="px-5 sm:px-8 pb-7 pt-2 flex gap-4">
                          {/* Left spacer to align with text */}
                          <div className="w-[38px] flex-shrink-0 flex justify-center">
                            <div className="w-[1px] bg-gradient-to-b from-lime-500/20 to-transparent" />
                          </div>
                          
                          <div className="text-gray-400 leading-relaxed text-sm">
                            {c(answerKey)}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}
