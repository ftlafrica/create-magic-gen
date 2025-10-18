import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { 
  Search, 
  Eye, 
  Mail, 
  Ban,
  Download
} from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { Link } from "react-router-dom";

const Certificates = () => {
  const certificates = [
    { 
      id: "AFC-001", 
      recipient: "Samuel Okonkwo", 
      email: "samuel@example.com", 
      template: "Data Science", 
      date: "2025-03-15",
      status: "Emailed"
    },
    { 
      id: "AFC-002", 
      recipient: "Amina Ibrahim", 
      email: "amina@example.com", 
      template: "Product Management", 
      date: "2025-03-14",
      status: "Emailed"
    },
    { 
      id: "AFC-003", 
      recipient: "Chidi Eze", 
      email: "chidi@example.com", 
      template: "Data Science", 
      date: "2025-03-13",
      status: "Emailed"
    },
    { 
      id: "AFC-004", 
      recipient: "Fatima Musa", 
      email: "fatima@example.com", 
      template: "Digital Marketing", 
      date: "2025-03-12",
      status: "Emailed"
    },
    { 
      id: "AFC-005", 
      recipient: "Tunde Adebayo", 
      email: "tunde@example.com", 
      template: "Product Management", 
      date: "2025-03-11",
      status: "Emailed"
    },
  ];

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
                placeholder="Search by recipient name or email..."
                className="pl-10 h-12"
              />
            </div>
            <select className="h-12 rounded-md border border-input bg-background px-4 min-w-[200px]">
              <option>All Templates</option>
              <option>Data Science</option>
              <option>Product Management</option>
              <option>Digital Marketing</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-4 px-4 font-bold">ID</th>
                  <th className="text-left py-4 px-4 font-bold">Recipient</th>
                  <th className="text-left py-4 px-4 font-bold">Email</th>
                  <th className="text-left py-4 px-4 font-bold">Template</th>
                  <th className="text-left py-4 px-4 font-bold">Issue Date</th>
                  <th className="text-left py-4 px-4 font-bold">Status</th>
                  <th className="text-right py-4 px-4 font-bold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {certificates.map((cert, index) => (
                  <motion.tr
                    key={cert.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-border hover:bg-muted/50 transition-colors"
                  >
                    <td className="py-4 px-4 font-mono text-sm">{cert.id}</td>
                    <td className="py-4 px-4 font-medium">{cert.recipient}</td>
                    <td className="py-4 px-4 text-muted-foreground">{cert.email}</td>
                    <td className="py-4 px-4">{cert.template}</td>
                    <td className="py-4 px-4 text-muted-foreground">{cert.date}</td>
                    <td className="py-4 px-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary/20 text-secondary">
                        {cert.status}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Mail className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                          <Ban className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between mt-6">
            <p className="text-sm text-muted-foreground">
              Showing 5 of 35 certificates
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled>Previous</Button>
              <Button variant="outline" size="sm">Next</Button>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Certificates;
