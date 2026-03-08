import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Send, FileSpreadsheet, Loader2, CheckCircle2 } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface CsvRow {
  recipient_name: string;
  recipient_email: string;
  course_name?: string;
}

const parseCsv = (text: string): CsvRow[] => {
  const lines = text.trim().split("\n");
  if (lines.length < 2) return [];
  const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
  const nameIdx = headers.indexOf("recipient_name");
  const emailIdx = headers.indexOf("recipient_email");
  const courseIdx = headers.indexOf("course_name");
  if (nameIdx === -1 || emailIdx === -1) return [];
  return lines.slice(1).filter(Boolean).map((line) => {
    const cols = line.split(",").map((c) => c.trim());
    return {
      recipient_name: cols[nameIdx] || "",
      recipient_email: cols[emailIdx] || "",
      course_name: courseIdx >= 0 ? cols[courseIdx] : undefined,
    };
  }).filter((r) => r.recipient_name && r.recipient_email);
};

const IssueCertificate = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const csvInputRef = useRef<HTMLInputElement>(null);

  // Single issue state
  const [templateId, setTemplateId] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [courseName, setCourseName] = useState("");
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split("T")[0]);
  const [issuing, setIssuing] = useState(false);

  // Bulk state
  const [bulkTemplateId, setBulkTemplateId] = useState("");
  const [csvRows, setCsvRows] = useState<CsvRow[]>([]);
  const [csvFileName, setCsvFileName] = useState("");
  const [bulkIssuing, setBulkIssuing] = useState(false);

  const { data: templates = [] } = useQuery({
    queryKey: ["templates", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("templates")
        .select("id, name")
        .order("name");
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const handleSingleIssue = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!recipientName.trim() || !recipientEmail.trim()) {
      toast.error("Recipient name and email are required");
      return;
    }
    setIssuing(true);
    const { error } = await supabase.from("certificates").insert({
      template_id: templateId || null,
      issuer_id: user.id,
      recipient_name: recipientName.trim(),
      recipient_email: recipientEmail.trim(),
      course_name: courseName.trim() || null,
      issue_date: issueDate,
    });
    setIssuing(false);
    if (error) {
      toast.error("Failed to issue certificate");
      return;
    }
    toast.success(`Certificate issued to ${recipientName}`);
    navigate("/certificates");
  };

  const handleCsvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCsvFileName(file.name);
    const reader = new FileReader();
    reader.onload = (ev) => {
      const rows = parseCsv(ev.target?.result as string);
      setCsvRows(rows);
      if (rows.length === 0) {
        toast.error("No valid rows found. Check CSV format.");
      } else {
        toast.success(`${rows.length} recipients loaded`);
      }
    };
    reader.readAsText(file);
  };

  const handleBulkIssue = async () => {
    if (!user || csvRows.length === 0) return;
    setBulkIssuing(true);
    const records = csvRows.map((row) => ({
      template_id: bulkTemplateId || null,
      issuer_id: user.id,
      recipient_name: row.recipient_name,
      recipient_email: row.recipient_email,
      course_name: row.course_name || null,
      issue_date: new Date().toISOString().split("T")[0],
    }));
    const { error } = await supabase.from("certificates").insert(records);
    setBulkIssuing(false);
    if (error) {
      toast.error("Bulk issuance failed");
      return;
    }
    toast.success(`${csvRows.length} certificates issued!`);
    navigate("/certificates");
  };

  const downloadCsvTemplate = () => {
    const csv = "recipient_name,recipient_email,course_name\nJohn Doe,john@example.com,Data Science\n";
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "certificate-recipients-template.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Issue Certificate</h1>
          <p className="text-muted-foreground text-lg">Send certificates to recipients</p>
        </div>

        <Tabs defaultValue="single" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="single">Issue Single</TabsTrigger>
            <TabsTrigger value="bulk">Issue Bulk</TabsTrigger>
          </TabsList>

          <TabsContent value="single" className="mt-6">
            <Card className="p-8 bg-card/80 backdrop-blur-sm">
              <form className="space-y-6" onSubmit={handleSingleIssue}>
                <div className="space-y-2">
                  <Label htmlFor="template">Select Template</Label>
                  <select
                    id="template"
                    className="w-full h-12 rounded-md border border-input bg-background px-4"
                    value={templateId}
                    onChange={(e) => setTemplateId(e.target.value)}
                  >
                    <option value="">No template</option>
                    {templates.map((t) => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="recipient-name">Recipient Name *</Label>
                    <Input
                      id="recipient-name"
                      placeholder="e.g., Samuel Okonkwo"
                      className="h-12"
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                      required
                      maxLength={100}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="recipient-email">Recipient Email *</Label>
                    <Input
                      id="recipient-email"
                      type="email"
                      placeholder="recipient@example.com"
                      className="h-12"
                      value={recipientEmail}
                      onChange={(e) => setRecipientEmail(e.target.value)}
                      required
                      maxLength={255}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="course-name">Course/Achievement Name</Label>
                  <Input
                    id="course-name"
                    placeholder="e.g., Data Science Fundamentals"
                    className="h-12"
                    value={courseName}
                    onChange={(e) => setCourseName(e.target.value)}
                    maxLength={200}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="issue-date">Issue Date</Label>
                  <Input
                    id="issue-date"
                    type="date"
                    className="h-12"
                    value={issueDate}
                    onChange={(e) => setIssueDate(e.target.value)}
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <Button type="submit" variant="cta" size="lg" className="flex-1" disabled={issuing}>
                    {issuing ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Send className="w-5 h-5 mr-2" />}
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
                  <select
                    id="bulk-template"
                    className="w-full h-12 rounded-md border border-input bg-background px-4"
                    value={bulkTemplateId}
                    onChange={(e) => setBulkTemplateId(e.target.value)}
                  >
                    <option value="">No template</option>
                    {templates.map((t) => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                </div>

                <input
                  ref={csvInputRef}
                  type="file"
                  accept=".csv"
                  className="hidden"
                  onChange={handleCsvUpload}
                />
                <div
                  className="border-2 border-dashed border-border rounded-lg p-12 text-center bg-muted/30 cursor-pointer hover:border-secondary/50 transition-colors"
                  onClick={() => csvInputRef.current?.click()}
                >
                  {csvRows.length > 0 ? (
                    <>
                      <CheckCircle2 className="w-12 h-12 mx-auto mb-4 text-secondary" />
                      <h3 className="font-bold text-lg mb-2">{csvFileName}</h3>
                      <p className="text-sm text-muted-foreground">
                        {csvRows.length} recipients loaded — click to replace
                      </p>
                    </>
                  ) : (
                    <>
                      <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                      <h3 className="font-bold text-lg mb-2">Upload CSV File</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Click to browse for your CSV file
                      </p>
                      <Button variant="secondary" type="button">
                        <FileSpreadsheet className="w-4 h-4 mr-2" />
                        Choose File
                      </Button>
                    </>
                  )}
                </div>

                {csvRows.length > 0 && (
                  <Card className="p-4 bg-muted/30">
                    <h4 className="font-bold mb-2">Preview ({csvRows.length} recipients)</h4>
                    <div className="max-h-40 overflow-y-auto text-sm space-y-1">
                      {csvRows.slice(0, 10).map((r, i) => (
                        <div key={i} className="flex justify-between text-muted-foreground">
                          <span>{r.recipient_name}</span>
                          <span>{r.recipient_email}</span>
                        </div>
                      ))}
                      {csvRows.length > 10 && (
                        <p className="text-muted-foreground mt-2">...and {csvRows.length - 10} more</p>
                      )}
                    </div>
                  </Card>
                )}

                <Card className="p-4 bg-secondary/10 border-secondary/30">
                  <h4 className="font-bold mb-2">CSV Format Requirements</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Your CSV should include the following columns:
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                    <li>recipient_name (required)</li>
                    <li>recipient_email (required)</li>
                    <li>course_name (optional)</li>
                  </ul>
                  <Button variant="link" size="sm" className="mt-3 p-0 h-auto text-secondary" onClick={downloadCsvTemplate} type="button">
                    Download CSV Template
                  </Button>
                </Card>

                <Button
                  variant="cta"
                  size="lg"
                  className="w-full"
                  disabled={csvRows.length === 0 || bulkIssuing}
                  onClick={handleBulkIssue}
                >
                  {bulkIssuing ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Send className="w-5 h-5 mr-2" />}
                  Process & Issue {csvRows.length > 0 ? `${csvRows.length} ` : ""}Certificates
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
