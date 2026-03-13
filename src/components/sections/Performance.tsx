'use client';

import Image from 'next/image';
import {useTranslations} from 'next-intl';
import {motion} from 'motion/react';

interface PerformanceProps {
  cms?: Record<string, unknown>;
}

export default function Performance({cms}: PerformanceProps) {
  const t = useTranslations('performance');
  const c = (key: string) => {
    if (cms && cms[key] !== undefined) return String(cms[key]);
    return t(key);
  };

  return (
    <section className="bg-[#0a0a0a] py-24">
      <div className="mx-auto max-w-7xl px-6 space-y-24">
        {/* Block 1: Image left, text right */}
        <div className="flex flex-col md:flex-row gap-12 items-center">
          <motion.div
            initial={{opacity: 0, y: 50}}
            whileInView={{opacity: 1, y: 0}}
            viewport={{once: true, margin: '-100px'}}
            transition={{duration: 0.6}}
            className="w-full md:w-1/2"
          >
            <div className="aspect-video bg-[#111] border border-[#222] rounded-xl overflow-hidden">
              <Image
                src="/images/ai-webp/in-action-polishing.webp"
                alt="Profiline GM25 in action — professional car polishing"
                width={800}
                height={450}
                className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-all duration-500 hover:scale-105"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{opacity: 0, x: 50}}
            whileInView={{opacity: 1, x: 0}}
            viewport={{once: true, margin: '-100px'}}
            transition={{duration: 0.6, delay: 0.1}}
            className="w-full md:w-1/2"
          >
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">{c('title1')}</h3>
            <p className="text-gray-400 text-lg mb-6">{c('desc1')}</p>
            <ul className="space-y-3">
              {(['list1', 'list2', 'list3'] as const).map((key) => (
                <li key={key} className="flex items-center gap-3 text-gray-300">
                  <span className="w-2 h-2 rounded-full bg-lime-400 flex-shrink-0" />
                  {c(key)}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Block 2: Text left, image right (reversed) */}
        <div className="flex flex-col md:flex-row-reverse gap-12 items-center">
          <motion.div
            initial={{opacity: 0, y: 50}}
            whileInView={{opacity: 1, y: 0}}
            viewport={{once: true, margin: '-100px'}}
            transition={{duration: 0.6}}
            className="w-full md:w-1/2"
          >
            <div className="aspect-video bg-[#111] border border-[#222] rounded-xl overflow-hidden">
              <Image
                src="/images/ai-webp/motor-internals.webp"
                alt="Profiline GM25 motor internals — precision copper windings"
                width={800}
                height={450}
                className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-all duration-500 hover:scale-105"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{opacity: 0, x: -50}}
            whileInView={{opacity: 1, x: 0}}
            viewport={{once: true, margin: '-100px'}}
            transition={{duration: 0.6, delay: 0.1}}
            className="w-full md:w-1/2"
          >
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">{c('title2')}</h3>
            <p className="text-gray-400 text-lg">{c('desc2')}</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
