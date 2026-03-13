'use client';

import React, { useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { Factory, BadgeCheck, ShieldCheck, Globe, Wrench } from 'lucide-react';

const trustItems = [
  { key: 'item1', Icon: Factory },
  { key: 'item2', Icon: BadgeCheck },
  { key: 'item3', Icon: ShieldCheck },
  { key: 'item4', Icon: Globe },
  { key: 'item5', Icon: Wrench },
] as const;

const cmsKeyMap: Record<string, string> = {
  item1: 'item1Title',
  item1Tooltip: 'item1Desc',
  item2: 'item2Title',
  item2Tooltip: 'item2Desc',
  item3: 'item3Title',
  item3Tooltip: 'item3Desc',
  item4: 'item4Title',
  item4Tooltip: 'item4Desc',
  item5: 'item5Title',
  item5Tooltip: 'item5Desc',
};

interface TrustBarProps {
  cms?: Record<string, unknown>;
}

export default function TrustBar({ cms }: TrustBarProps) {
  const t = useTranslations('trust');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const c = (key: string) => {
    const cmsField = cmsKeyMap[key];
    if (cms && cmsField && cms[cmsField] !== undefined) return String(cms[cmsField]);
    return t(key);
  };

  // Wave Damping Animation Logic
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animFrame: number;
    
    const resize = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (!rect) return;
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    
    resize();
    window.addEventListener('resize', resize);

    const draw = (time: number) => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      ctx.clearRect(0, 0, w, h);

      const centerY = h / 2;
      const numLines = 7;

      for (let l = 0; l < numLines; l++) {
        const normalizedL = l / (numLines - 1); // 0 to 1
        const distFromCenter = Math.abs(normalizedL - 0.5) * 2; // 0 at center, 1 at edges

        // Lines further from center have MORE amplitude (more vibration)
        const maxAmplitude = distFromCenter * 12 + 0.5;
        // Frequency also increases away from center
        const freq = 0.003 + distFromCenter * 0.004;
        // Speed varies per line
        const speed = 0.0004 + l * 0.00008;
        // Y offset: spread lines vertically
        const yOffset = (normalizedL - 0.5) * (h * 0.7);

        // Is this the center line? (the smooth one)
        const isCenter = l === Math.floor(numLines / 2);

        ctx.beginPath();
        for (let x = 0; x < w; x++) {
          // Damping envelope: fade amplitude at edges of screen
          const edgeFade = Math.sin((x / w) * Math.PI);
          const amplitude = maxAmplitude * edgeFade;

          const y = centerY + yOffset +
            Math.sin(x * freq + time * speed) * amplitude +
            Math.sin(x * freq * 1.7 + time * speed * 0.7) * amplitude * 0.3;

          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }

        if (isCenter) {
          // The smooth center line — lime glow
          ctx.strokeStyle = 'rgba(163, 230, 53, 0.4)';
          ctx.lineWidth = 1.5;
          ctx.stroke();

          // Glow pass
          ctx.beginPath();
          for (let x = 0; x < w; x++) {
            const edgeFade = Math.sin((x / w) * Math.PI);
            const amplitude = maxAmplitude * edgeFade;
            const y = centerY + yOffset +
              Math.sin(x * freq + time * speed) * amplitude +
              Math.sin(x * freq * 1.7 + time * speed * 0.7) * amplitude * 0.3;
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.strokeStyle = 'rgba(163, 230, 53, 0.08)';
          ctx.lineWidth = 10;
          ctx.stroke();
        } else {
          // Regular contour lines
          const opacity = 0.1 + (1 - distFromCenter) * 0.15;
          ctx.strokeStyle = `rgba(100, 100, 100, ${opacity})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }

      animFrame = requestAnimationFrame(draw);
    };
    
    animFrame = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animFrame);
    };
  }, []);

  return (
    <section className="relative py-20 bg-[#050505] overflow-hidden border-y border-[#111]">
      
      {/* Background Canvas Wave Divider */}
      <div className="absolute inset-0 pointer-events-none opacity-60">
        <canvas ref={canvasRef} className="absolute inset-0" />
        
        {/* Soft edge fades for canvas */}
        <div className="absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-[#050505] to-transparent" />
        <div className="absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-[#050505] to-transparent" />
      </div>

      <div className="mx-auto max-w-7xl px-6 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">
          {trustItems.map(({ key, Icon }, i) => (
            <div 
              key={key} 
              className={`flex flex-col items-center text-center group ${i === 4 ? 'sm:col-span-2 lg:col-span-1' : ''}`}
            >
              {/* Minimalist Icon */}
              <div className="mb-6 relative flex items-center justify-center">
                <Icon 
                  className="w-8 h-8 text-[#A3E635] opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500 ease-out" 
                  strokeWidth={1.2} 
                />
                <div className="absolute inset-0 bg-[#A3E635] blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 rounded-full scale-150" />
              </div>
              
              {/* Typography - Pure & Heavy */}
              <h3 className="text-white font-medium text-[13px] tracking-wide uppercase mb-3">
                {c(key)}
              </h3>
              
              <p className="text-[#666] text-xs leading-relaxed max-w-[200px]">
                {c(`${key}Tooltip`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
