import { motion } from "framer-motion";
import logoImage from "@/assets/africertify-logo.png";

interface AfriCertifyLogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  showTagline?: boolean;
}

const sizeMap = {
  sm: { img: "h-16", text: "text-lg", tagline: "text-[9px]" },
  md: { img: "h-20", text: "text-xl", tagline: "text-[10px]" },
  lg: { img: "h-28", text: "text-2xl", tagline: "text-xs" },
};

const AfriCertifyLogo = ({ size = "md", showText = false, showTagline = false }: AfriCertifyLogoProps) => {
  const s = sizeMap[size];

  return (
    <motion.div
      className="flex items-center"
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <img
        src={logoImage}
        alt="AfriCertify AI Authenticated Logo"
        className={`${s.img} w-auto object-contain`}
      />
    </motion.div>
  );
};

export default AfriCertifyLogo;
