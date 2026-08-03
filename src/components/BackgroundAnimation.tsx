import { useMemo } from 'react';

export default function BackgroundAnimation() {
  const particles = useMemo(
    () =>
      Array.from({ length: 40 }).map((_, i) => ({
        size: 3 + (i % 6),
        left: (i * 7.7) % 100,
        top: (i * 11.3) % 100,
        duration: 6 + (i % 5) * 2,
        delay: (i % 8) * 0.6,
        opacity: 0.3 + (i % 4) * 0.12,
        isGold: i % 3 !== 0,
      })),
    []
  );

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {/* Drifting gradient orbs — brighter and larger */}
      <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-purple-700/20 blur-[100px] animate-drift-slow" />
      <div className="absolute top-1/3 -right-40 w-[550px] h-[550px] rounded-full bg-gold-600/15 blur-[90px] animate-drift-slower" />
      <div className="absolute -bottom-40 left-1/4 w-[500px] h-[500px] rounded-full bg-purple-600/15 blur-[95px] animate-drift-slow-reverse" />
      <div className="absolute top-2/3 left-10 w-[400px] h-[400px] rounded-full bg-gold-500/12 blur-[80px] animate-drift-slow" />
      <div className="absolute top-10 right-1/4 w-[350px] h-[350px] rounded-full bg-purple-500/12 blur-[85px] animate-drift-slower" />

      {/* Floating particles — more, bigger, brighter */}
      {particles.map((p, i) => (
        <div
          key={i}
          className={`absolute rounded-full animate-float-up ${p.isGold ? 'bg-gold-400' : 'bg-purple-400'}`}
          style={{
            width: p.size,
            height: p.size,
            left: `${p.left}%`,
            top: `${p.top}%`,
            opacity: p.opacity,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            boxShadow: p.isGold
              ? `0 0 ${p.size * 2}px rgba(212,160,23,0.5)`
              : `0 0 ${p.size * 2}px rgba(168,85,247,0.4)`,
          }}
        />
      ))}

      {/* Slow-rotating subtle ring */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full border border-gold-500/5 animate-spin-slow" />

      <style>{`
        @keyframes drift-slow {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(80px, 50px) scale(1.15); }
          66% { transform: translate(-40px, 90px) scale(0.9); }
        }
        @keyframes drift-slower {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-100px, 60px) scale(1.2); }
        }
        @keyframes drift-slow-reverse {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(-60px, -50px) scale(0.85); }
          66% { transform: translate(50px, -70px) scale(1.15); }
        }
        @keyframes float-up {
          0% { transform: translateY(0) scale(1); opacity: 0; }
          10% { opacity: 0.5; }
          50% { transform: translateY(-80px) scale(1.3); opacity: 0.4; }
          90% { opacity: 0.15; }
          100% { transform: translateY(-160px) scale(0.7); opacity: 0; }
        }
        @keyframes spin-slow {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }
        .animate-drift-slow { animation: drift-slow 20s ease-in-out infinite; }
        .animate-drift-slower { animation: drift-slower 25s ease-in-out infinite; }
        .animate-drift-slow-reverse { animation: drift-slow-reverse 22s ease-in-out infinite; }
        .animate-float-up { animation: float-up 10s ease-in-out infinite; }
        .animate-spin-slow { animation: spin-slow 60s linear infinite; }
      `}</style>
    </div>
  );
}
