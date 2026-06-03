import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { MouseEvent } from "react";
import certificateMockup from "@/assets/certificate-mockup.jpg";

const TiltCard = ({ src }: { src: string }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-50, 50], [8, -8]), { stiffness: 150, damping: 18 });
  const rotateY = useSpring(useTransform(x, [-50, 50], [-8, 8]), { stiffness: 150, damping: 18 });

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set(e.clientX - rect.left - rect.width / 2);
    y.set(e.clientY - rect.top - rect.height / 2);
  };
  const onLeave = () => { x.set(0); y.set(0); };

  return (
    <motion.div
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ rotateX, rotateY, transformPerspective: 1000 }}
      className="relative rounded-2xl will-change-transform"
    >
      <div className="absolute -inset-6 bg-gradient-to-br from-secondary/30 via-accent/20 to-cta/15 rounded-3xl blur-3xl animate-glow-pulse" />
      <div className="relative rounded-2xl overflow-hidden border-beam">
        <img
          src={src}
          alt="Certificate Template"
          className="relative rounded-2xl shadow-2xl w-full"
        />
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-background/40 via-transparent to-transparent" />
      </div>
    </motion.div>
  );
};

const CertificateShowcase = () => {
  return (
    <section className="py-24 sm:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-background via-primary/40 to-background" />

      <div className="container mx-auto px-5 sm:px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 sm:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-xs tracking-wider uppercase text-accent">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-glow-pulse" />
              Design Studio
            </div>

            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-[1.05]">
              Beautiful certificates that{" "}
              <span className="text-gradient-aurora">stand out</span>
            </h2>

            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              Every certificate is professionally designed, fully customizable, and instantly verifiable. Make your credentials unforgettable.
            </p>

            <div className="space-y-3 sm:space-y-4">
              {[
                "AI-suggested color palettes match your brand",
                "Drag-and-drop editor for complete control",
                "14+ futuristic templates ready to use",
                "Cryptographically verified authenticity",
              ].map((item, index) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-7 h-7 rounded-full bg-secondary/15 ring-1 ring-secondary/40 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4 text-secondary" />
                  </div>
                  <span className="text-sm sm:text-base">{item}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <TiltCard src={certificateMockup} />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CertificateShowcase;
