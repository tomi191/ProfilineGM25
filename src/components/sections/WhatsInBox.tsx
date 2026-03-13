'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { motion, useInView } from 'motion/react';
import { Settings, Disc3, BookOpen, ShieldAlert, PackageOpen, ScanLine } from 'lucide-react';

interface WhatsInBoxProps {
  cms?: Record<string, unknown>;
}

export default function WhatsInBox({ cms }: WhatsInBoxProps) {
  const t = useTranslations('box');
  const c = (key: string) => {
    if (cms && cms[key] !== undefined) return String(cms[key]);
    return t(key);
  };

  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  const items = [
    { key: 'item1', icon: Settings, sku: 'PR-GM25-CORE', qty: 1 },
    { key: 'item2', icon: Disc3, sku: 'PAD-125-M8', qty: 1 },
    { key: 'item3', icon: Disc3, sku: 'PAD-150-M8', qty: 1 },
    { key: 'item4', icon: BookOpen, sku: 'DOC-MANUAL-EU', qty: 1 },
    { key: 'item5', icon: ShieldAlert, sku: 'DOC-WARRANTY-2Y', qty: 1 },
  ];

  return (
    <section className="bg-[#0a0a0a] py-32 relative overflow-hidden border-t border-[#111]">
      
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-1/2 h-[500px] bg-[radial-gradient(ellipse_at_top_right,rgba(163,230,53,0.05)_0%,transparent_60%)] pointer-events-none" />

      <div className="mx-auto max-w-7xl px-6 relative z-10" ref={containerRef}>
        
        {/* Header */}
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-end justify-between mb-16 border-b border-[#222] pb-6">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#111] border border-[#222] mb-4"
            >
              <PackageOpen className="w-3.5 h-3.5 text-lime-400" />
              <span className="text-[10px] text-gray-400 uppercase tracking-widest font-mono">Inventory Loadout</span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-white"
            >
              {c('title')}
            </motion.h2>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-3 text-xs text-gray-500 font-mono uppercase bg-[#111] px-4 py-2 rounded-lg border border-[#222]"
          >
            <ScanLine className="w-4 h-4 text-lime-400 animate-pulse" />
            <span>{c('standardKit')}</span>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          
          {/* LEFT: The "Scan" Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.7 }}
            className="lg:col-span-7 relative"
          >
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-[#050505] border border-[#1a1a1a] shadow-[0_0_50px_rgba(0,0,0,0.5)] group">
              
              <Image
                src="/images/ai-webp/flat-lay.webp"
                alt="Profiline GM25 complete kit contents"
                fill
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover opacity-80 mix-blend-luminosity group-hover:mix-blend-normal transition-all duration-1000 group-hover:scale-105"
              />

              {/* Scanning HUD Overlay */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(163,230,53,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(163,230,53,0.05)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
              
              {/* Animated Scanner Line */}
              <div className="absolute top-0 left-0 w-full h-[2px] bg-lime-400 shadow-[0_0_15px_rgba(163,230,53,0.8)] animate-[scan_3s_ease-in-out_infinite]" />

              <div className="absolute bottom-4 right-4 bg-black/80 backdrop-blur-md border border-[#333] px-3 py-1.5 rounded-lg flex flex-col items-end">
                <span className="text-[9px] text-gray-500 font-mono uppercase tracking-widest">Weight</span>
                <span className="text-xs text-lime-400 font-mono font-bold">2.60 KG</span>
              </div>
            </div>

            {/* Corner Tech Brackets */}
            <div className="absolute -top-3 -left-3 w-6 h-6 border-t-2 border-l-2 border-[#333]" />
            <div className="absolute -bottom-3 -right-3 w-6 h-6 border-b-2 border-r-2 border-[#333]" />
          </motion.div>

          {/* RIGHT: Inventory List */}
          <div className="lg:col-span-5 flex flex-col gap-3">
            <div className="grid grid-cols-12 gap-4 px-4 pb-2 text-[10px] text-gray-600 font-mono uppercase tracking-widest border-b border-[#222]">
              <div className="col-span-8">{c('articleHeader')}</div>
              <div className="col-span-2 text-center">{c('qtyHeader')}</div>
              <div className="col-span-2 text-right">{c('statusHeader')}</div>
            </div>

            {items.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.key}
                  initial={{ opacity: 0, x: 30 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="group grid grid-cols-12 gap-4 items-center px-4 py-4 bg-[#050505] border border-[#1a1a1a] rounded-xl hover:border-lime-500/30 hover:bg-[#111] transition-all duration-300"
                >
                  <div className="col-span-8 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-[#111] border border-[#222] group-hover:border-lime-500/50 flex items-center justify-center flex-shrink-0 transition-colors">
                      <Icon className="w-4 h-4 text-lime-400" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-white group-hover:text-lime-50 transition-colors">
                        {c(item.key)}
                      </span>
                      <span className="text-[10px] text-gray-500 font-mono mt-0.5">
                        SKU: {item.sku}
                      </span>
                    </div>
                  </div>
                  
                  <div className="col-span-2 text-center text-sm font-mono text-gray-300">
                    {item.qty}
                  </div>
                  
                  <div className="col-span-2 text-right">
                    <div className="w-2 h-2 rounded-full bg-lime-500 ml-auto shadow-[0_0_8px_rgba(163,230,53,0.6)]" />
                  </div>
                </motion.div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}
