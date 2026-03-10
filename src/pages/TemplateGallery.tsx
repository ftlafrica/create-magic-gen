import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Lock, Sparkles, ArrowLeft, Crown, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import DashboardLayout from "@/components/DashboardLayout";
import { prebuiltTemplates, type PrebuiltTemplate } from "@/data/prebuiltTemplates";

const TemplateGallery = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedTemplate, setSelectedTemplate] = useState<PrebuiltTemplate | null>(null);
  const [cloning, setCloning] = useState(false);

  // For now, all users are treated as "free" tier
  const userTier: "free" | "premium" | "business" = "free";

  const canUseTemplate = (template: PrebuiltTemplate) => {
    if (template.tier === "free") return true;
    return (userTier as string) === "premium" || (userTier as string) === "business";
  };

  const handleUseTemplate = async (template: PrebuiltTemplate) => {
    if (!user) return;
    if (!canUseTemplate(template)) {
      toast.error("Upgrade to Premium to use this template");
      return;
    }

    setCloning(true);
    const { error } = await supabase.from("templates").insert({
      name: template.name,
      description: template.description,
      owner_id: user.id,
      background_color: template.backgroundColor,
      layout_json: {
        fontFamily: template.fontFamily,
        fontSize: template.fontSize,
        textColor: template.textColor,
        alignment: template.alignment,
        borderStyle: template.borderStyle,
      } as any,
    });

    setCloning(false);
    if (error) {
      toast.error("Failed to add template");
      return;
    }
    toast.success(`"${template.name}" added to your templates`);
    setSelectedTemplate(null);
    navigate("/templates");
  };

  const freeTemplates = prebuiltTemplates.filter((t) => t.tier === "free");
  const premiumTemplates = prebuiltTemplates.filter((t) => t.tier === "premium");

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Template Gallery</h1>
            <p className="text-muted-foreground text-lg">
              Choose from {prebuiltTemplates.length} professionally designed certificate templates
            </p>
          </div>
          <Link to="/templates">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              My Templates
            </Button>
          </Link>
        </div>

        {/* Free Templates */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-2xl font-bold">Free Templates</h2>
            <Badge variant="secondary">Free</Badge>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {freeTemplates.map((template, index) => (
              <TemplateCard
                key={template.id}
                template={template}
                index={index}
                locked={false}
                onClick={() => setSelectedTemplate(template)}
              />
            ))}
          </div>
        </div>

        {/* Premium Templates */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-2xl font-bold">Premium Templates</h2>
            <Badge className="bg-cta text-cta-foreground">
              <Crown className="w-3 h-3 mr-1" />
              Premium
            </Badge>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {premiumTemplates.map((template, index) => (
              <TemplateCard
                key={template.id}
                template={template}
                index={index}
                locked={!canUseTemplate(template)}
                onClick={() => setSelectedTemplate(template)}
              />
            ))}
          </div>
        </div>

        {/* Tier Info Banner */}
        {userTier === "free" && (
          <Card className="p-6 bg-gradient-to-r from-cta/10 to-accent/10 border-cta/30">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-cta" />
                  Unlock All Templates
                </h3>
                <p className="text-muted-foreground mt-1">
                  Upgrade to Premium to access all 14 templates, upload up to 7 custom templates, and get 3 AI generation credits.
                </p>
              </div>
              <Link to="/#pricing">
                <Button variant="cta" size="lg">
                  View Plans
                </Button>
              </Link>
            </div>
          </Card>
        )}
      </div>

      {/* Preview Modal */}
      <Dialog open={!!selectedTemplate} onOpenChange={() => setSelectedTemplate(null)}>
        {selectedTemplate && (
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-xl">
                {selectedTemplate.name}
                {selectedTemplate.tier === "premium" && (
                  <Badge className="bg-cta text-cta-foreground">
                    <Crown className="w-3 h-3 mr-1" />
                    Premium
                  </Badge>
                )}
              </DialogTitle>
              <DialogDescription>{selectedTemplate.description}</DialogDescription>
            </DialogHeader>

            {/* Certificate Preview */}
            <div className="my-4">
              <div
                className="rounded-lg border-2 border-border aspect-[1.414/1] flex flex-col items-center justify-center p-8 relative overflow-hidden"
                style={{ backgroundColor: selectedTemplate.backgroundColor }}
              >
                {/* Decorative border glow */}
                <div
                  className="absolute inset-2 rounded-lg border-2 opacity-30"
                  style={{ borderColor: selectedTemplate.accentColor }}
                />
                <h2
                  className="text-2xl md:text-3xl font-bold mb-3"
                  style={{
                    fontFamily: selectedTemplate.fontFamily,
                    color: selectedTemplate.textColor,
                    textAlign: selectedTemplate.alignment,
                    fontSize: `${selectedTemplate.fontSize * 1.2}px`,
                  }}
                >
                  Certificate of Completion
                </h2>
                <p
                  className="text-sm md:text-base mb-1"
                  style={{ color: selectedTemplate.textColor, opacity: 0.8 }}
                >
                  This certifies that
                </p>
                <p
                  className="text-xl md:text-2xl font-bold mb-3"
                  style={{ color: selectedTemplate.accentColor }}
                >
                  John Doe
                </p>
                <p
                  className="text-sm"
                  style={{ color: selectedTemplate.textColor, opacity: 0.7 }}
                >
                  has successfully completed <strong>Web Development</strong>
                </p>
                <p
                  className="mt-6 text-xs"
                  style={{ color: selectedTemplate.textColor, opacity: 0.5 }}
                >
                  Issued on Jan 1, 2026 • ID: CERT-001
                </p>
              </div>
            </div>

            <DialogFooter>
              {canUseTemplate(selectedTemplate) ? (
                <Button
                  variant="cta"
                  size="lg"
                  onClick={() => handleUseTemplate(selectedTemplate)}
                  disabled={cloning}
                >
                  {cloning ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Sparkles className="w-4 h-4 mr-2" />
                  )}
                  Use This Template
                </Button>
              ) : (
                <Link to="/#pricing">
                  <Button variant="cta" size="lg">
                    <Lock className="w-4 h-4 mr-2" />
                    Upgrade to Unlock
                  </Button>
                </Link>
              )}
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </DashboardLayout>
  );
};

// Template Card Component
const TemplateCard = ({
  template,
  index,
  locked,
  onClick,
}: {
  template: PrebuiltTemplate;
  index: number;
  locked: boolean;
  onClick: () => void;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.05 }}
  >
    <Card
      className="overflow-hidden bg-card/80 backdrop-blur-sm hover:border-secondary/50 transition-all duration-300 cursor-pointer group"
      onClick={onClick}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        {/* Mini certificate preview */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center p-4"
          style={{ background: template.thumbnailGradient }}
        >
          <div
            className="absolute inset-3 rounded border opacity-20"
            style={{ borderColor: template.accentColor }}
          />
          <p
            className="text-[10px] font-bold uppercase tracking-widest opacity-70"
            style={{ color: template.textColor }}
          >
            Certificate of Completion
          </p>
          <p
            className="text-sm font-bold mt-1"
            style={{ color: template.accentColor }}
          >
            Recipient Name
          </p>
          <p
            className="text-[8px] mt-1 opacity-50"
            style={{ color: template.textColor }}
          >
            Course Name • Date
          </p>
        </div>

        {/* Lock overlay for premium */}
        {locked && (
          <div className="absolute inset-0 bg-background/60 backdrop-blur-[2px] flex items-center justify-center">
            <div className="bg-card/90 rounded-full p-3 border border-cta/30">
              <Lock className="w-5 h-5 text-cta" />
            </div>
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-background/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <Button variant="secondary" size="sm">
            Preview
          </Button>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-bold text-sm">{template.name}</h3>
          {template.tier === "free" ? (
            <Badge variant="secondary" className="text-[10px]">Free</Badge>
          ) : (
            <Badge className="bg-cta/20 text-cta border-cta/30 text-[10px]">Premium</Badge>
          )}
        </div>
        <p className="text-xs text-muted-foreground line-clamp-2">{template.description}</p>
      </div>
    </Card>
  </motion.div>
);

export default TemplateGallery;
