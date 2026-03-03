import { motion } from "framer-motion";
import { Palette, Upload, Shield, Share2, BarChart3, Users } from "lucide-react";
import { Card } from "@/components/ui/card";

const features = [
  {
    icon: Palette,
    title: "AI-Enhanced Templates",
    description: "Upload your logo and let AI suggest beautiful color palettes. Drag-and-drop editor for complete customization.",
    color: "text-secondary",
    gradient: "from-secondary/20 to-transparent"
  },
  {
    icon: Upload,
    title: "Bulk Issuance",
    description: "Issue single certificates or upload CSV files to create hundreds of certificates in seconds.",
    color: "text-accent",
    gradient: "from-accent/20 to-transparent"
  },
  {
    icon: Shield,
    title: "Secure Verification",
    description: "Every certificate is blockchain-verified with a unique QR code and public verification link.",
    color: "text-cta",
    gradient: "from-cta/20 to-transparent"
  },
  {
    icon: Share2,
    title: "One-Click Sharing",
    description: "Recipients can share their verified achievements to LinkedIn and other platforms instantly.",
    color: "text-secondary",
    gradient: "from-secondary/20 to-transparent"
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description: "Track certificate views, shares, and engagement with comprehensive analytics.",
    color: "text-accent",
    gradient: "from-accent/20 to-transparent"
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description: "Invite team members as editors to help manage your organization's certificates.",
    color: "text-cta",
    gradient: "from-cta/20 to-transparent"
  }
];

const Features = () => {
  return (
    <section id="features" className="py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-secondary/5 to-transparent" />
      
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16 space-y-4"
        >
          <h2 className="text-4xl md:text-6xl font-bold">
            Everything You Need to Issue{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-accent">
              Professional Certificates
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Powerful features designed for educators, trainers, and organizations who want to issue verifiable credentials.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-8 bg-card/50 backdrop-blur-sm border-border glow-card group h-full">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className={`w-8 h-8 ${feature.color}`} />
                </div>
                <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
