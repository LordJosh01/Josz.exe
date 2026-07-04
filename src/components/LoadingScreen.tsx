import { useState, useEffect, useMemo, useRef } from 'react';

export default function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle mouse movement for interactive rings
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      setMousePos({
        x: ((e.clientX - rect.left) / rect.width) * 100,
        y: ((e.clientY - rect.top) / rect.height) * 100,
      });
    };

    container.addEventListener('mousemove', handleMouseMove);
    return () => container.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Pre-generate minimal elements for performance
  const elements = useMemo(() => ({
    dots: Array.from({ length: 20 }).map((_, i) => ({
      size: 2 + (i % 3),
      color: i % 2 === 0 ? '#d4a017' : '#a855f7',
      left: 5 + (i * 4.5),
      top: 15 + (i % 4) * 25,
      delay: i * 0.08,
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
      ref={containerRef}
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center transition-opacity duration-500 cursor-pointer ${
        fadeOut ? 'opacity-0' : 'opacity-100'
      }`}
      style={{
        background: 'radial-gradient(ellipse at center, #1a0a30 0%, #0a0118 80%)',
      }}
    >
      {/* Interactive gold rings around center */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {/* Outer ring - follows mouse slightly */}
        <div
          className="absolute rounded-full border-2 border-gold-500/20 animate-spin"
          style={{
            width: 320,
            height: 320,
            animationDuration: '20s',
            transform: `translate(${(mousePos.x - 50) * 0.1}px, ${(mousePos.y - 50) * 0.1}px)`,
          }}
        />
        {/* Second ring - opposite direction */}
        <div
          className="absolute rounded-full border border-gold-400/30"
          style={{
            width: 260,
            height: 260,
            animation: 'spin 15s linear infinite reverse',
            transform: `translate(${(mousePos.x - 50) * -0.08}px, ${(mousePos.y - 50) * -0.08}px)`,
          }}
        />
        {/* Third ring */}
        <div
          className="absolute rounded-full border border-gold-500/25 animate-spin"
          style={{
            width: 200,
            height: 200,
            animationDuration: '12s',
            transform: `translate(${(mousePos.x - 50) * 0.06}px, ${(mousePos.y - 50) * 0.06}px)`,
          }}
        />
        {/* Fourth ring - inner */}
        <div
          className="absolute rounded-full border-2 border-gold-400/40"
          style={{
            width: 140,
            height: 140,
            animation: 'spin 8s linear infinite reverse',
            transform: `translate(${(mousePos.x - 50) * -0.04}px, ${(mousePos.y - 50) * -0.04}px)`,
          }}
        />

        {/* Animated particles on rings */}
        {[0, 90, 180, 270].map((deg, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-gold-400"
            style={{
              width: 6,
              height: 6,
              animation: `orbit-${i % 2 === 0 ? 'cw' : 'ccw'} ${8 + i * 2}s linear infinite`,
              ['--start-deg' as string]: `${deg}deg`,
            }}
          />
        ))}
      </div>

      {/* Floating dots */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {elements.dots.map((dot, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-pulse"
            style={{
              width: dot.size,
              height: dot.size,
              background: dot.color,
              left: `${dot.left}%`,
              top: `${dot.top}%`,
              animationDelay: `${dot.delay}s`,
              animationDuration: '2s',
            }}
          />
        ))}
      </div>

      {/* Center content */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Logo with rings */}
        <div className="relative mb-6">
          {/* Rings around logo */}
          <div className="absolute inset-0 scale-[2.5]">
            <div className="absolute inset-0 rounded-full border border-gold-500/20" />
            <div className="absolute inset-2 rounded-full border border-gold-400/15" />
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

        @keyframes orbit-cw {
          from { transform: rotate(var(--start-deg)) translateX(160px) rotate(calc(-1 * var(--start-deg))); }
          to { transform: rotate(calc(var(--start-deg) + 360deg)) translateX(160px) rotate(calc(-1 * (var(--start-deg) + 360deg))); }
        }
        @keyframes orbit-ccw {
          from { transform: rotate(var(--start-deg)) translateX(130px) rotate(calc(-1 * var(--start-deg))); }
          to { transform: rotate(calc(var(--start-deg) - 360deg)) translateX(130px) rotate(calc(-1 * (var(--start-deg) - 360deg))); }
        }
      `}</style>
    </div>
  );
}
