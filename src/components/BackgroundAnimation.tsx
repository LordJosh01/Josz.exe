import { useMemo } from 'react';

export default function BackgroundAnimation() {
  const particles = useMemo(
    () =>
      Array.from({ length: 18 }).map((_, i) => ({
        size: 2 + (i % 4),
        left: (i * 5.5) % 100,
        top: (i * 7.3) % 100,
        duration: 8 + (i % 5) * 2,
        delay: (i % 6) * 0.8,
        opacity: 0.15 + (i % 3) * 0.1,
      })),
    []
  );

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {/* Slow drifting gradient orbs */}
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-purple-700/10 blur-[120px] animate-drift-slow" />
      <div className="absolute top-1/3 -right-40 w-[450px] h-[450px] rounded-full bg-gold-600/8 blur-[100px] animate-drift-slower" />
      <div className="absolute -bottom-40 left-1/4 w-[400px] h-[400px] rounded-full bg-purple-600/8 blur-[110px] animate-drift-slow-reverse" />

      {/* Subtle floating particles */}
      {particles.map((p, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-gold-400 animate-float-up"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.left}%`,
            top: `${p.top}%`,
            opacity: p.opacity,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}

      <style>{`
        @keyframes drift-slow {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(60px, 40px) scale(1.1); }
          66% { transform: translate(-30px, 70px) scale(0.95); }
        }
        @keyframes drift-slower {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-80px, 50px) scale(1.15); }
        }
        @keyframes drift-slow-reverse {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(-50px, -40px) scale(0.9); }
          66% { transform: translate(40px, -60px) scale(1.1); }
        }
        @keyframes float-up {
          0% { transform: translateY(0) scale(1); opacity: 0; }
          10% { opacity: 0.25; }
          50% { transform: translateY(-60px) scale(1.2); opacity: 0.2; }
          90% { opacity: 0.1; }
          100% { transform: translateY(-120px) scale(0.8); opacity: 0; }
        }
        .animate-drift-slow { animation: drift-slow 25s ease-in-out infinite; }
        .animate-drift-slower { animation: drift-slower 30s ease-in-out infinite; }
        .animate-drift-slow-reverse { animation: drift-slow-reverse 28s ease-in-out infinite; }
        .animate-float-up { animation: float-up 12s ease-in-out infinite; }
      `}</style>
    </div>
  );
}
