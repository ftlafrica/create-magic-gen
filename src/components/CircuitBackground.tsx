import { memo } from "react";

const CircuitBackground = memo(() => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {/* Grid overlay */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(hsl(var(--secondary)) 1px, transparent 1px),
            linear-gradient(90deg, hsl(var(--secondary)) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Floating circuit dots */}
      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-secondary/30 animate-float"
          style={{
            width: `${2 + (i % 3) * 2}px`,
            height: `${2 + (i % 3) * 2}px`,
            left: `${(i * 17 + 5) % 100}%`,
            top: `${(i * 23 + 10) % 100}%`,
            animationDelay: `${i * 0.4}s`,
            animationDuration: `${4 + (i % 3) * 2}s`,
          }}
        />
      ))}

      {/* Glowing connection lines */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.06]" xmlns="http://www.w3.org/2000/svg">
        <line x1="10%" y1="20%" x2="30%" y2="40%" stroke="hsl(var(--secondary))" strokeWidth="1" className="animate-circuit-flow" />
        <line x1="70%" y1="10%" x2="90%" y2="35%" stroke="hsl(var(--accent))" strokeWidth="1" className="animate-circuit-flow" style={{ animationDelay: '1s' }} />
        <line x1="50%" y1="60%" x2="80%" y2="80%" stroke="hsl(var(--secondary))" strokeWidth="1" className="animate-circuit-flow" style={{ animationDelay: '2s' }} />
        <line x1="20%" y1="70%" x2="45%" y2="90%" stroke="hsl(var(--accent))" strokeWidth="1" className="animate-circuit-flow" style={{ animationDelay: '0.5s' }} />
        <circle cx="30%" cy="40%" r="3" fill="hsl(var(--secondary))" className="animate-glow-pulse" />
        <circle cx="90%" cy="35%" r="3" fill="hsl(var(--accent))" className="animate-glow-pulse" style={{ animationDelay: '1s' }} />
        <circle cx="80%" cy="80%" r="3" fill="hsl(var(--secondary))" className="animate-glow-pulse" style={{ animationDelay: '2s' }} />
      </svg>

      {/* Scan line */}
      <div className="absolute inset-0 animate-scan-line opacity-[0.04]">
        <div className="w-full h-px bg-gradient-to-r from-transparent via-secondary to-transparent" />
      </div>
    </div>
  );
});

CircuitBackground.displayName = "CircuitBackground";

export default CircuitBackground;
