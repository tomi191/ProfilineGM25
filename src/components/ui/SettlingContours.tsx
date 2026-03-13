'use client';

interface SettlingContoursProps {
  from?: string;
  to?: string;
}

export default function SettlingContours({from = '#050505', to = '#0a0a0a'}: SettlingContoursProps) {
  return (
    <div className="relative h-[160px] overflow-hidden" style={{background: `linear-gradient(180deg, ${from} 0%, ${from} 20%, ${to} 80%, ${to} 100%)`}}>
      {/* Vignette edges */}
      <div className="absolute inset-y-0 left-0 w-[15%] z-[2] pointer-events-none" style={{background: `linear-gradient(90deg, ${from}, transparent)`}} />
      <div className="absolute inset-y-0 right-0 w-[15%] z-[2] pointer-events-none" style={{background: `linear-gradient(-90deg, ${to}, transparent)`}} />

      <svg viewBox="0 0 1440 160" preserveAspectRatio="none" className="absolute w-full h-full">
        <defs>
          <linearGradient id="stlFade" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="transparent"/>
            <stop offset="15%" stopColor="#1a1a1a"/>
            <stop offset="85%" stopColor="#1a1a1a"/>
            <stop offset="100%" stopColor="transparent"/>
          </linearGradient>
          <linearGradient id="stlLime" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="transparent"/>
            <stop offset="20%" stopColor="#A3E635" stopOpacity="0.05"/>
            <stop offset="40%" stopColor="#A3E635" stopOpacity="0.2"/>
            <stop offset="50%" stopColor="#A3E635" stopOpacity="0.3"/>
            <stop offset="60%" stopColor="#A3E635" stopOpacity="0.2"/>
            <stop offset="80%" stopColor="#A3E635" stopOpacity="0.05"/>
            <stop offset="100%" stopColor="transparent"/>
          </linearGradient>
        </defs>
        <g style={{animation: 'settle-breathe 8s ease-in-out infinite'}}>
          {/* Layer 1: Most vibration — rough surface */}
          <path fill="none" stroke="url(#stlFade)" strokeWidth="0.4" opacity="0.2"
            d="M0,25 Q60,18 120,28 Q180,38 240,22 Q300,12 360,30 Q420,42 480,24 Q540,14 600,32 Q660,40 720,26 Q780,16 840,34 Q900,42 960,22 Q1020,10 1080,30 Q1140,44 1200,24 Q1260,14 1320,32 Q1380,38 1440,25"/>
          {/* Layer 2: Slightly calmer */}
          <path fill="none" stroke="url(#stlFade)" strokeWidth="0.4" opacity="0.25"
            d="M0,42 Q90,35 180,45 Q270,52 360,40 Q450,33 540,46 Q630,53 720,42 Q810,34 900,47 Q990,53 1080,40 Q1170,33 1260,46 Q1350,50 1440,42"/>
          {/* Layer 3: Settling */}
          <path fill="none" stroke="url(#stlFade)" strokeWidth="0.5" opacity="0.3"
            d="M0,58 Q120,52 240,60 Q360,66 480,56 Q600,50 720,59 Q840,66 960,56 Q1080,50 1200,60 Q1320,64 1440,58"/>
          {/* Layer 4: Almost smooth */}
          <path fill="none" stroke="url(#stlFade)" strokeWidth="0.5" opacity="0.35"
            d="M0,74 Q180,70 360,76 Q540,80 720,74 Q900,69 1080,76 Q1260,79 1440,74"/>

          {/* Layer 5: THE SMOOTH LINE — the result */}
          <path fill="none" stroke="url(#stlLime)" strokeWidth="1.2" opacity="0.9"
            d="M0,90 Q360,86 720,90 Q1080,94 1440,90"/>
          <path fill="none" stroke="url(#stlLime)" strokeWidth="8" opacity="0.15"
            d="M0,90 Q360,86 720,90 Q1080,94 1440,90" style={{filter: 'blur(3px)'}}/>

          {/* Mirror settling below — symmetry */}
          <path fill="none" stroke="url(#stlFade)" strokeWidth="0.5" opacity="0.3"
            d="M0,106 Q180,110 360,104 Q540,100 720,106 Q900,111 1080,104 Q1260,101 1440,106"/>
          <path fill="none" stroke="url(#stlFade)" strokeWidth="0.4" opacity="0.2"
            d="M0,120 Q120,126 240,118 Q360,112 480,122 Q600,128 720,118 Q840,112 960,122 Q1080,128 1200,118 Q1320,114 1440,120"/>
          <path fill="none" stroke="url(#stlFade)" strokeWidth="0.4" opacity="0.15"
            d="M0,135 Q90,142 180,132 Q270,124 360,136 Q450,144 540,130 Q630,122 720,136 Q810,144 900,130 Q990,122 1080,136 Q1170,144 1260,130 Q1350,126 1440,135"/>

          {/* Drifting particles along the smooth line */}
          <circle cx="500" cy="90" r="1.5" fill="#A3E635" opacity="0" style={{animation: 'particle-drift 6s ease-in-out infinite'}}/>
          <circle cx="800" cy="89" r="1" fill="#A3E635" opacity="0" style={{animation: 'particle-drift 6s ease-in-out infinite 2s'}}/>
          <circle cx="1100" cy="91" r="1.5" fill="#A3E635" opacity="0" style={{animation: 'particle-drift 6s ease-in-out infinite 4s'}}/>
        </g>
      </svg>
    </div>
  );
}
