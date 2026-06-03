import { Button } from "@/components/ui/button";
import { motion, useMotionValue, animate } from "framer-motion";
import { ArrowRight, Shield, Sparkles } from "lucide-react";
import heroImage from "@/assets/hero-certificate.jpg";
import { Link } from "react-router-dom";
import CircuitBackground from "@/components/CircuitBackground";
import Meteors from "@/components/effects/Meteors";
import ShimmerButton from "@/components/effects/ShimmerButton";
import { useEffect, useState } from "react";

const AnimatedCounter = ({ target, suffix = "" }: { target: number; suffix?: string }) => {
  const [display, setDisplay] = useState(0);
  const count = useMotionValue(0);

  useEffect(() => {
    const unsubscribe = count.on("change", (v) => setDisplay(Math.round(v)));
    const controls = animate(count, target, { duration: 2, ease: "easeOut" });
    return () => { unsubscribe(); controls.stop(); };
  }, [target, count]);

  return <span>{display.toLocaleString()}{suffix}</span>;
};

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-28 pb-16">
      {/* Mesh + base gradient */}
      <div className="absolute inset-0 bg-mesh" />
      <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-transparent to-background" />

      {/* Circuit + meteors */}
      <CircuitBackground />
      <Meteors number={14} />

      {/* Ambient orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/6 w-80 h-80 bg-secondary/10 rounded-full blur-[140px] animate-glow-pulse" />
        <div className="absolute bottom-1/3 right-1/5 w-96 h-96 bg-accent/10 rounded-full blur-[140px] animate-glow-pulse" style={{ animationDelay: "1.5s" }} />
        <div className="absolute top-2/3 left-1/2 w-64 h-64 bg-cta/8 rounded-full blur-[120px] animate-glow-pulse" style={{ animationDelay: "3s" }} />
      </div>

      <div className="container mx-auto px-5 sm:px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="space-y-7"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 glass rounded-full"
            >
              <Sparkles className="w-3.5 h-3.5 text-cta" />
              <span className="text-xs sm:text-sm font-medium tracking-wide text-foreground/90">
                AI Authenticated · Trusted Across Africa
              </span>
            </motion.div>

            {/* Headline */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold leading-[0.95]">
              <motion.span
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.6 }}
                className="block text-gradient-aurora"
              >
                AI Authenticated
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="block mt-2 text-foreground"
              >
                Credentials for <span className="text-gradient-gold">Africa</span>
              </motion.span>
            </h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed max-w-lg"
            >
              Create, issue, and verify tamper-proof digital certificates powered by AI. Trusted by educators and organizations across the continent.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.85 }}
              className="flex flex-col sm:flex-row gap-3 sm:gap-4"
            >
              <Link to="/signup">
                <ShimmerButton className="w-full sm:w-auto">
                  Start for Free
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </ShimmerButton>
              </Link>
              <Link to="/dashboard">
                <Button variant="hero" size="lg" className="rounded-full text-base w-full sm:w-auto">
                  <Shield className="w-5 h-5" />
                  View Demo
                </Button>
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.05 }}
              className="grid grid-cols-3 gap-3 sm:gap-6 pt-4 max-w-md"
            >
              {[
                { value: <AnimatedCounter target={10} suffix="K+" />, label: "Issued", color: "text-secondary" },
                { value: <AnimatedCounter target={500} suffix="+" />, label: "Orgs", color: "text-accent" },
                { value: "99.9%", label: "Uptime", color: "text-cta" },
              ].map((s, i) => (
                <div
                  key={i}
                  className="glass rounded-xl px-3 py-3 text-center transition-all duration-300 hover:-translate-y-0.5 hover:border-secondary/40"
                >
                  <p className={`text-2xl sm:text-3xl font-bold ${s.color}`}>{s.value}</p>
                  <p className="text-[10px] sm:text-xs text-muted-foreground tracking-wide uppercase mt-0.5">{s.label}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Image side */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative"
          >
            <div className="relative animate-tilt">
              <div className="absolute -inset-6 bg-gradient-to-br from-secondary/30 via-accent/20 to-cta/15 rounded-3xl blur-3xl animate-glow-pulse" />

              <div className="relative rounded-2xl border-beam overflow-hidden">
                <img
                  src={heroImage}
                  alt="Digital Certificate Verification Platform"
                  className="relative rounded-2xl shadow-2xl w-full"
                />
              </div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.1, type: "spring" }}
                className="absolute -bottom-5 -right-3 sm:-right-6 glass-strong rounded-xl p-3 sm:p-4 shadow-xl"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-secondary/20 rounded-full flex items-center justify-center ring-1 ring-secondary/40">
                    <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-secondary" />
                  </div>
                  <div>
                    <p className="font-bold text-sm sm:text-base">Verified Secure</p>
                    <p className="text-xs text-muted-foreground">AI Protected</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
