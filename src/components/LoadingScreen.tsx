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

      {/* Rainbow Progress bar */}
      <div className="w-64 h-2 bg-dark-card rounded-full overflow-hidden relative">
        <div
          className="h-full transition-all duration-100 rounded-full"
          style={{
            width: `${progress}%`,
            background: 'linear-gradient(90deg, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #4b0082, #8f00ff)',
            backgroundSize: '200% 100%',
            animation: 'rainbow 2s linear infinite',
          }}
        />
      </div>

      {/* Loading text */}
      <p className="text-purple-500 text-xs mt-4 tracking-widest uppercase">
        {progress < 100 ? 'Loading...' : 'Welcome'}
      </p>

      <style>{`
        @keyframes rainbow {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
      `}</style>
    </div>
  );
}
