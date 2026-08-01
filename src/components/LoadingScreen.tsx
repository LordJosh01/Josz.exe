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
        {/* Logo with decorative rings */}
        <div className="relative mb-6">
          {/* Rings around logo */}
          <div className="absolute inset-0 scale-[2.5]">
            <div className="absolute inset-0 rounded-full border border-gold-500/20 animate-spin-slow-load" />
            <div className="absolute inset-2 rounded-full border border-gold-400/15 animate-spin-slow-load-reverse" />
            <div className="absolute inset-4 rounded-full border border-gold-500/10" />
          </div>

          {/* Glow effect */}
          <div className="absolute inset-0 scale-150">
            <div className="w-full h-full bg-gold-500/20 rounded-full blur-xl animate-pulse" />
          </div>

          {/* Logo */}
          <img
            src="/EVENT_BY_BELSH.jpg"
            alt="Events By BELSH"
            className="relative h-20 w-20 object-cover rounded-full ring-2 ring-gold-500/50 shadow-lg shadow-gold-500/20"
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
      `}</style>
    </div>
  );
}
