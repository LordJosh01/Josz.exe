import { useState, useEffect, useMemo } from 'react';

export default function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);

  // Pre-generate static random values to avoid recalculation
  const dots = useMemo(() =>
    Array.from({ length: 15 }).map((_, i) => ({
      size: 2 + Math.random() * 3,
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 3,
    })), []
  );

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
        return prev + 3;
      });
    }, 25);

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
      {/* Simple static background gradient */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-[400px] h-[400px] bg-gold-500/5 rounded-full blur-3xl top-1/4 left-1/4" />
        <div className="absolute w-[300px] h-[300px] bg-purple-500/5 rounded-full blur-3xl bottom-1/4 right-1/4" />
      </div>

      {/* Logo */}
      <div className="relative mb-4 z-10">
        <div className="absolute inset-0 blur-lg bg-yellow-500/40 rounded-full" />
        <img
          src="/EVENT_BY_BELSH.jpg"
          alt="Events By BELSH"
          className="relative h-14 w-14 object-contain rounded-full ring-2 ring-yellow-500/60"
        />
      </div>

      {/* Brand name */}
      <div className="text-center mb-4 z-10">
        <h1 className="font-serif text-lg text-yellow-400 tracking-widest">BELSH EVENTS</h1>
        <p className="text-purple-400 text-[10px] tracking-[0.2em] uppercase mt-1">Planning &amp; Design</p>
      </div>

      {/* Yellow Progress bar */}
      <div className="w-44 h-1.5 bg-dark-card rounded-full overflow-hidden relative z-10">
        <div
          className="h-full rounded-full transition-all duration-75"
          style={{
            width: `${progress}%`,
            background: 'linear-gradient(90deg, #f59e0b, #fbbf24, #fcd34d)',
          }}
        />
      </div>

      {/* Loading text */}
      <p className="text-purple-400 text-[10px] mt-3 tracking-widest uppercase z-10">
        {progress < 100 ? 'Loading...' : 'Welcome'}
      </p>
    </div>
  );
}
