'use client';

interface MicroSurfaceProps {
  from?: string;
  to?: string;
}

export default function MicroSurface({from = '#050505', to = '#0a0a0a'}: MicroSurfaceProps) {
  return (
    <div className="relative h-[100px] overflow-hidden" style={{background: `linear-gradient(180deg, ${from} 0%, ${to} 100%)`}}>
      {/* Vignette edges */}
      <div className="absolute inset-y-0 left-0 w-[20%] z-[2] pointer-events-none" style={{background: `linear-gradient(90deg, ${from}, transparent)`}} />
      <div className="absolute inset-y-0 right-0 w-[20%] z-[2] pointer-events-none" style={{background: `linear-gradient(-90deg, ${to} 30%, transparent)`}} />

      <svg viewBox="0 0 1440 100" preserveAspectRatio="none" className="absolute w-full h-full">
        <defs>
          <linearGradient id="mcFade" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="transparent"/>
            <stop offset="20%" stopColor="#1a1a1a"/>
            <stop offset="80%" stopColor="#1a1a1a"/>
            <stop offset="100%" stopColor="transparent"/>
          </linearGradient>
          <linearGradient id="mcLime" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="transparent"/>
            <stop offset="30%" stopColor="#A3E635" stopOpacity="0.12"/>
            <stop offset="50%" stopColor="#A3E635" stopOpacity="0.25"/>
            <stop offset="70%" stopColor="#A3E635" stopOpacity="0.12"/>
            <stop offset="100%" stopColor="transparent"/>
          </linearGradient>
        </defs>

        {/* Subtle companion line above */}
        <path fill="none" stroke="url(#mcFade)" strokeWidth="0.6" opacity="0.3"
          d="M0,40 Q360,35 720,42 Q1080,48 1440,40"/>

        {/* Main smooth line */}
        <path fill="none" stroke="url(#mcLime)" strokeWidth="1"
          d="M0,50 Q360,47 720,50 Q1080,53 1440,50"/>
        <path fill="none" stroke="url(#mcLime)" strokeWidth="3" opacity="0.3"
          d="M0,50 Q360,47 720,50 Q1080,53 1440,50" style={{filter: 'blur(4px)'}}/>

        {/* Subtle companion line below */}
        <path fill="none" stroke="url(#mcFade)" strokeWidth="0.6" opacity="0.25"
          d="M0,60 Q360,65 720,58 Q1080,52 1440,60"/>

        {/* Breathing pulse dot */}
        <circle cx="720" cy="50" r="1.5" fill="#A3E635" style={{animation: 'micro-pulse 5s ease-in-out infinite'}}/>
      </svg>
    </div>
  );
}
