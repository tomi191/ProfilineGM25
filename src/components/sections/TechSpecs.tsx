'use client';

import Image from 'next/image';
import {useTranslations} from 'next-intl';
import {motion} from 'motion/react';
import {Zap, Activity, Wind, Settings} from 'lucide-react';

const leftFeatures = [
  {icon: Zap, titleKey: 'spec1Title', descKey: 'spec1Desc'},
  {icon: Activity, titleKey: 'spec2Title', descKey: 'spec2Desc'},
] as const;

const rightFeatures = [
  {icon: Wind, titleKey: 'spec3Title', descKey: 'spec3Desc'},
  {icon: Settings, titleKey: 'spec4Title', descKey: 'spec4Desc'},
] as const;

const stats = [
  {valueKey: 'powerValue', labelKey: 'power'},
  {valueKey: 'weightValue', labelKey: 'weight'},
  {valueKey: 'orbitValue', labelKey: 'orbit'},
  {valueKey: 'platesValue', labelKey: 'plates'},
] as const;

/* Map CMS field names to translation keys where they differ */
const cmsKeyMap: Record<string, string> = {
  desc: 'subtitle',
};

interface TechSpecsProps {
  cms?: Record<string, unknown>;
}

export default function TechSpecs({cms}: TechSpecsProps) {
  const t = useTranslations('specs');
  const c = (key: string) => {
    const cmsField = cmsKeyMap[key] ?? key;
    if (cms && cms[cmsField] !== undefined) return String(cms[cmsField]);
    return t(key);
  };

  return (
    <section id="specs" className="py-20 md:py-28 bg-[#050505] relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-6">
        {/* Section header */}
        <div className="text-center mb-16">
          <motion.h2
            initial={{opacity: 0, y: 20}}
            whileInView={{opacity: 1, y: 0}}
            viewport={{once: true, margin: '-100px'}}
            transition={{duration: 0.5}}
            className="text-3xl md:text-5xl font-extrabold mb-4"
          >
            {c('title')}
          </motion.h2>
          <motion.p
            initial={{opacity: 0, y: 20}}
            whileInView={{opacity: 1, y: 0}}
            viewport={{once: true, margin: '-100px'}}
            transition={{duration: 0.5, delay: 0.1}}
            className="text-gray-400 text-lg max-w-2xl mx-auto"
          >
            {c('desc')}
          </motion.p>
        </div>

        {/* 3-column layout */}
        <div className="grid lg:grid-cols-3 gap-12 items-center">
          {/* LEFT specs — right-aligned on desktop */}
          <div className="space-y-12">
            {leftFeatures.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.titleKey}
                  initial={{opacity: 0, x: -30}}
                  whileInView={{opacity: 1, x: 0}}
                  viewport={{once: true, margin: '-100px'}}
                  transition={{duration: 0.5, delay: i * 0.15}}
                  className="flex flex-col items-start lg:items-end text-left lg:text-right"
                >
                  <div className="w-12 h-12 bg-[#111] border border-[#222] rounded-full flex items-center justify-center mb-4">
                    <Icon className="text-lime-400 w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{t(feature.titleKey)}</h3>
                  <p className="text-gray-400">{t(feature.descKey)}</p>
                </motion.div>
              );
            })}
          </div>

          {/* CENTER — circular product image */}
          <motion.div
            initial={{opacity: 0, scale: 0.9}}
            whileInView={{opacity: 1, scale: 1}}
            viewport={{once: true, margin: '-100px'}}
            transition={{duration: 0.7, delay: 0.2}}
            className="relative aspect-square rounded-full overflow-hidden bg-[#111] border border-[#222] mx-auto w-full max-w-[400px]"
            style={{boxShadow: '0 0 60px rgba(163, 230, 53, 0.1)'}}
          >
            <Image
              src="/images/ai-webp/studio-top.webp"
              alt="Profiline GM25 top view"
              fill
              sizes="(max-width: 1024px) 80vw, 33vw"
              className="object-cover"
            />
          </motion.div>

          {/* RIGHT specs — left-aligned */}
          <div className="space-y-12">
            {rightFeatures.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.titleKey}
                  initial={{opacity: 0, x: 30}}
                  whileInView={{opacity: 1, x: 0}}
                  viewport={{once: true, margin: '-100px'}}
                  transition={{duration: 0.5, delay: i * 0.15}}
                  className="flex flex-col items-start text-left"
                >
                  <div className="w-12 h-12 bg-[#111] border border-[#222] rounded-full flex items-center justify-center mb-4">
                    <Icon className="text-lime-400 w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{t(feature.titleKey)}</h3>
                  <p className="text-gray-400">{t(feature.descKey)}</p>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Stats bar */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center border-t border-[#1a1a1a] pt-12">
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
    </section>
  );
}
