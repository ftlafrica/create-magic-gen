import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Calendar, Building2, User, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import certificateMockup from "@/assets/certificate-mockup.jpg";

const Verify = () => {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="container mx-auto max-w-4xl">
        <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to home
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-secondary/20 border-2 border-secondary rounded-full mb-6"
            >
              <CheckCircle2 className="w-6 h-6 text-secondary" />
              <span className="text-2xl font-bold text-secondary">VERIFIED</span>
            </motion.div>
            <h1 className="text-4xl font-bold mb-2">Certificate Authenticated</h1>
            <p className="text-muted-foreground text-lg">This certificate has been verified as authentic</p>
          </div>

          <Card className="p-8 bg-card/80 backdrop-blur-lg border-secondary/30">
            <div className="mb-8">
              <img
                src={certificateMockup}
                alt="Verified Certificate"
                className="w-full rounded-lg shadow-xl"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-secondary/20 rounded-lg flex items-center justify-center shrink-0">
                    <User className="w-5 h-5 text-secondary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Recipient</p>
                    <p className="font-bold text-lg">Samuel Okonkwo</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center shrink-0">
                    <Building2 className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Issued By</p>
                    <p className="font-bold text-lg">African Tech Academy</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-cta/20 rounded-lg flex items-center justify-center shrink-0">
                    <Calendar className="w-5 h-5 text-cta" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Date Issued</p>
                    <p className="font-bold text-lg">March 15, 2025</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-secondary/20 rounded-lg flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-5 h-5 text-secondary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Achievement</p>
                    <p className="font-bold text-lg">Data Science Fundamentals</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 p-4 bg-secondary/10 border border-secondary/30 rounded-lg">
              <p className="text-sm text-muted-foreground text-center">
                <span className="font-bold text-foreground">Certificate ID:</span> AFC-2025-DS-1234567890
              </p>
            </div>
          </Card>

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              This certificate is secured with blockchain technology and can be verified at any time.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Verify;
