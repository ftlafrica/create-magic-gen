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
import EmptyState from "@/components/EmptyState";
import StatusPill from "@/components/StatusPill";
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
  const [filterCourse, setFilterCourse] = useState("");
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
    queryKey: ["certificates", user?.id, search, filterTemplate, filterCourse, page],
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
      if (filterCourse) {
        query = query.ilike("course_name", `%${filterCourse}%`);
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
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-secondary mb-1">Credentials</p>
            <h1 className="text-3xl sm:text-4xl font-bold mb-1">Issued Certificates</h1>
            <p className="text-sm text-muted-foreground">View and manage every certificate you've issued</p>
          </div>
          <Link to="/issue-certificate">
            <Button variant="cta" className="rounded-full">
              Issue New Certificate
            </Button>
          </Link>
        </div>

        <div className="glass rounded-2xl p-5 sm:p-6">
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or code..."
                className="pl-10 h-12"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(0); }}
              />
            </div>
            <select
              className="h-12 rounded-md border border-input bg-background px-4 min-w-[180px]"
              value={filterTemplate}
              onChange={(e) => { setFilterTemplate(e.target.value); setPage(0); }}
            >
              <option value="">All Templates</option>
              {templates.map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
            <Input
              placeholder="Filter by course..."
              className="h-12 min-w-[180px] max-w-[220px]"
              value={filterCourse}
              onChange={(e) => { setFilterCourse(e.target.value); setPage(0); }}
            />
          </div>

          {isLoading ? (
            <div className="space-y-2 py-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-14 rounded-lg bg-muted/30 animate-pulse" />
              ))}
            </div>
          ) : certificates.length === 0 ? (
            <EmptyState
              icon={Award}
              title="No certificates found"
              description="Issue your first certificate to get started."
              actionLabel="Issue Certificate"
              actionTo="/issue-certificate"
            />
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
                        <StatusPill status={cert.status} />
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
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-destructive hover:text-destructive"
                                >
                                  <Ban className="w-4 h-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Revoke certificate?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This will revoke the certificate for {cert.recipient_name}. The certificate will be marked as invalid.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => revokeMutation.mutate(cert.id)}>
                                    Revoke
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
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
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Certificates;
