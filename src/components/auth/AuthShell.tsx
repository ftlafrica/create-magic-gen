import { ReactNode } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Shield, Sparkles, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import AfriCertifyLogo from "@/components/AfriCertifyLogo";
import Meteors from "@/components/effects/Meteors";

interface AuthShellProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  backTo?: string;
  backLabel?: string;
  footer?: ReactNode;
}

const brandPoints = [
  { icon: Shield, text: "Cryptographically verified credentials" },
  { icon: Sparkles, text: "AI-enhanced certificate design" },
  { icon: Lock, text: "Tamper-proof, trusted across Africa" },
];

const AuthShell = ({ title, subtitle, children, backTo = "/", backLabel = "Back to home", footer }: AuthShellProps) => {
  return (
    <div className="min-h-screen bg-background flex relative overflow-hidden">
      {/* Mesh + ambient */}
      <div className="absolute inset-0 bg-mesh pointer-events-none" />
      <Meteors number={10} />
      <div className="absolute -top-32 -left-32 w-[420px] h-[420px] bg-secondary/20 rounded-full blur-[140px] animate-glow-pulse pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-[420px] h-[420px] bg-accent/20 rounded-full blur-[140px] animate-glow-pulse pointer-events-none" style={{ animationDelay: "1.4s" }} />

      {/* Brand panel — desktop only */}
      <div className="hidden lg:flex w-1/2 relative flex-col justify-between p-12 xl:p-16 border-r border-secondary/15">
        <div className="relative z-10">
          <Link to="/">
            <AfriCertifyLogo size="md" showTagline />
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative z-10 space-y-8 max-w-md"
        >
          <h2 className="text-5xl xl:text-6xl font-bold leading-[1.05]">
            <span className="block text-gradient-aurora">AI Authenticated</span>
            <span className="block text-foreground mt-2">Credentials.</span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Join thousands of educators and organizations issuing verifiable certificates trusted across the continent.
          </p>

          <div className="space-y-3 pt-4">
            {brandPoints.map((p, i) => (
              <motion.div
                key={p.text}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="flex items-center gap-3"
              >
                <div className="w-9 h-9 rounded-lg glass flex items-center justify-center">
                  <p.icon className="w-4 h-4 text-secondary" />
                </div>
                <span className="text-sm text-foreground/90">{p.text}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <p className="text-xs text-muted-foreground tracking-[0.2em] relative z-10">
          AI · AUTHENTICATED · IMMUTABLE
        </p>
      </div>

      {/* Form column */}
      <div className="flex-1 flex items-center justify-center p-5 sm:p-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Link
            to={backTo}
            className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-secondary mb-6 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            {backLabel}
          </Link>

          {/* Mobile logo */}
          <div className="lg:hidden mb-6">
            <AfriCertifyLogo size="sm" showTagline />
          </div>

          <div className="glass-strong rounded-2xl p-7 sm:p-8 shadow-[0_30px_80px_-30px_hsl(210_100%_4%/0.8)]">
            <div className="mb-6">
              <h1 className="text-3xl sm:text-4xl font-bold mb-2 tracking-wide">{title}</h1>
              <p className="text-sm text-muted-foreground">{subtitle}</p>
            </div>
            {children}
          </div>

          {footer && <div className="mt-5 text-center text-sm text-muted-foreground">{footer}</div>}
        </motion.div>
      </div>
    </div>
  );
};

export default AuthShell;
