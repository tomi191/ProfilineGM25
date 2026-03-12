'use client';

import Image from 'next/image';
import {useTranslations} from 'next-intl';
import {motion} from 'motion/react';
import {Zap, Activity, Wind, Settings} from 'lucide-react';

const features = [
  {icon: Zap, titleKey: 'spec1Title', descKey: 'spec1Desc'},
  {icon: Activity, titleKey: 'spec2Title', descKey: 'spec2Desc'},
  {icon: Wind, titleKey: 'spec3Title', descKey: 'spec3Desc'},
  {icon: Settings, titleKey: 'spec4Title', descKey: 'spec4Desc'},
] as const;

const stats = [
  {valueKey: 'powerValue', labelKey: 'power'},
  {valueKey: 'weightValue', labelKey: 'weight'},
  {valueKey: 'orbitValue', labelKey: 'orbit'},
  {valueKey: 'platesValue', labelKey: 'plates'},
  {valueKey: 'speedValue', labelKey: 'speed'},
] as const;

export default function TechSpecs() {
  const t = useTranslations('specs');

  return (
    <section id="specs" className="py-20 md:py-28 relative">
      <div className="mx-auto max-w-7xl px-6">
        {/* Section header */}
        <div className="text-center mb-14">
          <motion.h2
            initial={{opacity: 0, y: 20}}
            whileInView={{opacity: 1, y: 0}}
            viewport={{once: true, margin: '-100px'}}
            transition={{duration: 0.5}}
            className="text-3xl md:text-5xl font-extrabold mb-4"
          >
            {t('title')}
          </motion.h2>
          <motion.p
            initial={{opacity: 0, y: 20}}
            whileInView={{opacity: 1, y: 0}}
            viewport={{once: true, margin: '-100px'}}
            transition={{duration: 0.5, delay: 0.1}}
            className="text-gray-400 text-lg max-w-xl mx-auto"
          >
            {t('desc')}
          </motion.p>
        </div>

        {/* Two-column layout */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* LEFT: Feature cards */}
          <div className="space-y-6">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.titleKey}
                  initial={{opacity: 0, x: -30}}
                  whileInView={{opacity: 1, x: 0}}
                  viewport={{once: true, margin: '-100px'}}
                  transition={{duration: 0.5, delay: i * 0.1}}
                  className="flex items-start gap-4"
                >
                  <div className="flex-shrink-0 w-12 h-12 bg-[#111] border border-[#222] rounded-full flex items-center justify-center">
                    <Icon className="text-lime-400 w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-1">{t(feature.titleKey)}</h3>
                    <p className="text-gray-400">{t(feature.descKey)}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* RIGHT: Product image */}
          <motion.div
            initial={{opacity: 0, scale: 0.9}}
            whileInView={{opacity: 1, scale: 1}}
            viewport={{once: true, margin: '-100px'}}
            transition={{duration: 0.7, delay: 0.2}}
            className="relative aspect-square rounded-2xl overflow-hidden bg-[#111] border border-[#222]"
            style={{boxShadow: '0 0 80px rgba(163, 230, 53, 0.08)'}}
          >
            <Image
              src="/images/product/gm25-side-view.jpg"
              alt="Profiline GM25 side view"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </motion.div>
        </div>

        {/* Stats bar */}
        <div className="mt-16 border-t border-[#1a1a1a] pt-12">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 text-center">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.valueKey}
                initial={{opacity: 0, y: 20}}
                whileInView={{opacity: 1, y: 0}}
                viewport={{once: true, margin: '-100px'}}
                transition={{duration: 0.4, delay: i * 0.1}}
              >
                <div className="text-3xl font-bold text-white">{t(stat.valueKey)}</div>
                <div className="text-sm text-gray-500 uppercase tracking-wider mt-1">{t(stat.labelKey)}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
