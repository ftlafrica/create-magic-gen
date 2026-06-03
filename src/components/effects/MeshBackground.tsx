import { memo } from "react";

const MeshBackground = memo(({ className = "" }: { className?: string }) => (
  <div
    aria-hidden="true"
    className={`pointer-events-none absolute inset-0 -z-10 bg-mesh ${className}`}
  >
    <div className="absolute inset-0 opacity-[0.04]"
      style={{
        backgroundImage: `linear-gradient(hsl(var(--secondary)) 1px, transparent 1px),
                          linear-gradient(90deg, hsl(var(--secondary)) 1px, transparent 1px)`,
        backgroundSize: "72px 72px",
        maskImage: "radial-gradient(ellipse at center, black 40%, transparent 80%)",
        WebkitMaskImage: "radial-gradient(ellipse at center, black 40%, transparent 80%)",
      }}
    />
  </div>
));
MeshBackground.displayName = "MeshBackground";
export default MeshBackground;
