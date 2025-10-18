import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  FileText, 
  PlusCircle, 
  Award, 
  TrendingUp,
  Calendar,
  Users
} from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const stats = [
    { label: "Certificates Issued", value: "35", max: "50", icon: Award, color: "text-secondary" },
    { label: "Templates Created", value: "8", max: "∞", icon: FileText, color: "text-accent" },
    { label: "This Month", value: "15", icon: Calendar, color: "text-cta" },
    { label: "Total Recipients", value: "142", icon: Users, color: "text-secondary" },
  ];

  const recentActivity = [
    { recipient: "Samuel Okonkwo", certificate: "Data Science Fundamentals", date: "2 hours ago" },
    { recipient: "Amina Ibrahim", certificate: "Product Management", date: "5 hours ago" },
    { recipient: "Chidi Eze", certificate: "Data Science Fundamentals", date: "1 day ago" },
    { recipient: "Fatima Musa", certificate: "Digital Marketing", date: "2 days ago" },
    { recipient: "Tunde Adebayo", certificate: "Product Management", date: "3 days ago" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Welcome back, Dr. Bello!</h1>
          <p className="text-muted-foreground text-lg">Here's what's happening with your certificates</p>
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
                  {stat.max && (
                    <span className="text-xs text-muted-foreground">/ {stat.max}</span>
                  )}
                </div>
                <p className="text-3xl font-bold mb-1">{stat.value}</p>
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
              <Button variant="ghost" size="sm">View All</Button>
            </div>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                  <div>
                    <p className="font-medium">{activity.recipient}</p>
                    <p className="text-sm text-muted-foreground">{activity.certificate}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{activity.date}</span>
                </div>
              ))}
            </div>
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
