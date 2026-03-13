'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { motion } from 'motion/react';
import { Zap, Activity, Wind, Settings, ShieldCheck, Cog } from 'lucide-react';

/* Map CMS field names to translation keys where they differ */
const cmsKeyMap: Record<string, string> = {
  desc: 'subtitle',
};

interface TechSpecsProps {
  cms?: Record<string, unknown>;
}

// 3D Parallax Card Component for Specs
function SpecCard({ 
  icon: Icon, 
  title, 
  desc, 
  index 
}: { 
  icon: React.ElementType; 
  title: string; 
  desc: string; 
  index: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;
    cardRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    cardRef.current.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg)`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="group relative bg-[#0a0a0a] border border-[#1a1a1a] p-6 rounded-2xl transition-transform duration-200 ease-out will-change-transform"
      style={{ transformStyle: 'preserve-3d' }}
    >
      {/* Background Hover Glow */}
      <div className="absolute inset-0 bg-lime-500/0 group-hover:bg-lime-500/5 transition-colors duration-500 rounded-2xl pointer-events-none" />
      <div className="absolute inset-0 border border-lime-500/0 group-hover:border-lime-500/30 transition-colors duration-500 rounded-2xl pointer-events-none" />

      {/* Content wrapper for 3D pop effect */}
      <div className="relative z-10 pointer-events-none" style={{ transformStyle: 'preserve-3d' }}>
        <div 
          style={{ transform: 'translateZ(30px)' }}
          className="w-12 h-12 bg-[#111] border border-[#222] group-hover:border-lime-500/50 rounded-xl flex items-center justify-center mb-5 transition-all duration-300 shadow-[0_0_15px_rgba(0,0,0,0.5)] group-hover:shadow-[0_0_20px_rgba(163,230,53,0.15)]"
        >
          <Icon className="text-lime-400 w-5 h-5 group-hover:scale-110 transition-transform duration-300" strokeWidth={1.5} />
        </div>
        
        <h3 
          style={{ transform: 'translateZ(20px)' }}
          className="text-lg font-bold text-white mb-2 tracking-wide"
        >
          {title}
        </h3>
        
        <p 
          style={{ transform: 'translateZ(10px)' }}
          className="text-gray-400 text-sm leading-relaxed"
        >
          {desc}
        </p>
      </div>
    </motion.div>
  );
}

export default function TechSpecs({ cms }: TechSpecsProps) {
  const t = useTranslations('specs');
  const c = (key: string) => {
    const cmsField = cmsKeyMap[key] ?? key;
    if (cms && cms[cmsField] !== undefined) return String(cms[cmsField]);
    return t(key);
  };

  const specsList = [
    { icon: Zap, titleKey: 'spec1Title', descKey: 'spec1Desc' },
    { icon: Activity, titleKey: 'spec2Title', descKey: 'spec2Desc' },
    { icon: Wind, titleKey: 'spec3Title', descKey: 'spec3Desc' },
    { icon: Settings, titleKey: 'spec4Title', descKey: 'spec4Desc' },
  ];

  const stats = [
    { valueKey: 'powerValue', labelKey: 'power' },
    { valueKey: 'weightValue', labelKey: 'weight' },
    { valueKey: 'orbitValue', labelKey: 'orbit' },
    { valueKey: 'platesValue', labelKey: 'plates' },
  ] as const;

  return (
    <section id="specs" className="py-28 bg-[#050505] relative overflow-hidden">
      
      {/* Background Ambience */}      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-lime-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="mx-auto max-w-7xl px-6 relative z-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#111] border border-[#222] mb-4"
            >
              <Cog className="w-3.5 h-3.5 text-lime-400" />
              <span className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Спецификации</span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-4"
            >
              {c('title')}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-gray-400 text-lg"
            >
              {c('desc')}
            </motion.p>
          </div>
          
          {/* Main Key Stats (Desktop Right Aligned) */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="flex gap-8"
          >
            <div className="text-right">
              <div className="text-3xl font-extrabold text-white">25<span className="text-lime-400 text-lg">mm</span></div>
              <div className="text-xs text-gray-500 uppercase tracking-widest font-semibold">Орбита</div>
            </div>
            <div className="w-[1px] h-12 bg-[#222]" />
            <div className="text-right">
              <div className="text-3xl font-extrabold text-white">1200<span className="text-lime-400 text-lg">W</span></div>
              <div className="text-xs text-gray-500 uppercase tracking-widest font-semibold">Мотор</div>
            </div>
          </motion.div>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid lg:grid-cols-12 gap-6">
          
          {/* Main Product Hero Shot (Bento Span 8) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-8 relative aspect-[16/10] lg:aspect-auto bg-[#0a0a0a] border border-[#1a1a1a] rounded-[32px] overflow-hidden group"
          >
            {/* Soft inner glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-[#111] to-transparent z-0" />
            
            <Image
              src="/images/ai-webp/studio-top.webp"
              alt="Profiline GM25 top view"
              fill
              className="object-contain p-8 md:p-16 relative z-10 transition-transform duration-700 group-hover:scale-105 mix-blend-screen"
              sizes="(max-width: 1024px) 100vw, 66vw"
            />

            {/* Technical Overlay Badges */}
            <div className="absolute top-6 left-6 z-20 flex items-center gap-2 bg-[#050505]/80 backdrop-blur-md border border-[#222] px-3 py-1.5 rounded-lg">
              <ShieldCheck className="w-4 h-4 text-lime-400" />
              <span className="text-xs text-white font-mono">CE Сертифициран</span>
            </div>
          </motion.div>

          {/* Specs Cards Column (Bento Span 4) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            {specsList.map((spec, i) => (
              <SpecCard 
                key={spec.titleKey}
                index={i}
                icon={spec.icon}
                title={t(spec.titleKey)}
                desc={t(spec.descKey)}
              />
            ))}
          </div>

        </div>

        {/* Bottom Full-Width Stats Bar */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.valueKey}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="bg-[#0a0a0a] border border-[#1a1a1a] p-6 rounded-2xl flex flex-col items-center justify-center text-center group hover:border-[#333] transition-colors"
            >
              <div className="text-2xl md:text-3xl font-extrabold text-white mb-1 group-hover:text-lime-400 transition-colors">
                {t(stat.valueKey)}
              </div>
              <div className="text-[11px] text-gray-500 uppercase tracking-widest font-semibold">
                {t(stat.labelKey)}
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
