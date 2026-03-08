import { Button } from "@/components/ui/button";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { ArrowRight, Shield, Sparkles } from "lucide-react";
import heroImage from "@/assets/hero-certificate.jpg";
import { Link } from "react-router-dom";
import CircuitBackground from "@/components/CircuitBackground";
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

const headlineWords = ["AI", "Authenticated"];
const headlineWordColors = ["text-secondary", "text-accent"];

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-28">
      {/* Deep gradient base */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-primary to-background" />

      {/* Circuit background overlay */}
      <CircuitBackground />

      {/* Ambient glow orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/6 w-80 h-80 bg-secondary/8 rounded-full blur-[140px] animate-glow-pulse" />
        <div className="absolute bottom-1/3 right-1/5 w-96 h-96 bg-accent/8 rounded-full blur-[140px] animate-glow-pulse" style={{ animationDelay: "1.5s" }} />
        <div className="absolute top-2/3 left-1/2 w-64 h-64 bg-cta/6 rounded-full blur-[120px] animate-glow-pulse" style={{ animationDelay: "3s" }} />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-secondary/10 border border-secondary/30 rounded-full backdrop-blur-sm"
            >
              <Sparkles className="w-4 h-4 text-cta" />
              <span className="text-sm text-secondary font-medium tracking-wide">AI Authenticated · Trusted Across Africa</span>
            </motion.div>

            {/* Staggered headline */}
            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              {headlineWords.map((word, i) => (
                <motion.span
                  key={word}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.15, duration: 0.6 }}
                  className={`${headlineWordColors[i]} inline-block mr-3`}
                >
                  {word}
                </motion.span>
              ))}
              <motion.span
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                className="block mt-2"
              >
                Credentials for Africa
              </motion.span>
            </h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="text-xl text-muted-foreground leading-relaxed max-w-lg"
            >
              Create, issue, and verify tamper-proof digital certificates powered by AI. Trusted by educators and organizations across the continent.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link to="/signup">
                <Button variant="cta" size="lg" className="text-lg group">
                  Start for Free
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button variant="hero" size="lg" className="text-lg">
                  <Shield className="w-5 h-5" />
                  View Demo
                </Button>
              </Link>
            </motion.div>

            {/* Animated stat counters */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.4 }}
              className="flex items-center gap-8 pt-4"
            >
              <div>
                <p className="text-3xl font-bold text-secondary">
                  <AnimatedCounter target={10} suffix="K+" />
                </p>
                <p className="text-sm text-muted-foreground">Certificates Issued</p>
              </div>
              <div className="w-px h-12 bg-border" />
              <div>
                <p className="text-3xl font-bold text-accent">
                  <AnimatedCounter target={500} suffix="+" />
                </p>
                <p className="text-sm text-muted-foreground">Organizations</p>
              </div>
              <div className="w-px h-12 bg-border" />
              <div>
                <p className="text-3xl font-bold text-cta">99.9%</p>
                <p className="text-sm text-muted-foreground">Uptime</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Hero image with floating glow */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative"
          >
            <div className="relative">
              {/* Glow orb behind image */}
              <div className="absolute -inset-4 bg-gradient-to-br from-secondary/20 via-accent/10 to-cta/10 rounded-3xl blur-3xl animate-glow-pulse" />

              <img
                src={heroImage}
                alt="Digital Certificate Verification Platform"
                className="relative rounded-2xl shadow-2xl border border-secondary/20"
              />

              {/* Floating badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.2, type: "spring" }}
                className="absolute -bottom-6 -right-6 bg-card/90 border border-secondary/30 rounded-xl p-4 shadow-xl backdrop-blur-md"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-secondary/20 rounded-full flex items-center justify-center">
                    <Shield className="w-6 h-6 text-secondary" />
                  </div>
                  <div>
                    <p className="font-bold">Verified Secure</p>
                    <p className="text-sm text-muted-foreground">AI Protected</p>
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
