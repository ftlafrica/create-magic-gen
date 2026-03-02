import { motion } from "framer-motion";
import logoImage from "@/assets/africertify-logo.png";

interface AfriCertifyLogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  showTagline?: boolean;
}

const sizeMap = {
  sm: { img: "w-8 h-8", text: "text-lg", tagline: "text-[9px]" },
  md: { img: "w-10 h-10", text: "text-xl", tagline: "text-[10px]" },
  lg: { img: "w-14 h-14", text: "text-2xl", tagline: "text-xs" },
};

const AfriCertifyLogo = ({ size = "md", showText = true, showTagline = false }: AfriCertifyLogoProps) => {
  const s = sizeMap[size];

  return (
    <div className="flex items-center gap-2.5">
      <motion.div
        className="relative flex-shrink-0"
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <div className="absolute inset-0 rounded-xl bg-secondary/30 blur-md animate-pulse" />
        <img
          src={logoImage}
          alt="AfriCertify AI Authenticated Logo"
          className={`${s.img} relative rounded-xl object-cover`}
        />
      </motion.div>
      {showText && (
        <div className="flex flex-col">
          <span className={`${s.text} font-bold tracking-wider leading-tight`}>
            Afri<span className="text-secondary">Certify</span>
          </span>
          {showTagline && (
            <span className={`${s.tagline} text-secondary/80 tracking-[0.2em] uppercase leading-tight`}>
              AI Authenticated
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default AfriCertifyLogo;
