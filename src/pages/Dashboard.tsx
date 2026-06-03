import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  FileText, PlusCircle, Award, TrendingUp, Calendar, Users, ArrowUpRight,
} from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import EmptyState from "@/components/EmptyState";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";

const Dashboard = () => {
  const { user, profile } = useAuth();

  const { data: stats, isLoading } = useQuery({
    queryKey: ["dashboard-stats", user?.id],
    queryFn: async () => {
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

      const [certsRes, templatesRes, monthRes, recipientsRes] = await Promise.all([
        supabase.from("certificates").select("id", { count: "exact", head: true }),
        supabase.from("templates").select("id", { count: "exact", head: true }),
        supabase.from("certificates").select("id", { count: "exact", head: true }).gte("created_at", startOfMonth),
        supabase.from("certificates").select("recipient_email"),
      ]);

      const uniqueRecipients = new Set(recipientsRes.data?.map((r) => r.recipient_email) || []).size;

      return {
        totalCerts: certsRes.count || 0,
        totalTemplates: templatesRes.count || 0,
        thisMonth: monthRes.count || 0,
        totalRecipients: uniqueRecipients,
      };
    },
    enabled: !!user,
  });

  const { data: recentActivity = [] } = useQuery({
    queryKey: ["recent-activity", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("certificates")
        .select("id, recipient_name, course_name, created_at")
        .order("created_at", { ascending: false })
        .limit(6);
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const displayName = profile?.full_name || user?.email?.split("@")[0] || "there";

  const statCards = [
    { label: "Certificates Issued", value: stats?.totalCerts, icon: Award, color: "text-secondary", glow: "shadow-[0_0_30px_-12px_hsl(var(--secondary)/0.5)]", delta: "+12%" },
    { label: "Templates Created", value: stats?.totalTemplates, icon: FileText, color: "text-accent", glow: "shadow-[0_0_30px_-12px_hsl(var(--accent)/0.5)]", delta: "+3" },
    { label: "This Month", value: stats?.thisMonth, icon: Calendar, color: "text-cta", glow: "shadow-[0_0_30px_-12px_hsl(var(--cta)/0.5)]", delta: "+24%" },
    { label: "Total Recipients", value: stats?.totalRecipients, icon: Users, color: "text-secondary", glow: "shadow-[0_0_30px_-12px_hsl(var(--secondary)/0.5)]", delta: "+8%" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-3"
        >
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-secondary mb-1">Overview</p>
            <h1 className="text-3xl sm:text-4xl font-bold mb-1">
              Welcome back, <span className="text-gradient-aurora">{displayName}</span>
            </h1>
            <p className="text-sm text-muted-foreground">Here's what's happening with your credentials</p>
          </div>
          <Link to="/issue-certificate" className="hidden sm:block">
            <Button variant="cta" className="rounded-full">
              <PlusCircle className="w-4 h-4" /> Issue Certificate
            </Button>
          </Link>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              className={`group relative glass rounded-2xl p-4 sm:p-5 hover:-translate-y-1 transition-all duration-300 ${stat.glow}`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl bg-card/60 ring-1 ring-border flex items-center justify-center transition-transform duration-300 group-hover:scale-110`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <span className="text-[10px] font-bold text-secondary bg-secondary/10 px-1.5 py-0.5 rounded-full">
                  {stat.delta}
                </span>
              </div>
              <p className="text-2xl sm:text-3xl font-bold tracking-tight mb-0.5">
                {isLoading ? <span className="inline-block w-12 h-7 rounded animate-pulse bg-muted" /> : (stat.value ?? "—").toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Quick actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="glass rounded-2xl p-5 sm:p-6 lg:col-span-1"
          >
            <h2 className="text-lg font-bold mb-4 tracking-wide">Quick Actions</h2>
            <div className="space-y-2.5">
              <Link to="/issue-certificate" className="block">
                <div className="group flex items-center gap-3 p-3 rounded-xl bg-secondary/5 hover:bg-secondary/10 ring-1 ring-secondary/20 hover:ring-secondary/40 transition-all">
                  <div className="w-9 h-9 rounded-lg bg-secondary/15 flex items-center justify-center">
                    <PlusCircle className="w-4 h-4 text-secondary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold">Issue Certificate</p>
                    <p className="text-[11px] text-muted-foreground">Single or bulk</p>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-secondary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </div>
              </Link>
              <Link to="/template-gallery" className="block">
                <div className="group flex items-center gap-3 p-3 rounded-xl bg-accent/5 hover:bg-accent/10 ring-1 ring-accent/20 hover:ring-accent/40 transition-all">
                  <div className="w-9 h-9 rounded-lg bg-accent/15 flex items-center justify-center">
                    <FileText className="w-4 h-4 text-accent" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold">Browse Templates</p>
                    <p className="text-[11px] text-muted-foreground">14 futuristic designs</p>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </div>
              </Link>
              <Link to="/analytics" className="block">
                <div className="group flex items-center gap-3 p-3 rounded-xl bg-cta/5 hover:bg-cta/10 ring-1 ring-cta/20 hover:ring-cta/40 transition-all">
                  <div className="w-9 h-9 rounded-lg bg-cta/15 flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-cta" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold">View Analytics</p>
                    <p className="text-[11px] text-muted-foreground">Track engagement</p>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-cta group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </div>
              </Link>
            </div>
          </motion.div>

          {/* Activity timeline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="glass rounded-2xl p-5 sm:p-6 lg:col-span-2"
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold tracking-wide">Recent Activity</h2>
              <Link to="/certificates">
                <Button variant="ghost" size="sm" className="text-xs">View All →</Button>
              </Link>
            </div>
            {recentActivity.length === 0 ? (
              <EmptyState
                icon={Award}
                title="No certificates yet"
                description="Issue your first certificate and it will show up here."
                actionLabel="Issue Certificate"
                actionTo="/issue-certificate"
              />
            ) : (
              <div className="relative space-y-3">
                <div className="absolute left-[15px] top-2 bottom-2 w-px bg-gradient-to-b from-secondary/40 via-border to-transparent" />
                {recentActivity.map((activity, index) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.06 }}
                    className="relative flex items-center gap-3 pl-1"
                  >
                    <div className="relative z-10 w-8 h-8 rounded-full bg-card ring-1 ring-secondary/40 flex items-center justify-center">
                      <Award className="w-3.5 h-3.5 text-secondary" />
                    </div>
                    <div className="flex-1 min-w-0 flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{activity.recipient_name}</p>
                        <p className="text-xs text-muted-foreground truncate">{activity.course_name || "Certificate"}</p>
                      </div>
                      <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                        {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>

        {/* Upgrade banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="relative overflow-hidden rounded-2xl glass-strong border-beam p-5 sm:p-6"
        >
          <div className="absolute -top-16 -right-16 w-60 h-60 bg-cta/20 rounded-full blur-3xl pointer-events-none" />
          <div className="relative flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-cta/20 ring-1 ring-cta/40 flex items-center justify-center shrink-0">
              <TrendingUp className="w-6 h-6 text-cta" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-lg mb-0.5 tracking-wide">Unlock Premium Features</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">All 14 templates, AI generation, and unlimited custom uploads.</p>
            </div>
            <Button variant="cta" className="rounded-full">Upgrade Now</Button>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
