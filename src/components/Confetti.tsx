import { useEffect, useState } from 'react';

type ConfettiStyle = 'gold' | 'rainbow' | 'wedding' | 'birthday' | 'corporate' | 'celebration';

interface ConfettiProps {
  style?: ConfettiStyle;
  active?: boolean;
}

const confettiStyles: Record<ConfettiStyle, { colors: string[]; shapes: string[] }> = {
  gold: {
    colors: ['#d4a017', '#f2cc5a', '#e6b930', '#c48b00', '#ffd700'],
    shapes: ['circle', 'star', 'square'],
  },
  rainbow: {
    colors: ['#ff0000', '#ff7f00', '#ffff00', '#00ff00', '#0000ff', '#4b0082', '#8f00ff'],
    shapes: ['circle', 'square', 'triangle', 'star'],
  },
  wedding: {
    colors: ['#ffffff', '#ffd700', '#ffc0cb', '#d4a017', '#e6b930'],
    shapes: ['heart', 'star', 'circle'],
  },
  birthday: {
    colors: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ff9f43', '#ee5a5a', '#ffd700'],
    shapes: ['balloon', 'star', 'circle'],
  },
  corporate: {
    colors: ['#1a1a2e', '#4a4a6a', '#d4a017', '#ffffff', '#6b21a8'],
    shapes: ['square', 'circle', 'triangle'],
  },
  celebration: {
    colors: ['#d4a017', '#f2cc5a', '#e6b930', '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ff9f43'],
    shapes: ['circle', 'square', 'triangle', 'star'],
  },
};

export default function Confetti({ style = 'celebration', active = true }: ConfettiProps) {
  const [particles, setParticles] = useState<Array<{
    id: number;
    left: number;
    delay: number;
    duration: number;
    color: string;
    shape: string;
    size: number;
  }>>([]);

  useEffect(() => {
    const config = confettiStyles[style];
    const newParticles = Array.from({ length: 80 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 3,
      duration: 3 + Math.random() * 4,
      color: config.colors[Math.floor(Math.random() * config.colors.length)],
      shape: config.shapes[Math.floor(Math.random() * config.shapes.length)],
      size: 6 + Math.random() * 10,
    }));
    setParticles(newParticles);
  }, [style]);

  if (!active) return null;

  const renderShape = (shape: string, size: number, color: string) => {
    switch (shape) {
      case 'heart':
        return (
          <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill={color}
            style={{ filter: 'drop-shadow(0 0 4px rgba(255,255,255,0.5))' }}
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        );
      case 'star':
        return (
          <span
            className="text-center leading-none"
            style={{
              fontSize: size,
              color,
              textShadow: '0 0 6px rgba(255,255,255,0.5)',
            }}
          >
            ★
          </span>
        );
      case 'balloon':
        return (
          <svg
            width={size}
            height={size * 1.2}
            viewBox="0 0 24 30"
            fill={color}
            style={{ filter: 'drop-shadow(0 0 4px rgba(255,255,255,0.5))' }}
          >
            <ellipse cx="12" cy="10" rx="8" ry="10" />
            <path d="M12 20 L10 24 L14 24 Z" fill={color} />
            <path d="M10 24 Q12 28, 14 24" stroke={color} strokeWidth="1" fill="none" />
          </svg>
        );
      case 'triangle':
        return (
          <div
            style={{
              width: 0,
              height: 0,
              borderLeft: `${size/2}px solid transparent`,
              borderRight: `${size/2}px solid transparent`,
              borderBottom: `${size}px solid ${color}`,
              filter: 'drop-shadow(0 0 3px rgba(255,255,255,0.5))',
            }}
          />
        );
      case 'square':
        return (
          <div
            style={{
              width: size,
              height: size,
              backgroundColor: color,
              transform: `rotate(${Math.random() * 360}deg)`,
              boxShadow: '0 0 6px rgba(255,255,255,0.5)',
            }}
          />
        );
      default: // circle
        return (
          <div
            className="rounded-full"
            style={{
              width: size,
              height: size,
              backgroundColor: color,
              boxShadow: '0 0 6px rgba(255,255,255,0.5)',
            }}
          />
        );
    }
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute animate-page-confetti"
          style={{
            left: `${p.left}%`,
            top: '-20px',
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        >
          {renderShape(p.shape, p.size, p.color)}
        </div>
      ))}
      <style>{`
        @keyframes page-confetti {
          0% {
            transform: translateY(-10vh) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
        .animate-page-confetti {
          animation: page-confetti 4s linear forwards;
        }
      `}</style>
    </div>
  );
}
