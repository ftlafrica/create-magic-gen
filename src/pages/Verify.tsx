import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  XCircle,
  Calendar,
  User,
  Award,
  ArrowLeft,
  Search,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const Verify = () => {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [cert, setCert] = useState<any>(null);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    setLoading(true);
    setSearched(true);
    setCert(null);

    // Search by certificate_code or id
    let { data, error } = await supabase
      .from("certificates")
      .select("id, certificate_code, recipient_name, course_name, issue_date, status, created_at")
      .or(`certificate_code.eq.${q},id.eq.${q.length === 36 ? q : "00000000-0000-0000-0000-000000000000"}`)
      .maybeSingle();

    if (!error && data) {
      setCert(data);
      // Log the verification view (fire-and-forget)
      supabase.from("certificate_views").insert({
        certificate_id: data.id,
        viewer_ip: null,
        user_agent: navigator.userAgent,
      }).then(() => {});
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="container mx-auto max-w-4xl">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to home
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-2">Verify Certificate</h1>
            <p className="text-muted-foreground text-lg">
              Enter a certificate code or ID to verify its authenticity
            </p>
          </div>

          <Card className="p-8 bg-card/80 backdrop-blur-sm">
            <form onSubmit={handleVerify} className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Enter certificate code (e.g. a1b2c3d4e5f6)"
                  className="pl-10 h-12"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  maxLength={100}
                />
              </div>
              <Button type="submit" variant="cta" size="lg" disabled={loading || !query.trim()}>
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  "Verify"
                )}
              </Button>
            </form>
          </Card>

          {searched && !loading && cert && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              {cert.status === "revoked" ? (
                <div className="text-center mb-6">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring" }}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-destructive/20 border-2 border-destructive rounded-full mb-4"
                  >
                    <AlertTriangle className="w-6 h-6 text-destructive" />
                    <span className="text-2xl font-bold text-destructive">REVOKED</span>
                  </motion.div>
                  <p className="text-muted-foreground">This certificate has been revoked by the issuer.</p>
                </div>
              ) : (
                <div className="text-center mb-6">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring" }}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-secondary/20 border-2 border-secondary rounded-full mb-4"
                  >
                    <CheckCircle2 className="w-6 h-6 text-secondary" />
                    <span className="text-2xl font-bold text-secondary">VERIFIED</span>
                  </motion.div>
                  <p className="text-muted-foreground">This certificate has been verified as authentic.</p>
                </div>
              )}

              <Card className="p-8 bg-card/80 backdrop-blur-lg border-secondary/30">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-secondary/20 rounded-lg flex items-center justify-center shrink-0">
                      <User className="w-5 h-5 text-secondary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Recipient</p>
                      <p className="font-bold text-lg">{cert.recipient_name}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center shrink-0">
                      <Award className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Achievement</p>
                      <p className="font-bold text-lg">{cert.course_name || "—"}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-cta/20 rounded-lg flex items-center justify-center shrink-0">
                      <Calendar className="w-5 h-5 text-cta" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Date Issued</p>
                      <p className="font-bold text-lg">
                        {new Date(cert.issue_date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 p-4 bg-secondary/10 border border-secondary/30 rounded-lg">
                  <p className="text-sm text-muted-foreground text-center">
                    <span className="font-bold text-foreground">Certificate Code:</span>{" "}
                    {cert.certificate_code}
                  </p>
                </div>
              </Card>
            </motion.div>
          )}

          {searched && !loading && !cert && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Card className="p-12 text-center bg-card/80 backdrop-blur-sm">
                <XCircle className="w-16 h-16 mx-auto mb-4 text-destructive" />
                <h2 className="text-2xl font-bold mb-2">Certificate Not Found</h2>
                <p className="text-muted-foreground">
                  No certificate matches that code. Please double-check and try again.
                </p>
              </Card>
            </motion.div>
          )}

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Certificates are secured and can be verified at any time using their unique code.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Verify;
