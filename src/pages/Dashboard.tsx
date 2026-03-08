import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  FileText,
  PlusCircle,
  Award,
  TrendingUp,
  Calendar,
  Users,
  Loader2,
} from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
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
        .select("recipient_name, course_name, created_at")
        .order("created_at", { ascending: false })
        .limit(5);
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const displayName = profile?.full_name || user?.email?.split("@")[0] || "there";

  const statCards = [
    { label: "Certificates Issued", value: stats?.totalCerts ?? "—", icon: Award, color: "text-secondary" },
    { label: "Templates Created", value: stats?.totalTemplates ?? "—", icon: FileText, color: "text-accent" },
    { label: "This Month", value: stats?.thisMonth ?? "—", icon: Calendar, color: "text-cta" },
    { label: "Total Recipients", value: stats?.totalRecipients ?? "—", icon: Users, color: "text-secondary" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Welcome back, {displayName}!</h1>
          <p className="text-muted-foreground text-lg">Here's what's happening with your certificates</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6 bg-card/80 backdrop-blur-sm border-border glow-card">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-muted/50 flex items-center justify-center">
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
                <p className="text-3xl font-bold mb-1">
                  {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : stat.value}
                </p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="p-6 bg-card/80 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Quick Actions</h2>
            </div>
            <div className="space-y-4">
              <Link to="/issue-certificate">
                <Button variant="hero" size="lg" className="w-full justify-start text-lg h-16">
                  <PlusCircle className="w-6 h-6 mr-3" />
                  Issue New Certificate
                </Button>
              </Link>
              <Link to="/template-editor">
                <Button variant="accent" size="lg" className="w-full justify-start text-lg h-16">
                  <FileText className="w-6 h-6 mr-3" />
                  Create New Template
                </Button>
              </Link>
            </div>
          </Card>

          <Card className="p-6 bg-card/80 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Recent Activity</h2>
              <Link to="/certificates">
                <Button variant="ghost" size="sm">View All</Button>
              </Link>
            </div>
            {recentActivity.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No certificates issued yet</p>
            ) : (
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between py-3 border-b border-border last:border-0"
                  >
                    <div>
                      <p className="font-medium">{activity.recipient_name}</p>
                      <p className="text-sm text-muted-foreground">{activity.course_name || "Certificate"}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        <Card className="p-6 bg-gradient-to-br from-secondary/10 to-accent/10 border-secondary/30">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-secondary/20 rounded-full flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-secondary" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-lg mb-1">Upgrade to Premium</h3>
              <p className="text-sm text-muted-foreground">Unlock unlimited templates and AI features</p>
            </div>
            <Button variant="cta">Upgrade Now</Button>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
