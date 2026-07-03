import { useState, useEffect, useMemo } from 'react';

export default function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);

  // Pre-generate all animated elements with useMemo
  const animatedElements = useMemo(() => {
    // 50 moving dots
    const dots = Array.from({ length: 50 }).map((_, i) => ({
      size: 2 + Math.random() * 4,
      color: i % 3 === 0 ? '#d4a017' : i % 3 === 1 ? '#a855f7' : '#6b21a8',
      left: Math.random() * 100,
      top: Math.random() * 100,
      opacity: 0.3 + Math.random() * 0.4,
      delay: Math.random() * 5,
      duration: 5 + Math.random() * 10,
    }));

    // 8 floating circles
    const circles = Array.from({ length: 8 }).map((_, i) => ({
      size: 100 + Math.random() * 200,
      isGold: i % 2 === 0,
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 3,
      duration: 8 + Math.random() * 4,
    }));

    return { dots, circles };
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            setFadeOut(true);
            setTimeout(onComplete, 400);
          }, 200);
          return 100;
        }
        return prev + 2;
      });
    }, 30);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center transition-opacity duration-400 ${
        fadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      style={{
        background: 'radial-gradient(ellipse at center, #1a0a30 0%, #0a0118 70%)',
      }}
    >
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* 50 Moving dots */}
        {animatedElements.dots.map((dot, i) => (
          <div
            key={`dot-${i}`}
            className="absolute rounded-full animate-loading-dot"
            style={{
              width: dot.size,
              height: dot.size,
              background: dot.color,
              left: `${dot.left}%`,
              top: `${dot.top}%`,
              opacity: dot.opacity,
              animationDelay: `${dot.delay}s`,
              animationDuration: `${dot.duration}s`,
            }}
          />
        ))}

        {/* 8 Floating circles */}
        {animatedElements.circles.map((circle, i) => (
          <div
            key={`circle-${i}`}
            className="absolute rounded-full animate-loading-float"
            style={{
              width: circle.size,
              height: circle.size,
              background: `radial-gradient(circle, ${circle.isGold ? 'rgba(212,160,23,0.1)' : 'rgba(168,85,247,0.1)'} 0%, transparent 70%)`,
              left: `${circle.left}%`,
              top: `${circle.top}%`,
              animationDelay: `${circle.delay}s`,
              animationDuration: `${circle.duration}s`,
            }}
          />
        ))}

        {/* 3 Spinning rings */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-[500px] h-[500px] border border-gold-500/10 rounded-full animate-spin-slow" style={{ animationDuration: '20s' }} />
          <div className="absolute w-[400px] h-[400px] border border-purple-500/10 rounded-full animate-spin-slow" style={{ animationDuration: '15s', animationDirection: 'reverse' }} />
          <div className="absolute w-[300px] h-[300px] border border-gold-400/10 rounded-full animate-spin-slow" style={{ animationDuration: '10s' }} />
        </div>
      </div>

      {/* Logo */}
      <div className="relative mb-5 z-10">
        <div className="absolute inset-0 blur-xl bg-yellow-500/30 rounded-full animate-pulse" />
        <img
          src="/EVENT_BY_BELSH.jpg"
          alt="Events By BELSH"
          className="relative h-16 w-16 object-contain rounded-full ring-2 ring-yellow-500/50 animate-pulse"
        />
      </div>

      {/* Brand name */}
      <div className="text-center mb-5 z-10">
        <h1 className="font-serif text-xl text-yellow-400 tracking-widest">BELSH EVENTS</h1>
        <p className="text-purple-400 text-[10px] tracking-[0.25em] uppercase mt-1">Planning &amp; Design</p>
      </div>

      {/* Yellow Progress bar */}
      <div className="w-48 h-1.5 bg-dark-card rounded-full overflow-hidden relative z-10">
        <div
          className="h-full transition-all duration-100 rounded-full"
          style={{
            width: `${progress}%`,
            background: 'linear-gradient(90deg, #f59e0b, #fbbf24, #fcd34d, #fef08a)',
          }}
        />
      </div>

      {/* Loading text */}
      <p className="text-purple-500 text-[10px] mt-3 tracking-widest uppercase z-10">
        {progress < 100 ? 'Loading...' : 'Welcome'}
      </p>

      <style>{`
        @keyframes loading-dot {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.3; }
          25% { transform: translate(20px, -20px) scale(1.5); opacity: 0.6; }
          50% { transform: translate(-10px, 20px) scale(1); opacity: 0.4; }
          75% { transform: translate(15px, 10px) scale(1.3); opacity: 0.5; }
        }
        @keyframes loading-float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -30px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-loading-dot { animation: loading-dot 8s ease-in-out infinite; }
        .animate-loading-float { animation: loading-float 10s ease-in-out infinite; }
        .animate-spin-slow { animation: spin 20s linear infinite; }
      `}</style>
    </div>
  );
}
