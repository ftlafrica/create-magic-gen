import { memo, useMemo } from "react";

interface MeteorsProps {
  number?: number;
  className?: string;
}

const Meteors = memo(({ number = 18, className = "" }: MeteorsProps) => {
  const meteors = useMemo(
    () =>
      Array.from({ length: number }).map((_, i) => ({
        id: i,
        top: -5,
        left: (i * 137) % 100,
        delay: (i * 0.37) % 5,
        duration: 4 + ((i * 0.7) % 6),
      })),
    [number]
  );

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`} aria-hidden="true">
      {meteors.map((m) => (
        <span
          key={m.id}
          className="absolute h-0.5 w-0.5 rounded-[9999px] bg-secondary shadow-[0_0_0_1px_hsl(var(--secondary)/0.1)] rotate-[215deg] animate-meteor"
          style={{
            top: `${m.top}%`,
            left: `${m.left}%`,
            animationDelay: `${m.delay}s`,
            animationDuration: `${m.duration}s`,
          }}
        >
          <span className="absolute top-1/2 left-0 h-px w-[60px] -translate-y-1/2 bg-gradient-to-r from-secondary via-secondary/60 to-transparent" />
        </span>
      ))}
    </div>
  );
});
Meteors.displayName = "Meteors";
export default Meteors;
