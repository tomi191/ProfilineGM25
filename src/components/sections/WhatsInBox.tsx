'use client';

import {useTranslations} from 'next-intl';
import {motion} from 'motion/react';
import {Zap, Circle, BookOpen, FileCheck} from 'lucide-react';

const items = [
  {key: 'item1', icon: Zap},
  {key: 'item2', icon: Circle},
  {key: 'item3', icon: Circle},
  {key: 'item4', icon: BookOpen},
  {key: 'item5', icon: FileCheck},
] as const;

export default function WhatsInBox() {
  const t = useTranslations('box');

  return (
    <section className="bg-[#050505] py-24 border-t border-[#1a1a1a]">
      <div className="mx-auto max-w-7xl px-6">
        {/* Title */}
        <motion.h2
          initial={{opacity: 0, y: 20}}
          whileInView={{opacity: 1, y: 0}}
          viewport={{once: true, margin: '-100px'}}
          transition={{duration: 0.5}}
          className="text-3xl md:text-5xl font-bold text-center mb-14"
        >
          {t('title')}
        </motion.h2>

        {/* Grid of items */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          {items.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.key}
                initial={{opacity: 0, y: 20}}
                whileInView={{opacity: 1, y: 0}}
                viewport={{once: true, margin: '-100px'}}
                transition={{duration: 0.4, delay: i * 0.1}}
                className="bg-[#111] border border-[#222] rounded-xl p-6 text-center hover:border-[#333] transition-colors last:col-span-2 md:last:col-span-1 justify-self-center last:w-full md:last:w-auto"
              >
                <Icon className="w-10 h-10 text-lime-400 mx-auto mb-4" />
                <p className="text-sm font-medium text-gray-300">{t(item.key)}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
