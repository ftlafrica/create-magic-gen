import { useState } from "react";
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
  Upload
} from "lucide-react";
import { Link } from "react-router-dom";
import certificateMockup from "@/assets/certificate-mockup.jpg";

const TemplateEditor = () => {
  const [templateName, setTemplateName] = useState("New Certificate Template");

  const colors = [
    "#001F3F", "#00BFFF", "#8B5CF6", "#FFC107",
    "#FF6B6B", "#4ECDC4", "#45B7D1", "#FFA07A"
  ];

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
          <Button variant="outline">Preview</Button>
          <Button variant="cta">
            <Save className="w-4 h-4 mr-2" />
            Save Template
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
                  <Button variant="secondary" size="sm" className="w-full justify-start">
                    {"{{recipient_name}}"}
                  </Button>
                  <Button variant="secondary" size="sm" className="w-full justify-start">
                    {"{{issue_date}}"}
                  </Button>
                  <Button variant="secondary" size="sm" className="w-full justify-start">
                    {"{{course_name}}"}
                  </Button>
                  <Button variant="secondary" size="sm" className="w-full justify-start">
                    {"{{certificate_id}}"}
                  </Button>
                </div>
              </div>

              <div>
                <h3 className="font-bold mb-4">Upload Logo</h3>
                <Button variant="outline" className="w-full">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Image
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="design" className="space-y-6">
              <Card className="p-4 bg-secondary/10 border-secondary/30">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5 text-secondary" />
                  <h3 className="font-bold">AI Color Palette</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Upload your logo to get AI-suggested colors
                </p>
                <div className="grid grid-cols-4 gap-2">
                  {colors.map((color, index) => (
                    <button
                      key={index}
                      className="w-12 h-12 rounded-lg border-2 border-border hover:border-secondary transition-colors"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </Card>

              <div>
                <Label>Background Color</Label>
                <Input type="color" defaultValue="#001F3F" className="h-12 mt-2" />
              </div>

              <div>
                <Label>Border Style</Label>
                <select className="w-full mt-2 h-10 rounded-md border border-input bg-background px-3">
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
            <div className="bg-background rounded-lg shadow-2xl border-2 border-border aspect-[1.414/1] flex items-center justify-center">
              <img
                src={certificateMockup}
                alt="Certificate Preview"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </main>

        {/* Right Inspector Panel */}
        <aside className="w-80 bg-card/80 backdrop-blur-lg border-l border-border p-6 overflow-y-auto">
          <h3 className="font-bold text-lg mb-6">Properties</h3>
          <div className="space-y-6">
            <div>
              <Label>Font Family</Label>
              <select className="w-full mt-2 h-10 rounded-md border border-input bg-background px-3">
                <option>Bebas Neue</option>
                <option>Urbanist</option>
                <option>Arial</option>
                <option>Georgia</option>
              </select>
            </div>

            <div>
              <Label>Font Size</Label>
              <Input type="number" defaultValue="24" className="mt-2" />
            </div>

            <div>
              <Label>Text Color</Label>
              <Input type="color" defaultValue="#FFFFFF" className="h-12 mt-2" />
            </div>

            <div>
              <Label>Alignment</Label>
              <div className="grid grid-cols-3 gap-2 mt-2">
                <Button variant="outline" size="sm">Left</Button>
                <Button variant="outline" size="sm">Center</Button>
                <Button variant="outline" size="sm">Right</Button>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default TemplateEditor;
