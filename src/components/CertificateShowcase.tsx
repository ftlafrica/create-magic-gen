import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import certificateMockup from "@/assets/certificate-mockup.jpg";

const CertificateShowcase = () => {
  return (
    <section className="py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-background via-primary/50 to-background" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <h2 className="text-4xl md:text-6xl font-bold leading-tight">
              Beautiful Certificates That{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-accent">
                Stand Out
              </span>
            </h2>
            
            <p className="text-xl text-muted-foreground leading-relaxed">
              Every certificate is professionally designed, fully customizable, and instantly verifiable. Make your credentials memorable.
            </p>

            <div className="space-y-4">
              {[
                "AI-suggested color palettes match your brand",
                "Drag-and-drop editor for complete control",
                "Professional templates ready to use",
                "Blockchain-verified authenticity"
              ].map((item, index) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-6 h-6 rounded-full bg-secondary/20 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4 text-secondary" />
                  </div>
                  <span className="text-lg">{item}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-secondary/30 to-accent/30 rounded-2xl blur-3xl" />
              <motion.img
                src={certificateMockup}
                alt="Certificate Template"
                className="relative rounded-2xl shadow-2xl border border-secondary/30"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CertificateShowcase;
