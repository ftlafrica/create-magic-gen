import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Share2, Download, Copy, CheckCircle2, Building2, Calendar, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import certificateMockup from "@/assets/certificate-mockup.jpg";
import { toast } from "sonner";

const CertificateDetail = () => {
  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Verification link copied to clipboard!");
  };

  const handleShareLinkedIn = () => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent("I'm proud to share that I've completed Data Science Fundamentals!");
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}&summary=${text}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="container mx-auto max-w-5xl">
        <Link to="/portfolio" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to portfolio
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Certificate Display */}
          <Card className="p-8 bg-card/80 backdrop-blur-lg border-secondary/30">
            <img
              src={certificateMockup}
              alt="Certificate"
              className="w-full rounded-lg shadow-2xl mb-8"
            />

            {/* Action Buttons */}
            <div className="grid md:grid-cols-3 gap-4">
              <Button 
                variant="hero" 
                size="lg" 
                className="w-full"
                onClick={handleShareLinkedIn}
              >
                <Share2 className="w-5 h-5 mr-2" />
                Share to LinkedIn
              </Button>
              <Button 
                variant="accent" 
                size="lg" 
                className="w-full"
                onClick={handleCopyLink}
              >
                <Copy className="w-5 h-5 mr-2" />
                Copy Verification Link
              </Button>
              <Button variant="outline" size="lg" className="w-full">
                <Download className="w-5 h-5 mr-2" />
                Download PDF
              </Button>
            </div>
          </Card>

          {/* Certificate Details */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6 bg-card/80 backdrop-blur-sm">
              <h2 className="text-2xl font-bold mb-6">Certificate Details</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-secondary/20 rounded-lg flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-5 h-5 text-secondary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Achievement</p>
                    <p className="font-bold text-lg">Data Science Fundamentals</p>
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

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-cta/20 rounded-lg flex items-center justify-center shrink-0">
                    <Calendar className="w-5 h-5 text-cta" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Issue Date</p>
                    <p className="font-bold text-lg">March 15, 2025</p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-card/80 backdrop-blur-sm">
              <h2 className="text-2xl font-bold mb-6">About the Issuer</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-secondary rounded-lg flex items-center justify-center">
                    <span className="text-background font-bold text-2xl">A</span>
                  </div>
                  <div>
                    <p className="font-bold text-lg">African Tech Academy</p>
                    <p className="text-sm text-muted-foreground">Lagos, Nigeria</p>
                  </div>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  A leading institution for technology education in Africa, dedicated to empowering the next generation of tech professionals through world-class training programs.
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">Visit Website</Button>
                  <Button variant="outline" size="sm">View All Certificates</Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Verification Info */}
          <Card className="p-6 bg-secondary/10 border-secondary/30">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-secondary" />
              <div className="flex-1">
                <p className="font-bold mb-1">Verified & Secure</p>
                <p className="text-sm text-muted-foreground">
                  This certificate is blockchain-verified and can be independently authenticated.
                </p>
              </div>
              <Button variant="secondary" size="sm">Verify Now</Button>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default CertificateDetail;
