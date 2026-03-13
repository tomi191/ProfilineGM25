'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { motion, useScroll, useTransform } from 'motion/react';
import { Crosshair, Cpu, Settings2, Activity } from 'lucide-react';

interface PerformanceProps {
  cms?: Record<string, unknown>;
}

export default function Performance({ cms }: PerformanceProps) {
  const t = useTranslations('performance');
  const c = (key: string) => {
    if (cms && cms[key] !== undefined) return String(cms[key]);
    return t(key);
  };

  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Parallax effects for the images
  const y1 = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const y2 = useTransform(scrollYProgress, [0, 1], [-50, 50]);

  return (
    <section ref={containerRef} className="relative bg-[#050505] py-32 overflow-hidden border-t border-[#111]">
      
      {/* Background Tech Grid */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_100%_100%_at_50%_50%,#000_10%,transparent_100%)]" />
      </div>

      <div className="mx-auto max-w-7xl px-6 space-y-40 relative z-10">
        
        {/* Block 1: Ergonomics & Balance */}
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          
          <motion.div
            style={{ y: y1 }}
            className="w-full lg:w-1/2 relative group"
          >
            {/* Tech Frame */}
            <div className="absolute -inset-4 border border-[#1a1a1a] rounded-2xl bg-[#0a0a0a]/50 backdrop-blur-sm -z-10 group-hover:border-lime-500/20 transition-colors duration-500" />
            
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-[#111]">
              <Image
                src="/images/ai-webp/in-action-polishing.webp"
                alt="Profiline GM25 in action — professional car polishing"
                fill
                className="object-cover opacity-70 group-hover:opacity-100 transition-all duration-700 group-hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              {/* HUD Elements */}
              <div className="absolute top-4 left-4 flex items-center gap-2">
                <Crosshair className="w-4 h-4 text-lime-400 animate-pulse" />
                <span className="text-[10px] text-lime-400 uppercase tracking-widest font-mono">Tracking: Active</span>
              </div>
              <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-[#0a0a0a] to-transparent pointer-events-none" />
            </div>
            
            {/* Decorative Corner Brackets */}
            <div className="absolute -top-4 -left-4 w-8 h-8 border-t-2 border-l-2 border-lime-500/50 rounded-tl-xl transition-all duration-500 group-hover:border-lime-400" />
            <div className="absolute -bottom-4 -right-4 w-8 h-8 border-b-2 border-r-2 border-lime-500/50 rounded-br-xl transition-all duration-500 group-hover:border-lime-400" />
          </motion.div>

          <div className="w-full lg:w-1/2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#111] border border-[#222] mb-6">
              <Activity className="w-3.5 h-3.5 text-lime-400" />
              <span className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Ергономика</span>
            </div>
            <h3 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-6 tracking-tight text-white">
              {c('title1')}
            </h3>
            <p className="text-[#888] text-lg mb-8 leading-relaxed">
              {c('desc1')}
            </p>
            <ul className="space-y-4">
              {(['list1', 'list2', 'list3'] as const).map((key) => (
                <motion.li 
                  key={key} 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="flex items-start gap-4 text-gray-300"
                >
                  <div className="w-6 h-6 rounded-md bg-[#111] border border-[#222] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-1.5 h-1.5 bg-lime-400 rounded-sm" />
                  </div>
                  <span className="font-medium">{c(key)}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>

        {/* Block 2: Engineering & Internals (The "Exploded" View Concept) */}
        <div className="flex flex-col lg:flex-row-reverse gap-16 items-center">
          
          <motion.div
            style={{ y: y2 }}
            className="w-full lg:w-1/2 relative group"
          >
            {/* Tech Frame */}
            <div className="absolute -inset-4 border border-[#1a1a1a] rounded-2xl bg-[#0a0a0a]/50 backdrop-blur-sm -z-10 group-hover:border-lime-500/20 transition-colors duration-500" />
            
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-[#050505] border border-[#111]">
              <Image
                src="/images/ai-webp/motor-internals.webp"
                alt="Profiline GM25 motor internals — precision copper windings"
                fill
                className="object-cover opacity-60 mix-blend-lighten group-hover:opacity-100 transition-all duration-700 group-hover:scale-110"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              
              {/* Engineering Blueprint Overlays */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#050505_100%)] pointer-events-none" />
              
              {/* Technical Pointers */}
              <div className="absolute top-1/4 left-1/4 group-hover:translate-y-[-10px] transition-transform duration-500">
                <div className="w-3 h-3 border border-lime-400 rounded-full flex items-center justify-center">
                  <div className="w-1 h-1 bg-lime-400 rounded-full" />
                </div>
                <div className="absolute top-1.5 left-3 w-16 h-[1px] bg-lime-400/50" />
                <span className="absolute top-0 left-20 text-[9px] text-lime-400 uppercase tracking-widest font-mono whitespace-nowrap bg-black/50 px-1">Медни намотки</span>
              </div>

              <div className="absolute bottom-1/3 right-1/4 group-hover:translate-y-[10px] transition-transform duration-500">
                <div className="w-3 h-3 border border-lime-400 rounded-full flex items-center justify-center">
                  <div className="w-1 h-1 bg-lime-400 rounded-full" />
                </div>
                <div className="absolute top-1.5 right-3 w-16 h-[1px] bg-lime-400/50" />
                <span className="absolute top-0 right-20 text-[9px] text-lime-400 uppercase tracking-widest font-mono whitespace-nowrap bg-black/50 px-1">CNC Фрезоване</span>
              </div>

              <div className="absolute top-4 right-4 flex items-center gap-2 border border-[#222] bg-[#0a0a0a]/80 px-2 py-1 rounded backdrop-blur-md">
                <Cpu className="w-3.5 h-3.5 text-gray-400" />
                <span className="text-[10px] text-gray-400 font-mono">SYS.1200W</span>
              </div>
            </div>
            
            <div className="absolute -top-4 -right-4 w-8 h-8 border-t-2 border-r-2 border-lime-500/50 rounded-tr-xl transition-all duration-500 group-hover:border-lime-400" />
            <div className="absolute -bottom-4 -left-4 w-8 h-8 border-b-2 border-l-2 border-lime-500/50 rounded-bl-xl transition-all duration-500 group-hover:border-lime-400" />
          </motion.div>

          <div className="w-full lg:w-1/2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#111] border border-[#222] mb-6">
              <Settings2 className="w-3.5 h-3.5 text-lime-400" />
              <span className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Инженеринг</span>
            </div>
            <h3 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-6 tracking-tight text-white">
              {c('title2')}
            </h3>
            <p className="text-[#888] text-lg leading-relaxed mb-8">
              {c('desc2')}
            </p>
            
            {/* Tech Stats Grid underneath text */}
            <div className="grid grid-cols-2 gap-4 mt-8">
              <div className="bg-[#0a0a0a] border border-[#1a1a1a] p-4 rounded-xl">
                <div className="text-2xl font-bold text-white mb-1">25<span className="text-lime-400 text-lg">mm</span></div>
                <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Орбитален Ход</div>
              </div>
              <div className="bg-[#0a0a0a] border border-[#1a1a1a] p-4 rounded-xl">
                <div className="text-2xl font-bold text-white mb-1">1200<span className="text-lime-400 text-lg">W</span></div>
                <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Пикова Мощност</div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
