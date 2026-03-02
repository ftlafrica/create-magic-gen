import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, Shield, Sparkles } from "lucide-react";
import heroImage from "@/assets/hero-certificate.jpg";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-primary to-background">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-secondary rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent rounded-full blur-[120px] animate-pulse delay-1000" />
        </div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-secondary/10 border border-secondary/30 rounded-full"
            >
              <Sparkles className="w-4 h-4 text-secondary" />
              <span className="text-sm text-secondary font-medium">AI Authenticated · Trusted Across Africa</span>
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-accent">
                AI Authenticated
              </span>{" "}
              Credentials for Africa
            </h1>

            <p className="text-xl text-muted-foreground leading-relaxed">
              Create, issue, and verify tamper-proof digital certificates powered by AI. Trusted by educators and organizations across the continent.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/signup">
                <Button variant="cta" size="lg" className="text-lg">
                  Start for Free
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button variant="hero" size="lg" className="text-lg">
                  <Shield className="w-5 h-5" />
                  View Demo
                </Button>
              </Link>
            </div>

            <div className="flex items-center gap-8 pt-4">
              <div>
                <p className="text-3xl font-bold text-secondary">10K+</p>
                <p className="text-sm text-muted-foreground">Certificates Issued</p>
              </div>
              <div className="w-px h-12 bg-border" />
              <div>
                <p className="text-3xl font-bold text-accent">500+</p>
                <p className="text-sm text-muted-foreground">Organizations</p>
              </div>
              <div className="w-px h-12 bg-border" />
              <div>
                <p className="text-3xl font-bold text-cta">99.9%</p>
                <p className="text-sm text-muted-foreground">Uptime</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-secondary/20 rounded-2xl blur-3xl" />
              <img
                src={heroImage}
                alt="Digital Certificate Verification"
                className="relative rounded-2xl shadow-2xl border border-secondary/20"
              />
              <div className="absolute -bottom-6 -right-6 bg-card border border-secondary/30 rounded-xl p-4 shadow-xl backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-secondary/20 rounded-full flex items-center justify-center">
                    <Shield className="w-6 h-6 text-secondary" />
                  </div>
                  <div>
                    <p className="font-bold">Verified Secure</p>
                    <p className="text-sm text-muted-foreground">Blockchain Protected</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
