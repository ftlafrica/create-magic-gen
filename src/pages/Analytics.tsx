import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { TrendingUp, Eye, Share2, Award } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
} from "recharts";
import { format, subMonths, startOfMonth, endOfMonth } from "date-fns";
import NeonSpinner from "@/components/NeonSpinner";

const Analytics = () => {
  const { user } = useAuth();

  const { data: totalCerts = 0 } = useQuery({
    queryKey: ["analytics-total-certs", user?.id],
    queryFn: async () => {
      const { count } = await supabase
        .from("certificates")
        .select("*", { count: "exact", head: true })
        .eq("issuer_id", user!.id);
      return count ?? 0;
    },
    enabled: !!user,
  });

  const { data: totalViews = 0 } = useQuery({
    queryKey: ["analytics-total-views", user?.id],
    queryFn: async () => {
      const { data: certs } = await supabase
        .from("certificates")
        .select("id")
        .eq("issuer_id", user!.id);
      if (!certs?.length) return 0;
      const ids = certs.map((c) => c.id);
      const { count } = await supabase
        .from("certificate_views")
        .select("*", { count: "exact", head: true })
        .in("certificate_id", ids);
      return count ?? 0;
    },
    enabled: !!user,
  });

  const { data: uniqueRecipients = 0 } = useQuery({
    queryKey: ["analytics-recipients", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("certificates")
        .select("recipient_email")
        .eq("issuer_id", user!.id);
      if (!data) return 0;
      return new Set(data.map((d) => d.recipient_email)).size;
    },
    enabled: !!user,
  });

  const { data: thisMonthCerts = 0 } = useQuery({
    queryKey: ["analytics-this-month", user?.id],
    queryFn: async () => {
      const start = startOfMonth(new Date()).toISOString();
      const end = endOfMonth(new Date()).toISOString();
      const { count } = await supabase
        .from("certificates")
        .select("*", { count: "exact", head: true })
        .eq("issuer_id", user!.id)
        .gte("created_at", start)
        .lte("created_at", end);
      return count ?? 0;
    },
    enabled: !!user,
  });

  const { data: monthlyData = [], isLoading: monthlyLoading } = useQuery({
    queryKey: ["analytics-monthly", user?.id],
    queryFn: async () => {
      const months = [];
      for (let i = 5; i >= 0; i--) {
        const date = subMonths(new Date(), i);
        const start = startOfMonth(date).toISOString();
        const end = endOfMonth(date).toISOString();
        const { count } = await supabase
          .from("certificates")
          .select("*", { count: "exact", head: true })
          .eq("issuer_id", user!.id)
          .gte("created_at", start)
          .lte("created_at", end);
        months.push({
          month: format(date, "MMM"),
          certificates: count ?? 0,
        });
      }
      return months;
    },
    enabled: !!user,
  });

  const { data: topCertificates = [] } = useQuery({
    queryKey: ["analytics-top-certs", user?.id],
    queryFn: async () => {
      const { data: certs } = await supabase
        .from("certificates")
        .select("id, course_name, recipient_name")
        .eq("issuer_id", user!.id);
      if (!certs?.length) return [];

      const ids = certs.map((c) => c.id);
      const { data: views } = await supabase
        .from("certificate_views")
        .select("certificate_id")
        .in("certificate_id", ids);

      const viewCounts: Record<string, number> = {};
      views?.forEach((v) => {
        viewCounts[v.certificate_id] = (viewCounts[v.certificate_id] || 0) + 1;
      });

      return certs
        .map((c) => ({
          name: c.course_name || c.recipient_name,
          views: viewCounts[c.id] || 0,
        }))
        .sort((a, b) => b.views - a.views)
        .slice(0, 5);
    },
    enabled: !!user,
  });

  const stats = [
    { label: "Total Views", value: totalViews.toLocaleString(), icon: Eye, color: "text-secondary" },
    { label: "Recipients", value: uniqueRecipients.toLocaleString(), icon: Share2, color: "text-accent" },
    { label: "Certificates Issued", value: totalCerts.toLocaleString(), icon: Award, color: "text-cta" },
    { label: "This Month", value: thisMonthCerts.toLocaleString(), icon: TrendingUp, color: "text-secondary" },
  ];

  const chartConfig = {
    certificates: { label: "Certificates", color: "hsl(var(--secondary))" },
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Analytics Dashboard</h1>
          <p className="text-muted-foreground text-lg">Track your certificate performance</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6 bg-card/80 backdrop-blur-sm border-border hover:border-secondary/50 transition-all duration-300">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center">
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
                <p className="text-3xl font-bold mb-1">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="p-6 bg-card/80 backdrop-blur-sm">
            <h2 className="text-2xl font-bold mb-6">Top Viewed Certificates</h2>
            {topCertificates.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No view data yet. Share certificates to start tracking.</p>
            ) : (
              <div className="space-y-4">
                {topCertificates.map((cert, index) => (
                  <div key={index} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                    <p className="font-medium flex-1">{cert.name}</p>
                    <span className="text-sm text-muted-foreground flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      {cert.views} views
                    </span>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card className="p-6 bg-card/80 backdrop-blur-sm">
            <h2 className="text-2xl font-bold mb-6">Monthly Issuance</h2>
            {monthlyLoading ? (
              <div className="h-64 flex items-center justify-center">
                <NeonSpinner />
              </div>
            ) : monthlyData.every((m) => m.certificates === 0) ? (
              <p className="text-muted-foreground text-center py-8">No certificates issued in the last 6 months.</p>
            ) : (
              <ChartContainer config={chartConfig} className="h-64 w-full">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="month" className="text-muted-foreground" />
                  <YAxis allowDecimals={false} className="text-muted-foreground" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="certificates" fill="var(--color-certificates)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ChartContainer>
            )}
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Analytics;
