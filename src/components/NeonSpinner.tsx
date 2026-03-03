import { motion } from "framer-motion";

interface NeonSpinnerProps {
  size?: "sm" | "md" | "lg";
}

const sizeMap = {
  sm: "w-8 h-8",
  md: "w-12 h-12",
  lg: "w-16 h-16",
};

const NeonSpinner = ({ size = "md" }: NeonSpinnerProps) => {
  return (
    <div className={`relative ${sizeMap[size]} flex items-center justify-center`}>
      <motion.div
        className="absolute inset-0 rounded-full border-2 border-secondary/30"
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      >
        <div className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-secondary shadow-[0_0_8px_hsl(var(--secondary))]" />
      </motion.div>
      <motion.div
        className="absolute inset-1 rounded-full border-2 border-accent/30"
        animate={{ rotate: -360 }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
      >
        <div className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-accent shadow-[0_0_8px_hsl(var(--accent))]" />
      </motion.div>
      <div className="w-2 h-2 rounded-full bg-cta animate-glow-pulse shadow-[0_0_10px_hsl(var(--cta))]" />
    </div>
  );
};

export default NeonSpinner;
