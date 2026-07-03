import { useMemo } from 'react';

interface FloatingDotsProps {
  color?: 'gold' | 'purple' | 'mixed' | 'rainbow';
  count?: number;
  size?: 'sm' | 'md' | 'lg';
}

export default function FloatingDots({
  color = 'mixed',
  count = 50,
  size = 'sm'
}: FloatingDotsProps) {
  const sizeConfig = {
    sm: { min: 2, max: 4 },
    md: { min: 3, max: 6 },
    lg: { min: 5, max: 10 },
  };

  const colorConfig: Record<string, string[]> = {
    gold: ['#d4a017', '#f2cc5a'],
    purple: ['#a855f7', '#6b21a8'],
    mixed: ['#d4a017', '#f2cc5a', '#a855f7'],
    rainbow: ['#f59e0b', '#a855f7', '#ec4899'],
  };

  const colors = colorConfig[color] || colorConfig.mixed;
  const { min, max } = sizeConfig[size] || sizeConfig.sm;

  // Pre-generate dots with memoization to prevent recalculation
  const dots = useMemo(() =>
    Array.from({ length: Math.min(count, 50) }).map((_, i) => ({
      size: min + Math.random() * (max - min),
      color: colors[Math.floor(Math.random() * colors.length)],
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 3,
      duration: 10 + Math.random() * 5,
    })), [count, min, max, colors]
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {dots.map((dot, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            width: dot.size,
            height: dot.size,
            backgroundColor: dot.color,
            left: `${dot.left}%`,
            top: `${dot.top}%`,
            opacity: 0.25,
            animation: `float-simple ${dot.duration}s ease-in-out infinite`,
            animationDelay: `${dot.delay}s`,
          }}
        />
      ))}
      <style>{`
        @keyframes float-simple {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
      `}</style>
    </div>
  );
}
