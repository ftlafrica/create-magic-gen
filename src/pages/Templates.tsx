import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PlusCircle, Edit, Copy, Trash2, Loader2 } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import certificateMockup from "@/assets/certificate-mockup.jpg";

const Templates = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: templates = [], isLoading } = useQuery({
    queryKey: ["templates", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("templates")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("templates").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["templates"] });
      toast.success("Template deleted");
    },
    onError: () => toast.error("Failed to delete template"),
  });

  const duplicateMutation = useMutation({
    mutationFn: async (template: any) => {
      const { id, created_at, updated_at, ...rest } = template;
      const { error } = await supabase
        .from("templates")
        .insert({ ...rest, name: `${rest.name} (Copy)` });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["templates"] });
      toast.success("Template duplicated");
    },
    onError: () => toast.error("Failed to duplicate template"),
  });

  // Count certificates per template
  const { data: certCounts = {} } = useQuery({
    queryKey: ["template-cert-counts", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("certificates")
        .select("template_id");
      if (error) throw error;
      const counts: Record<string, number> = {};
      data.forEach((c) => {
        if (c.template_id) counts[c.template_id] = (counts[c.template_id] || 0) + 1;
      });
      return counts;
    },
    enabled: !!user,
  });

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Certificate Templates</h1>
            <p className="text-muted-foreground text-lg">Create and manage your certificate designs</p>
          </div>
          <Link to="/template-editor">
            <Button variant="cta" size="lg">
              <PlusCircle className="w-5 h-5 mr-2" />
              Create New Template
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : templates.length === 0 ? (
          <Card className="p-12 text-center bg-card/80 backdrop-blur-sm">
            <p className="text-muted-foreground text-lg mb-4">No templates yet. Create your first one!</p>
            <Link to="/template-editor">
              <Button variant="cta">
                <PlusCircle className="w-5 h-5 mr-2" />
                Create Template
              </Button>
            </Link>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((template, index) => (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="overflow-hidden bg-card/80 backdrop-blur-sm hover:border-secondary/50 transition-all duration-300 group">
                  <div className="relative aspect-[4/3] bg-muted overflow-hidden">
                    <img
                      src={template.logo_url || certificateMockup}
                      alt={template.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                      <div className="flex gap-2 w-full">
                        <Button
                          variant="secondary"
                          size="sm"
                          className="flex-1"
                          onClick={() => navigate(`/template-editor/${template.id}`)}
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => duplicateMutation.mutate(template)}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                          onClick={() => deleteMutation.mutate(template.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-1">{template.name}</h3>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>{certCounts[template.id] || 0} certificates issued</span>
                      <span>{new Date(template.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Templates;
