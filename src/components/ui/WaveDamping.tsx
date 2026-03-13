'use client';

import {useEffect, useRef, useCallback} from 'react';

interface WaveDampingProps {
  from?: string;
  to?: string;
}

export default function WaveDamping({from = '#050505', to = '#0a0a0a'}: WaveDampingProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  const draw = useCallback((time: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    const dpr = window.devicePixelRatio || 1;

    if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    ctx.clearRect(0, 0, w, h);
    const centerY = h / 2;
    const numLines = 7;

    for (let l = 0; l < numLines; l++) {
      const normalizedL = l / (numLines - 1);
      const distFromCenter = Math.abs(normalizedL - 0.5) * 2;

      const maxAmplitude = distFromCenter * 12 + 0.5;
      const freq = 0.003 + distFromCenter * 0.004;
      const speed = 0.0004 + l * 0.00008;
      const yOffset = (normalizedL - 0.5) * (h * 0.7);
      const isCenter = l === Math.floor(numLines / 2);

      const calcY = (x: number) => {
        const edgeFade = Math.sin((x / w) * Math.PI);
        const amplitude = maxAmplitude * edgeFade;
        return centerY + yOffset +
          Math.sin(x * freq + time * speed) * amplitude +
          Math.sin(x * freq * 1.7 + time * speed * 0.7) * amplitude * 0.3;
      };

      ctx.beginPath();
      for (let x = 0; x < w; x++) {
        const y = calcY(x);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }

      if (isCenter) {
        ctx.strokeStyle = 'rgba(163, 230, 53, 0.3)';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Glow pass
        ctx.beginPath();
        for (let x = 0; x < w; x++) {
          const y = calcY(x);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = 'rgba(163, 230, 53, 0.08)';
        ctx.lineWidth = 10;
        ctx.stroke();
      } else {
        const opacity = 0.12 + (1 - distFromCenter) * 0.15;
        ctx.strokeStyle = `rgba(80, 80, 80, ${opacity})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }

    animRef.current = requestAnimationFrame(draw);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        animRef.current = requestAnimationFrame(draw);
      } else {
        cancelAnimationFrame(animRef.current);
      }
    }, {threshold: 0.1});

    observer.observe(canvas);
    animRef.current = requestAnimationFrame(draw);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(animRef.current);
    };
  }, [draw]);

  return (
    <div className="relative h-[120px] overflow-hidden" style={{background: `linear-gradient(180deg, ${from} 0%, ${to} 100%)`}}>
      {/* Vignette edges */}
      <div className="absolute inset-y-0 left-0 w-[12%] z-[2] pointer-events-none" style={{background: `linear-gradient(90deg, ${from}, transparent)`}} />
      <div className="absolute inset-y-0 right-0 w-[12%] z-[2] pointer-events-none" style={{background: `linear-gradient(-90deg, ${to}, transparent)`}} />
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
}
