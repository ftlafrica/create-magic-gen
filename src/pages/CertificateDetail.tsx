import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Share2, Download, Copy, CheckCircle2, Building2, Calendar, ArrowLeft, User, XCircle } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import certificateMockup from "@/assets/certificate-mockup.jpg";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import NeonSpinner from "@/components/NeonSpinner";
import { Badge } from "@/components/ui/badge";
import { useEffect } from "react";

const CertificateDetail = () => {
  const { id } = useParams<{ id: string }>();

  const { data: certificate, isLoading, error } = useQuery({
    queryKey: ["certificate-detail", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("certificates")
        .select("*")
        .eq("id", id!)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  const { data: issuerProfile } = useQuery({
    queryKey: ["issuer-profile", certificate?.issuer_id],
    queryFn: async () => {
      const { data } = await supabase
        .from("profiles")
        .select("full_name, organization, avatar_url")
        .eq("id", certificate!.issuer_id)
        .single();
      return data;
    },
    enabled: !!certificate?.issuer_id,
  });

  // Log view
  useEffect(() => {
    if (!certificate) return;
    supabase.from("certificate_views").insert({
      certificate_id: certificate.id,
      user_agent: navigator.userAgent,
    });
  }, [certificate?.id]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Verification link copied to clipboard!");
  };

  const handleShareLinkedIn = () => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(
      `I'm proud to share that I've completed ${certificate?.course_name || "a certification"}!`
    );
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}&summary=${text}`, "_blank");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <NeonSpinner />
      </div>
    );
  }

  if (error || !certificate) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <XCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Certificate Not Found</h2>
          <p className="text-muted-foreground mb-6">This certificate doesn't exist or you don't have access.</p>
          <Link to="/verify">
            <Button variant="secondary">Go to Verification</Button>
          </Link>
        </Card>
      </div>
    );
  }

  const issuerName = issuerProfile?.organization || issuerProfile?.full_name || "Unknown Issuer";
  const issuerInitial = issuerName.charAt(0).toUpperCase();
  const isRevoked = certificate.status === "revoked";

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
          {/* Revoked Banner */}
          {isRevoked && (
            <Card className="p-4 bg-destructive/10 border-destructive/30">
              <div className="flex items-center gap-3">
                <XCircle className="w-6 h-6 text-destructive" />
                <p className="font-bold text-destructive">This certificate has been revoked and is no longer valid.</p>
              </div>
            </Card>
          )}

          {/* Certificate Display */}
          <Card className="p-8 bg-card/80 backdrop-blur-lg border-secondary/30">
            <img
              src={certificateMockup}
              alt="Certificate"
              className="w-full rounded-lg shadow-2xl mb-8"
            />

            {/* Action Buttons */}
            <div className="grid md:grid-cols-3 gap-4">
              <Button variant="hero" size="lg" className="w-full" onClick={handleShareLinkedIn}>
                <Share2 className="w-5 h-5 mr-2" />
                Share to LinkedIn
              </Button>
              <Button variant="accent" size="lg" className="w-full" onClick={handleCopyLink}>
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
                    <p className="font-bold text-lg">{certificate.course_name || "Certificate"}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center shrink-0">
                    <User className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Recipient</p>
                    <p className="font-bold text-lg">{certificate.recipient_name}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-cta/20 rounded-lg flex items-center justify-center shrink-0">
                    <Calendar className="w-5 h-5 text-cta" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Issue Date</p>
                    <p className="font-bold text-lg">{format(new Date(certificate.issue_date), "MMMM d, yyyy")}</p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-card/80 backdrop-blur-sm">
              <h2 className="text-2xl font-bold mb-6">About the Issuer</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-secondary rounded-lg flex items-center justify-center">
                    <span className="text-background font-bold text-2xl">{issuerInitial}</span>
                  </div>
                  <div>
                    <p className="font-bold text-lg">{issuerName}</p>
                    {issuerProfile?.organization && issuerProfile.full_name && (
                      <p className="text-sm text-muted-foreground">by {issuerProfile.full_name}</p>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Verification Info */}
          <Card className={`p-6 ${isRevoked ? "bg-destructive/10 border-destructive/30" : "bg-secondary/10 border-secondary/30"}`}>
            <div className="flex items-center gap-3">
              {isRevoked ? (
                <XCircle className="w-6 h-6 text-destructive" />
              ) : (
                <CheckCircle2 className="w-6 h-6 text-secondary" />
              )}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-bold">{isRevoked ? "Revoked" : "Verified & Secure"}</p>
                  <Badge variant={isRevoked ? "destructive" : "secondary"}>
                    {certificate.certificate_code}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {isRevoked
                    ? "This certificate has been revoked by the issuer."
                    : "This certificate can be independently verified using the code above."}
                </p>
              </div>
              <Link to={`/verify?code=${certificate.certificate_code}`}>
                <Button variant="secondary" size="sm">Verify</Button>
              </Link>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default CertificateDetail;
