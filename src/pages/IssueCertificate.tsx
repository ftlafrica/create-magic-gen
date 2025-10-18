import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Send, FileSpreadsheet } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";

const IssueCertificate = () => {
  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Issue Certificate</h1>
          <p className="text-muted-foreground text-lg">Send certificates to recipients via email</p>
        </div>

        <Tabs defaultValue="single" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="single">Issue Single</TabsTrigger>
            <TabsTrigger value="bulk">Issue Bulk</TabsTrigger>
          </TabsList>

          <TabsContent value="single" className="mt-6">
            <Card className="p-8 bg-card/80 backdrop-blur-sm">
              <form className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="template">Select Template</Label>
                  <select id="template" className="w-full h-12 rounded-md border border-input bg-background px-4">
                    <option>Data Science Certificate</option>
                    <option>Product Management</option>
                    <option>Digital Marketing</option>
                    <option>Web Development</option>
                  </select>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="recipient-name">Recipient Name</Label>
                    <Input
                      id="recipient-name"
                      placeholder="e.g., Samuel Okonkwo"
                      className="h-12"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="recipient-email">Recipient Email</Label>
                    <Input
                      id="recipient-email"
                      type="email"
                      placeholder="recipient@example.com"
                      className="h-12"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="course-name">Course/Achievement Name</Label>
                  <Input
                    id="course-name"
                    placeholder="e.g., Data Science Fundamentals"
                    className="h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="issue-date">Issue Date</Label>
                  <Input
                    id="issue-date"
                    type="date"
                    className="h-12"
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <Button variant="outline" size="lg" className="flex-1">
                    Preview Certificate
                  </Button>
                  <Button variant="cta" size="lg" className="flex-1">
                    <Send className="w-5 h-5 mr-2" />
                    Issue Certificate
                  </Button>
                </div>
              </form>
            </Card>
          </TabsContent>

          <TabsContent value="bulk" className="mt-6">
            <Card className="p-8 bg-card/80 backdrop-blur-sm">
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="bulk-template">Select Template</Label>
                  <select id="bulk-template" className="w-full h-12 rounded-md border border-input bg-background px-4">
                    <option>Data Science Certificate</option>
                    <option>Product Management</option>
                    <option>Digital Marketing</option>
                    <option>Web Development</option>
                  </select>
                </div>

                <div className="border-2 border-dashed border-border rounded-lg p-12 text-center bg-muted/30">
                  <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="font-bold text-lg mb-2">Upload CSV File</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Drag and drop your CSV file here, or click to browse
                  </p>
                  <Button variant="secondary">
                    <FileSpreadsheet className="w-4 h-4 mr-2" />
                    Choose File
                  </Button>
                </div>

                <Card className="p-4 bg-secondary/10 border-secondary/30">
                  <h4 className="font-bold mb-2">CSV Format Requirements</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Your CSV should include the following columns:
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                    <li>recipient_name</li>
                    <li>recipient_email</li>
                    <li>course_name (optional)</li>
                    <li>custom_field_1 (optional)</li>
                  </ul>
                  <Button variant="link" size="sm" className="mt-3 p-0 h-auto text-secondary">
                    Download CSV Template
                  </Button>
                </Card>

                <Button variant="cta" size="lg" className="w-full" disabled>
                  <Send className="w-5 h-5 mr-2" />
                  Process & Issue Certificates
                </Button>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default IssueCertificate;
