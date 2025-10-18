import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { TrendingUp, Eye, Share2, Award } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";

const Analytics = () => {
  const stats = [
    { label: "Total Views", value: "1,247", change: "+12%", icon: Eye, color: "text-secondary" },
    { label: "Total Shares", value: "342", change: "+8%", icon: Share2, color: "text-accent" },
    { label: "Certificates Issued", value: "156", change: "+23%", icon: Award, color: "text-cta" },
    { label: "Engagement Rate", value: "68%", change: "+5%", icon: TrendingUp, color: "text-secondary" },
  ];

  const topCertificates = [
    { name: "Data Science Fundamentals", views: 456, shares: 89 },
    { name: "Product Management", views: 342, shares: 67 },
    { name: "Digital Marketing", views: 289, shares: 54 },
    { name: "Web Development", views: 160, shares: 32 },
  ];

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
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br from-${stat.color.split('-')[1]}/20 to-transparent flex items-center justify-center`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <span className="text-xs text-secondary font-bold">{stat.change}</span>
                </div>
                <p className="text-3xl font-bold mb-1">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="p-6 bg-card/80 backdrop-blur-sm">
            <h2 className="text-2xl font-bold mb-6">Top Performing Certificates</h2>
            <div className="space-y-4">
              {topCertificates.map((cert, index) => (
                <div key={index} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                  <div className="flex-1">
                    <p className="font-medium">{cert.name}</p>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="text-sm text-muted-foreground flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {cert.views} views
                      </span>
                      <span className="text-sm text-muted-foreground flex items-center gap-1">
                        <Share2 className="w-4 h-4" />
                        {cert.shares} shares
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6 bg-card/80 backdrop-blur-sm">
            <h2 className="text-2xl font-bold mb-6">Monthly Trend</h2>
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              <p>Chart visualization coming soon</p>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Analytics;
