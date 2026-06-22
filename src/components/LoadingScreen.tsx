import { useState, useEffect } from 'react';

export default function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);

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
    }, 30);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-dark transition-opacity duration-500 ${
        fadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Logo */}
      <div className="relative mb-8">
        <div className="absolute inset-0 blur-2xl bg-gold-500/30 rounded-full animate-pulse" />
        <img
          src="/EVENT_BY_BELSH.jpg"
          alt="Events By BELSH"
          className="relative h-24 w-24 object-contain rounded-full ring-4 ring-gold-500/50 animate-pulse"
        />
      </div>

      {/* Brand name */}
      <div className="text-center mb-8">
        <h1 className="font-serif text-3xl gold-text tracking-widest">BELSH EVENTS</h1>
        <p className="text-purple-400 text-xs tracking-[0.25em] uppercase mt-2">Planning &amp; Design</p>
      </div>

      {/* Progress bar */}
      <div className="w-64 h-1 bg-purple-900 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-gold-600 to-gold-400 transition-all duration-100"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Loading text */}
      <p className="text-purple-500 text-xs mt-4 tracking-widest uppercase">
        {progress < 100 ? 'Loading...' : 'Welcome'}
      </p>
    </div>
  );
}
