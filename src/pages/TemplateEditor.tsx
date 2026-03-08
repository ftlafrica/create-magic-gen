import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Save,
  Type,
  Image as ImageIcon,
  QrCode,
  Sparkles,
  Upload,
  Loader2,
} from "lucide-react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import certificateMockup from "@/assets/certificate-mockup.jpg";

interface TemplateLayout {
  fontFamily: string;
  fontSize: number;
  textColor: string;
  alignment: "left" | "center" | "right";
  borderStyle: string;
}

const defaultLayout: TemplateLayout = {
  fontFamily: "Bebas Neue",
  fontSize: 24,
  textColor: "#FFFFFF",
  alignment: "center",
  borderStyle: "Elegant Frame",
};

const COLORS = [
  "#001F3F", "#00BFFF", "#8B5CF6", "#FFC107",
  "#FF6B6B", "#4ECDC4", "#45B7D1", "#FFA07A",
];

const TemplateEditor = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [templateName, setTemplateName] = useState("New Certificate Template");
  const [description, setDescription] = useState("");
  const [backgroundColor, setBackgroundColor] = useState("#001F3F");
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [layout, setLayout] = useState<TemplateLayout>(defaultLayout);
  const [saving, setSaving] = useState(false);
  const [loadingTemplate, setLoadingTemplate] = useState(!!id);
  const [uploading, setUploading] = useState(false);

  // Load existing template
  useEffect(() => {
    if (!id) return;
    const load = async () => {
      const { data, error } = await supabase
        .from("templates")
        .select("*")
        .eq("id", id)
        .single();
      if (error || !data) {
        toast.error("Template not found");
        navigate("/templates");
        return;
      }
      setTemplateName(data.name);
      setDescription(data.description || "");
      setBackgroundColor(data.background_color || "#001F3F");
      setLogoUrl(data.logo_url);
      if (data.layout_json && typeof data.layout_json === "object") {
        setLayout({ ...defaultLayout, ...(data.layout_json as any) });
      }
      setLoadingTemplate(false);
    };
    load();
  }, [id]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    const payload = {
      name: templateName,
      description,
      owner_id: user.id,
      background_color: backgroundColor,
      logo_url: logoUrl,
      layout_json: layout as any,
    };

    let error;
    if (id) {
      ({ error } = await supabase.from("templates").update(payload).eq("id", id));
    } else {
      ({ error } = await supabase.from("templates").insert(payload));
    }

    setSaving(false);
    if (error) {
      toast.error("Failed to save template");
      return;
    }
    toast.success(id ? "Template updated" : "Template created");
    navigate("/templates");
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setUploading(true);
    const path = `${user.id}/${Date.now()}-${file.name}`;
    const { error } = await supabase.storage
      .from("template-assets")
      .upload(path, file);
    if (error) {
      toast.error("Upload failed");
      setUploading(false);
      return;
    }
    const { data: urlData } = supabase.storage
      .from("template-assets")
      .getPublicUrl(path);
    setLogoUrl(urlData.publicUrl);
    setUploading(false);
    toast.success("Logo uploaded");
  };

  if (loadingTemplate) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Top Bar */}
      <div className="fixed top-0 left-0 right-0 h-16 bg-card/80 backdrop-blur-lg border-b border-border z-50 flex items-center px-6">
        <Link to="/templates">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </Link>
        <Input
          value={templateName}
          onChange={(e) => setTemplateName(e.target.value)}
          className="mx-4 max-w-md"
        />
        <div className="ml-auto flex gap-2">
          <Button variant="cta" onClick={handleSave} disabled={saving}>
            {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            {id ? "Update" : "Save"} Template
          </Button>
        </div>
      </div>

      <div className="pt-16 flex h-screen">
        {/* Left Toolbar */}
        <aside className="w-80 bg-card/80 backdrop-blur-lg border-r border-border p-6 overflow-y-auto">
          <Tabs defaultValue="elements" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="elements">Elements</TabsTrigger>
              <TabsTrigger value="design">Design</TabsTrigger>
            </TabsList>

            <TabsContent value="elements" className="space-y-6">
              <div>
                <h3 className="font-bold mb-4">Add Elements</h3>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    <Type className="w-4 h-4 mr-2" />
                    Add Text
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <ImageIcon className="w-4 h-4 mr-2" />
                    Add Image
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <QrCode className="w-4 h-4 mr-2" />
                    Add QR Code
                  </Button>
                </div>
              </div>

              <div>
                <h3 className="font-bold mb-4">Dynamic Fields</h3>
                <div className="space-y-2">
                  {["{{recipient_name}}", "{{issue_date}}", "{{course_name}}", "{{certificate_id}}"].map((field) => (
                    <Button key={field} variant="secondary" size="sm" className="w-full justify-start">
                      {field}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-bold mb-4">Upload Logo</h3>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleLogoUpload}
                />
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                >
                  {uploading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
                  {uploading ? "Uploading…" : "Upload Image"}
                </Button>
                {logoUrl && (
                  <img src={logoUrl} alt="Logo preview" className="mt-3 rounded-md w-full h-20 object-contain border border-border" />
                )}
              </div>

              <div>
                <Label>Description</Label>
                <Input
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Template description"
                  className="mt-2"
                />
              </div>
            </TabsContent>

            <TabsContent value="design" className="space-y-6">
              <Card className="p-4 bg-secondary/10 border-secondary/30">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5 text-secondary" />
                  <h3 className="font-bold">Color Palette</h3>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {COLORS.map((color) => (
                    <button
                      key={color}
                      className={`w-12 h-12 rounded-lg border-2 transition-colors ${backgroundColor === color ? "border-secondary" : "border-border hover:border-secondary/50"}`}
                      style={{ backgroundColor: color }}
                      onClick={() => setBackgroundColor(color)}
                    />
                  ))}
                </div>
              </Card>

              <div>
                <Label>Background Color</Label>
                <Input
                  type="color"
                  value={backgroundColor}
                  onChange={(e) => setBackgroundColor(e.target.value)}
                  className="h-12 mt-2"
                />
              </div>

              <div>
                <Label>Border Style</Label>
                <select
                  className="w-full mt-2 h-10 rounded-md border border-input bg-background px-3"
                  value={layout.borderStyle}
                  onChange={(e) => setLayout({ ...layout, borderStyle: e.target.value })}
                >
                  <option>Elegant Frame</option>
                  <option>Modern Minimal</option>
                  <option>Classic Border</option>
                  <option>No Border</option>
                </select>
              </div>
            </TabsContent>
          </Tabs>
        </aside>

        {/* Main Canvas */}
        <main className="flex-1 p-8 overflow-auto bg-muted/30">
          <div className="max-w-5xl mx-auto">
            <div
              className="rounded-lg shadow-2xl border-2 border-border aspect-[1.414/1] flex flex-col items-center justify-center p-12 relative"
              style={{ backgroundColor }}
            >
              {logoUrl && (
                <img src={logoUrl} alt="Logo" className="absolute top-8 left-8 h-16 object-contain" />
              )}
              <h2
                className="text-4xl font-bold mb-4"
                style={{
                  fontFamily: layout.fontFamily,
                  color: layout.textColor,
                  textAlign: layout.alignment,
                  fontSize: `${layout.fontSize * 1.5}px`,
                }}
              >
                Certificate of Completion
              </h2>
              <p
                className="text-xl mb-2"
                style={{ color: layout.textColor, opacity: 0.8, textAlign: layout.alignment }}
              >
                This certifies that
              </p>
              <p
                className="text-3xl font-bold mb-4"
                style={{ color: layout.textColor, textAlign: layout.alignment }}
              >
                {"{{recipient_name}}"}
              </p>
              <p
                className="text-lg"
                style={{ color: layout.textColor, opacity: 0.7, textAlign: layout.alignment }}
              >
                has successfully completed <strong>{"{{course_name}}"}</strong>
              </p>
              <p
                className="mt-8 text-sm"
                style={{ color: layout.textColor, opacity: 0.5 }}
              >
                Issued on {"{{issue_date}}"} • ID: {"{{certificate_id}}"}
              </p>
            </div>
          </div>
        </main>

        {/* Right Inspector Panel */}
        <aside className="w-80 bg-card/80 backdrop-blur-lg border-l border-border p-6 overflow-y-auto">
          <h3 className="font-bold text-lg mb-6">Properties</h3>
          <div className="space-y-6">
            <div>
              <Label>Font Family</Label>
              <select
                className="w-full mt-2 h-10 rounded-md border border-input bg-background px-3"
                value={layout.fontFamily}
                onChange={(e) => setLayout({ ...layout, fontFamily: e.target.value })}
              >
                <option>Bebas Neue</option>
                <option>Urbanist</option>
                <option>Arial</option>
                <option>Georgia</option>
              </select>
            </div>

            <div>
              <Label>Font Size</Label>
              <Input
                type="number"
                value={layout.fontSize}
                onChange={(e) => setLayout({ ...layout, fontSize: Number(e.target.value) })}
                className="mt-2"
              />
            </div>

            <div>
              <Label>Text Color</Label>
              <Input
                type="color"
                value={layout.textColor}
                onChange={(e) => setLayout({ ...layout, textColor: e.target.value })}
                className="h-12 mt-2"
              />
            </div>

            <div>
              <Label>Alignment</Label>
              <div className="grid grid-cols-3 gap-2 mt-2">
                {(["left", "center", "right"] as const).map((align) => (
                  <Button
                    key={align}
                    variant={layout.alignment === align ? "secondary" : "outline"}
                    size="sm"
                    onClick={() => setLayout({ ...layout, alignment: align })}
                  >
                    {align.charAt(0).toUpperCase() + align.slice(1)}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default TemplateEditor;
