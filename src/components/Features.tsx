import { motion } from "framer-motion";
import { Palette, Upload, Shield, Share2, BarChart3, Users } from "lucide-react";
import MagicCard from "@/components/effects/MagicCard";

const features = [
  {
    icon: Palette,
    title: "AI-Enhanced Templates",
    description: "Upload your logo and let AI suggest beautiful color palettes. Drag-and-drop editor for total control.",
    color: "text-secondary",
    ring: "ring-secondary/30",
    glow: "hsl(var(--secondary) / 0.18)",
    span: "md:col-span-2",
  },
  {
    icon: Upload,
    title: "Bulk Issuance",
    description: "Issue one certificate or upload a CSV to create hundreds in seconds.",
    color: "text-accent",
    ring: "ring-accent/30",
    glow: "hsl(var(--accent) / 0.18)",
    span: "",
  },
  {
    icon: Shield,
    title: "Secure Verification",
    description: "Every certificate is cryptographically verified with a unique QR code and public link.",
    color: "text-cta",
    ring: "ring-cta/30",
    glow: "hsl(var(--cta) / 0.18)",
    span: "",
  },
  {
    icon: Share2,
    title: "One-Click Sharing",
    description: "Recipients share verified achievements on LinkedIn and beyond, instantly.",
    color: "text-secondary",
    ring: "ring-secondary/30",
    glow: "hsl(var(--secondary) / 0.18)",
    span: "",
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description: "Track views, shares, and engagement across every credential you issue.",
    color: "text-accent",
    ring: "ring-accent/30",
    glow: "hsl(var(--accent) / 0.18)",
    span: "md:col-span-2",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description: "Invite editors to manage your organization's certificates together.",
    color: "text-cta",
    ring: "ring-cta/30",
    glow: "hsl(var(--cta) / 0.18)",
    span: "md:col-span-3",
  },
];

const Features = () => {
  return (
    <section id="features" className="py-24 sm:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-secondary/5 to-transparent pointer-events-none" />

      <div className="container mx-auto px-5 sm:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14 sm:mb-16 space-y-4 max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-xs tracking-wider uppercase text-secondary">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-glow-pulse" />
            Capabilities
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight">
            Everything you need to issue{" "}
            <span className="text-gradient-aurora">professional credentials</span>
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground">
            Powerful tools for educators, trainers, and organizations.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.07, duration: 0.5 }}
              className={feature.span}
            >
              <MagicCard
                gradientColor={feature.glow}
                className="h-full p-6 sm:p-7 min-h-[210px]"
              >
                <div className={`w-12 h-12 rounded-xl bg-card/60 ring-1 ${feature.ring} flex items-center justify-center mb-5 shadow-inner transition-transform duration-300 group-hover:scale-110`}>
                  <feature.icon className={`w-6 h-6 ${feature.color}`} />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold mb-2 tracking-wide">{feature.title}</h3>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{feature.description}</p>
              </MagicCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
