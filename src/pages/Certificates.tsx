import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Search,
  Eye,
  Ban,
  Loader2,
  RotateCcw,
  Award,
} from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const PAGE_SIZE = 20;

const Certificates = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [filterTemplate, setFilterTemplate] = useState("");
  const [page, setPage] = useState(0);

  // Fetch templates for filter dropdown
  const { data: templates = [] } = useQuery({
    queryKey: ["templates-names", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase.from("templates").select("id, name").order("name");
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  // Fetch certificates
  const { data, isLoading } = useQuery({
    queryKey: ["certificates", user?.id, search, filterTemplate, page],
    queryFn: async () => {
      let query = supabase
        .from("certificates")
        .select("*, templates(name)", { count: "exact" })
        .order("created_at", { ascending: false })
        .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);

      if (search.trim()) {
        query = query.or(`recipient_name.ilike.%${search.trim()}%,recipient_email.ilike.%${search.trim()}%,certificate_code.ilike.%${search.trim()}%`);
      }
      if (filterTemplate) {
        query = query.eq("template_id", filterTemplate);
      }

      const { data, error, count } = await query;
      if (error) throw error;
      return { certificates: data || [], total: count || 0 };
    },
    enabled: !!user,
  });

  const certificates = data?.certificates || [];
  const total = data?.total || 0;

  const revokeMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("certificates")
        .update({ status: "revoked" })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["certificates"] });
      toast.success("Certificate revoked");
    },
    onError: () => toast.error("Failed to revoke"),
  });

  const reinstateMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("certificates")
        .update({ status: "issued" })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["certificates"] });
      toast.success("Certificate reinstated");
    },
    onError: () => toast.error("Failed to reinstate"),
  });

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Issued Certificates</h1>
            <p className="text-muted-foreground text-lg">View and manage all certificates</p>
          </div>
          <Link to="/issue-certificate">
            <Button variant="cta" size="lg">
              Issue New Certificate
            </Button>
          </Link>
        </div>

        <Card className="p-6 bg-card/80 backdrop-blur-sm">
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or code..."
                className="pl-10 h-12"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(0); }}
              />
            </div>
            <select
              className="h-12 rounded-md border border-input bg-background px-4 min-w-[200px]"
              value={filterTemplate}
              onChange={(e) => { setFilterTemplate(e.target.value); setPage(0); }}
            >
              <option value="">All Templates</option>
              {templates.map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          ) : certificates.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              <p className="text-lg">No certificates found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-4 px-4 font-bold">Code</th>
                    <th className="text-left py-4 px-4 font-bold">Recipient</th>
                    <th className="text-left py-4 px-4 font-bold">Email</th>
                    <th className="text-left py-4 px-4 font-bold">Template</th>
                    <th className="text-left py-4 px-4 font-bold">Course</th>
                    <th className="text-left py-4 px-4 font-bold">Issue Date</th>
                    <th className="text-left py-4 px-4 font-bold">Status</th>
                    <th className="text-right py-4 px-4 font-bold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {certificates.map((cert: any, index: number) => (
                    <motion.tr
                      key={cert.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.03 }}
                      className="border-b border-border hover:bg-muted/50 transition-colors"
                    >
                      <td className="py-4 px-4 font-mono text-sm">{cert.certificate_code}</td>
                      <td className="py-4 px-4 font-medium">{cert.recipient_name}</td>
                      <td className="py-4 px-4 text-muted-foreground">{cert.recipient_email}</td>
                      <td className="py-4 px-4">{cert.templates?.name || "—"}</td>
                      <td className="py-4 px-4 text-muted-foreground">{cert.course_name || "—"}</td>
                      <td className="py-4 px-4 text-muted-foreground">{cert.issue_date}</td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          cert.status === "revoked"
                            ? "bg-destructive/20 text-destructive"
                            : "bg-secondary/20 text-secondary"
                        }`}>
                          {cert.status}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate(`/certificate/${cert.id}`)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          {cert.status === "issued" ? (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive hover:text-destructive"
                              onClick={() => revokeMutation.mutate(cert.id)}
                            >
                              <Ban className="w-4 h-4" />
                            </Button>
                          ) : (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-secondary hover:text-secondary"
                              onClick={() => reinstateMutation.mutate(cert.id)}
                            >
                              <RotateCcw className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="flex items-center justify-between mt-6">
            <p className="text-sm text-muted-foreground">
              Showing {certificates.length} of {total} certificates
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage(page - 1)}>
                Previous
              </Button>
              <Button variant="outline" size="sm" disabled={page >= totalPages - 1} onClick={() => setPage(page + 1)}>
                Next
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Certificates;
