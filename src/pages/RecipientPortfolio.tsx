import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Award, Download, Share2, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import certificateMockup from "@/assets/certificate-mockup.jpg";

const RecipientPortfolio = () => {
  const certificates = [
    { 
      id: 1, 
      course: "Data Science Fundamentals", 
      issuer: "African Tech Academy",
      date: "March 15, 2025",
      image: certificateMockup
    },
    { 
      id: 2, 
      course: "Product Management Essentials", 
      issuer: "Business Leaders Institute",
      date: "February 10, 2025",
      image: certificateMockup
    },
    { 
      id: 3, 
      course: "Digital Marketing Mastery", 
      issuer: "Marketing Pro Academy",
      date: "January 5, 2025",
      image: certificateMockup
    },
  ];

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
                <span className="text-3xl font-bold text-secondary">S</span>
              </div>
              <div>
                <h1 className="text-4xl font-bold mb-2">Samuel Okonkwo</h1>
                <p className="text-muted-foreground text-lg">Welcome to your credential portfolio</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-secondary" />
                <span className="font-bold">{certificates.length} Certificates</span>
              </div>
              <div className="w-px h-6 bg-border" />
              <span className="text-muted-foreground">Member since Jan 2025</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Certificates Grid */}
      <div className="container mx-auto px-6 py-16">
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
                      src={certificate.image}
                      alt={certificate.course}
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
                    <h3 className="font-bold text-lg">{certificate.course}</h3>
                    <p className="text-sm text-muted-foreground">
                      {certificate.issuer}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Issued on {certificate.date}
                    </p>
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecipientPortfolio;
