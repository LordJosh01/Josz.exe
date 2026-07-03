import { useState, useEffect, useMemo } from 'react';

export default function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);

  // Pre-generate minimal elements for performance
  const elements = useMemo(() => ({
    // Smaller number of dots for performance
    dots: Array.from({ length: 25 }).map((_, i) => ({
      size: 2 + (i % 4),
      color: i % 2 === 0 ? '#d4a017' : '#a855f7',
      left: 10 + (i * 3.5),
      top: 10 + (i % 5) * 20,
      delay: i * 0.1,
    })),
    // 4 floating orbs instead of 8
    orbs: [
      { size: 300, color: 'rgba(168,85,247,0.15)', x: '20%', y: '30%', delay: 0 },
      { size: 250, color: 'rgba(212,160,23,0.12)', x: '70%', y: '20%', delay: 1 },
      { size: 200, color: 'rgba(168,85,247,0.1)', x: '60%', y: '70%', delay: 2 },
      { size: 280, color: 'rgba(212,160,23,0.08)', x: '25%', y: '65%', delay: 0.5 },
    ],
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
        return prev + 2;
      });
    }, 25);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center transition-opacity duration-500 ${
        fadeOut ? 'opacity-0' : 'opacity-100'
      }`}
      style={{
        background: 'radial-gradient(ellipse at center, #1a0a30 0%, #0a0118 80%)',
      }}
    >
      {/* Animated background layer */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating orbs */}
        {elements.orbs.map((orb, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-float-orb"
            style={{
              width: orb.size,
              height: orb.size,
              background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
              left: orb.x,
              top: orb.y,
              animationDelay: `${orb.delay}s`,
            }}
          />
        ))}

        {/* Animated dots grid */}
        {elements.dots.map((dot, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-twine"
            style={{
              width: dot.size,
              height: dot.size,
              background: dot.color,
              left: `${dot.left}%`,
              top: `${dot.top}%`,
              animationDelay: `${dot.delay}s`,
            }}
          />
        ))}

        {/* Rotating rings */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="absolute w-[400px] h-[400px] border border-gold-500/8 rounded-full animate-spin" style={{ animationDuration: '25s' }} />
          <div className="absolute w-[280px] h-[280px] border border-purple-500/8 rounded-full animate-spin" style={{ animationDuration: '18s', animationDirection: 'reverse' }} />
          <div className="absolute w-[160px] h-[160px] border border-gold-400/8 rounded-full animate-spin" style={{ animationDuration: '12s' }} />
        </div>

        {/* Particle wave effect */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 animate-gradient-shift" style={{ background: 'linear-gradient(45deg, transparent 30%, rgba(212,160,23,0.05) 50%, transparent 70%)' }} />
        </div>
      </div>

      {/* Center content */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Logo with glow */}
        <div className="relative mb-6">
          <div className="absolute inset-0 scale-150">
            <div className="w-full h-full bg-yellow-500/20 rounded-full blur-2xl animate-pulse" />
          </div>
          <img
            src="/EVENT_BY_BELSH.jpg"
            alt="Events By BELSH"
            className="relative h-20 w-20 object-contain rounded-full ring-2 ring-yellow-500/40"
          />
        </div>

        {/* Brand */}
        <h1 className="font-serif text-2xl text-yellow-400 tracking-[0.2em] mb-1">BELSH EVENTS</h1>
        <p className="text-purple-400/80 text-[11px] tracking-[0.3em] uppercase mb-8">Planning &amp; Design</p>

        {/* Progress bar */}
        <div className="w-52 h-1 bg-white/5 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-75"
            style={{
              width: `${progress}%`,
              background: 'linear-gradient(90deg, #d4a017, #f2cc5a, #fcd34d)',
            }}
          />
        </div>

        {/* Loading text */}
        <p className="text-purple-500/60 text-[10px] mt-4 tracking-[0.2em] uppercase">
          {progress < 30 ? 'Preparing...' : progress < 60 ? 'Loading...' : progress < 100 ? 'Almost ready...' : 'Welcome!'}
        </p>
      </div>

      <style>{`
        @keyframes float-orb {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.5; }
          50% { transform: translate(30px, -20px) scale(1.1); opacity: 0.8; }
        }
        @keyframes twine {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.5); }
        }
        @keyframes gradient-shift {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-float-orb { animation: float-orb 6s ease-in-out infinite; }
        .animate-twine { animation: twine 3s ease-in-out infinite; }
        .animate-gradient-shift { animation: gradient-shift 3s ease-in-out infinite; }
      `}</style>
    </div>
  );
}
