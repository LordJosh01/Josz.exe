import { useState, useEffect, useMemo } from 'react';

export default function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);

  // Pre-generate animated background elements
  const elements = useMemo(() => ({
    dots: Array.from({ length: 30 }).map((_, i) => ({
      size: 2 + (i % 4),
      color: i % 2 === 0 ? '#d4a017' : '#a855f7',
      left: 3 + (i * 3.3) % 94,
      top: 5 + (i % 6) * 16,
      delay: i * 0.1,
      duration: 3 + (i % 4),
    })),
    orbs: Array.from({ length: 4 }).map((_, i) => ({
      size: 200 + i * 80,
      left: 15 + i * 22,
      top: 20 + (i % 2) * 40,
      delay: i * 2,
      color: i % 2 === 0 ? 'rgba(147,51,234,0.12)' : 'rgba(212,160,23,0.10)',
    })),
  }), []);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            setFadeOut(true);
            setTimeout(onComplete, 500);
          }, 300);
          return 100;
        }
        return prev + 1.5;
      });
    }, 25);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center transition-opacity duration-500 cursor-pointer ${
        fadeOut ? 'opacity-0' : 'opacity-100'
      }`}
      style={{
        background: 'radial-gradient(ellipse at center, #1a0a30 0%, #0a0118 80%)',
      }}
    >
      {/* Drifting gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {elements.orbs.map((orb, i) => (
          <div
            key={`orb-${i}`}
            className="absolute rounded-full blur-[80px] animate-load-drift"
            style={{
              width: orb.size,
              height: orb.size,
              left: `${orb.left}%`,
              top: `${orb.top}%`,
              background: orb.color,
              animationDelay: `${orb.delay}s`,
            }}
          />
        ))}
      </div>

      {/* Floating dots */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {elements.dots.map((dot, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-load-float"
            style={{
              width: dot.size,
              height: dot.size,
              background: dot.color,
              left: `${dot.left}%`,
              top: `${dot.top}%`,
              animationDelay: `${dot.delay}s`,
              animationDuration: `${dot.duration}s`,
            }}
          />
        ))}
      </div>

      {/* Center content */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Logo with radiating light beams */}
        <div className="relative mb-6 flex items-center justify-center">
          {/* Outer pulsing aura glow — large, bright */}
          <div
            className="absolute rounded-full blur-2xl animate-aura-pulse"
            style={{
              width: 220,
              height: 220,
              background: 'radial-gradient(circle, rgba(212,160,23,0.55) 0%, rgba(212,160,23,0.25) 35%, rgba(147,51,234,0.18) 60%, transparent 75%)',
            }}
          />

          {/* Mid-layer gold ring glow */}
          <div
            className="absolute rounded-full blur-xl animate-aura-pulse"
            style={{
              width: 160,
              height: 160,
              background: 'radial-gradient(circle, rgba(242,204,90,0.45) 0%, rgba(212,160,23,0.2) 50%, transparent 70%)',
              animationDelay: '0.3s',
            }}
          />

          {/* Radiating light beams — brighter and more of them */}
          <div className="absolute animate-beam-rotate" style={{ width: 200, height: 200 }}>
            {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg, i) => (
              <div
                key={i}
                className="absolute left-1/2 top-1/2 origin-left animate-beam-pulse"
                style={{
                  width: 90,
                  height: 2,
                  background: `linear-gradient(90deg, rgba(242,204,90,0.8), rgba(212,160,23,0.3), transparent)`,
                  transform: `rotate(${deg}deg) translateY(-1px)`,
                  animationDelay: `${i * 0.08}s`,
                }}
              />
            ))}
          </div>

          {/* Soft inner glow */}
          <div className="absolute rounded-full blur-md animate-aura-pulse" style={{ width: 120, height: 120, background: 'rgba(242,204,90,0.25)', animationDelay: '0.5s' }} />

          {/* Logo */}
          <img
            src="/EVENT_BY_BELSH.jpg"
            alt="Events By BELSH"
            className="relative h-20 w-20 object-cover rounded-full ring-2 ring-gold-400/70 shadow-[0_0_25px_rgba(212,160,23,0.5)] animate-logo-breathe z-10"
          />
        </div>

        {/* Brand */}
        <h1 className="font-serif text-2xl text-gold-400 tracking-[0.2em] mb-1 drop-shadow-lg">BELSH EVENTS</h1>
        <p className="text-purple-400/70 text-[10px] tracking-[0.35em] uppercase mb-10">Planning &amp; Design</p>

        {/* Professional progress bar */}
        <div className="relative w-56">
          {/* Background track */}
          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden backdrop-blur-sm border border-white/5">
            {/* Progress fill */}
            <div
              className="h-full rounded-full relative overflow-hidden transition-all duration-100"
              style={{
                width: `${progress}%`,
                background: 'linear-gradient(90deg, #b8860b, #d4a017, #f2cc5a, #d4a017)',
              }}
            >
              {/* Shimmer effect */}
              <div
                className="absolute inset-0 animate-shimmer"
                style={{
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                }}
              />
            </div>
          </div>

          {/* Percentage */}
          <div className="flex justify-between mt-2">
            <span className="text-purple-500/50 text-[9px] uppercase tracking-wider">Loading</span>
            <span className="text-gold-400/80 text-[10px] font-medium tabular-nums">{Math.round(progress)}%</span>
          </div>
        </div>

        {/* Status text */}
        <p className="text-purple-500/50 text-[9px] mt-4 tracking-[0.15em] uppercase">
          {progress < 25 ? 'Initializing...' : progress < 50 ? 'Loading assets...' : progress < 75 ? 'Preparing...' : progress < 100 ? 'Almost ready...' : 'Welcome!'}
        </p>
      </div>

      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        .animate-shimmer { animation: shimmer 1.5s ease-in-out infinite; }

        @keyframes load-float {
          0%, 100% { transform: translateY(0) scale(1); opacity: 0.3; }
          50% { transform: translateY(-25px) scale(1.3); opacity: 0.7; }
        }
        .animate-load-float { animation: load-float 4s ease-in-out infinite; }

        @keyframes load-drift {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(40px, -30px) scale(1.2); }
        }
        .animate-load-drift { animation: load-drift 12s ease-in-out infinite; }

        @keyframes spin-slow-load {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow-load { animation: spin-slow-load 25s linear infinite; }

        @keyframes spin-slow-load-reverse {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }
        .animate-spin-slow-load-reverse { animation: spin-slow-load-reverse 20s linear infinite; }

        @keyframes aura-pulse {
          0%, 100% { transform: scale(1); opacity: 0.4; }
          50% { transform: scale(1.25); opacity: 0.7; }
        }
        .animate-aura-pulse { animation: aura-pulse 3s ease-in-out infinite; }

        @keyframes beam-rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-beam-rotate { animation: beam-rotate 20s linear infinite; }

        @keyframes beam-pulse {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.8; }
        }
        .animate-beam-pulse { animation: beam-pulse 2s ease-in-out infinite; }

        @keyframes logo-breathe {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.06); }
        }
        .animate-logo-breathe { animation: logo-breathe 3.5s ease-in-out infinite; }
      `}</style>
    </div>
  );
}
