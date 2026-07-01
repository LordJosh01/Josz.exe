interface FloatingDotsProps {
  color?: 'gold' | 'purple' | 'mixed' | 'rainbow';
  count?: number;
  size?: 'sm' | 'md' | 'lg';
}

export default function FloatingDots({
  color = 'mixed',
  count = 30,
  size = 'sm'
}: FloatingDotsProps) {
  const sizeConfig = {
    sm: { min: 1, max: 3 },
    md: { min: 2, max: 5 },
    lg: { min: 3, max: 8 },
  };

  const colorConfig = {
    gold: ['#d4a017', '#f2cc5a', '#e6b930', '#c48b00'],
    purple: ['#a855f7', '#6b21a8', '#581c87', '#3b0764'],
    mixed: ['#d4a017', '#f2cc5a', '#a855f7', '#6b21a8', '#c48b00'],
    rainbow: ['#ff0000', '#ff7f00', '#ffff00', '#00ff00', '#0000ff', '#8f00ff', '#d4a017'],
  };

  const colors = colorConfig[color];
  const { min, max } = sizeConfig[size];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: count }).map((_, i) => {
        const dotSize = min + Math.random() * (max - min);
        const dotColor = colors[Math.floor(Math.random() * colors.length)];
        return (
          <div
            key={i}
            className="absolute rounded-full animate-floating-dot"
            style={{
              width: dotSize,
              height: dotSize,
              backgroundColor: dotColor,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: 0.2 + Math.random() * 0.3,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${6 + Math.random() * 8}s`,
            }}
          />
        );
      })}
      <style>{`
        @keyframes floating-dot {
          0%, 100% {
            transform: translate(0, 0) scale(1);
            opacity: 0.15;
          }
          25% {
            transform: translate(15px, -20px) scale(1.3);
            opacity: 0.3;
          }
          50% {
            transform: translate(-8px, 15px) scale(0.85);
            opacity: 0.2;
          }
          75% {
            transform: translate(12px, 8px) scale(1.15);
            opacity: 0.25;
          }
        }
        .animate-floating-dot {
          animation: floating-dot 15s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
