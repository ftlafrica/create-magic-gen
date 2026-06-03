import { forwardRef, ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ShimmerButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  tone?: "cta" | "neon";
}

const ShimmerButton = forwardRef<HTMLButtonElement, ShimmerButtonProps>(
  ({ children, className, tone = "cta", ...props }, ref) => {
    const base =
      tone === "cta"
        ? "bg-cta text-cta-foreground"
        : "bg-secondary text-secondary-foreground";
    return (
      <button
        ref={ref}
        className={cn(
          "relative inline-flex items-center justify-center gap-2 h-11 px-7 rounded-full font-bold text-sm tracking-wide overflow-hidden group transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] shadow-[0_8px_30px_-8px_hsl(var(--cta)/0.5)]",
          base,
          className
        )}
        {...props}
      >
        <span className="relative z-10 flex items-center gap-2">{children}</span>
        <span
          aria-hidden="true"
          className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"
          style={{
            background:
              "linear-gradient(110deg, transparent 30%, hsl(0 0% 100% / 0.4) 50%, transparent 70%)",
          }}
        />
      </button>
    );
  }
);
ShimmerButton.displayName = "ShimmerButton";
export default ShimmerButton;
