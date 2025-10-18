import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PlusCircle, Edit, Copy, Trash2 } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { Link } from "react-router-dom";
import certificateMockup from "@/assets/certificate-mockup.jpg";

const Templates = () => {
  const templates = [
    { id: 1, name: "Data Science Certificate", courses: 12, lastModified: "2 days ago" },
    { id: 2, name: "Product Management", courses: 8, lastModified: "5 days ago" },
    { id: 3, name: "Digital Marketing", courses: 15, lastModified: "1 week ago" },
    { id: 4, name: "Web Development", courses: 6, lastModified: "2 weeks ago" },
    { id: 5, name: "Business Analytics", courses: 10, lastModified: "3 weeks ago" },
    { id: 6, name: "Leadership Training", courses: 4, lastModified: "1 month ago" },
  ];

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
                    src={certificateMockup}
                    alt={template.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <div className="flex gap-2 w-full">
                      <Button variant="secondary" size="sm" className="flex-1">
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm">
                        <Copy className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-1">{template.name}</h3>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{template.courses} certificates issued</span>
                    <span>{template.lastModified}</span>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Templates;
