import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Award, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import NeonSpinner from "@/components/NeonSpinner";
import certificateMockup from "@/assets/certificate-mockup.jpg";

const RecipientPortfolio = () => {
  const { user } = useAuth();

  const { data: profile } = useQuery({
    queryKey: ["portfolio-profile", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("profiles")
        .select("full_name, avatar_url, created_at")
        .eq("id", user!.id)
        .single();
      return data;
    },
    enabled: !!user,
  });

  const { data: certificates = [], isLoading } = useQuery({
    queryKey: ["portfolio-certs", user?.email],
    queryFn: async () => {
      const { data } = await supabase
        .from("certificates")
        .select("id, course_name, recipient_name, issue_date, certificate_code, status")
        .eq("recipient_email", user!.email!)
        .eq("status", "issued")
        .order("issue_date", { ascending: false });
      return data ?? [];
    },
    enabled: !!user?.email,
  });

  const displayName = profile?.full_name || user?.email?.split("@")[0] || "User";
  const initial = displayName.charAt(0).toUpperCase();
  const memberSince = profile?.created_at
    ? format(new Date(profile.created_at), "MMM yyyy")
    : "";

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <NeonSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-secondary/20 to-accent/20 border-b border-border">
        <div className="container mx-auto px-6 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-20 h-20 rounded-full bg-secondary/20 flex items-center justify-center border-2 border-secondary">
                <span className="text-3xl font-bold text-secondary">{initial}</span>
              </div>
              <div>
                <h1 className="text-4xl font-bold mb-2">{displayName}</h1>
                <p className="text-muted-foreground text-lg">Your credential portfolio</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-secondary" />
                <span className="font-bold">{certificates.length} Certificate{certificates.length !== 1 ? "s" : ""}</span>
              </div>
              {memberSince && (
                <>
                  <div className="w-px h-6 bg-border" />
                  <span className="text-muted-foreground">Member since {memberSince}</span>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Certificates Grid */}
      <div className="container mx-auto px-6 py-16">
        {certificates.length === 0 ? (
          <div className="text-center py-20">
            <Award className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">No certificates yet</h2>
            <p className="text-muted-foreground">Certificates issued to your email will appear here.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {certificates.map((certificate, index) => (
              <motion.div
                key={certificate.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link to={`/certificate/${certificate.id}`}>
                  <Card className="overflow-hidden bg-card/80 backdrop-blur-sm hover:border-secondary/50 transition-all duration-300 group cursor-pointer">
                    <div className="relative aspect-[4/3] bg-muted overflow-hidden">
                      <img
                        src={certificateMockup}
                        alt={certificate.course_name || certificate.recipient_name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                        <Button variant="secondary" size="sm" className="w-full">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          View Certificate
                        </Button>
                      </div>
                    </div>
                    <div className="p-6 space-y-3">
                      <h3 className="font-bold text-lg">{certificate.course_name || "Certificate"}</h3>
                      <p className="text-sm text-muted-foreground">
                        Code: {certificate.certificate_code}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Issued on {format(new Date(certificate.issue_date), "MMMM d, yyyy")}
                      </p>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipientPortfolio;
