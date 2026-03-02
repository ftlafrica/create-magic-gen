import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  FileText, 
  Award, 
  BarChart3, 
  Settings,
  LogOut,
  Menu
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import AfriCertifyLogo from "@/components/AfriCertifyLogo";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const location = useLocation();

  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
    { icon: FileText, label: "Templates", path: "/templates" },
    { icon: Award, label: "Certificates", path: "/certificates" },
    { icon: BarChart3, label: "Analytics", path: "/analytics" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];

  const NavContent = () => (
    <>
      <div className="mb-8">
        <Link to="/">
          <AfriCertifyLogo size="md" showTagline />
        </Link>
        <p className="text-xs text-muted-foreground mt-2 ml-[52px]">Dr. Jane Bello</p>
      </div>

      <nav className="space-y-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link key={item.path} to={item.path}>
              <Button
                variant={isActive ? "secondary" : "ghost"}
                className="w-full justify-start"
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.label}
              </Button>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-8">
        <Button variant="ghost" className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10">
          <LogOut className="w-5 h-5 mr-3" />
          Sign Out
        </Button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-card/80 backdrop-blur-lg border-b border-border z-50 flex items-center px-4">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="w-6 h-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-6">
            <NavContent />
          </SheetContent>
        </Sheet>
        <div className="ml-4">
          <AfriCertifyLogo size="sm" />
        </div>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 h-screen w-64 bg-card/80 backdrop-blur-lg border-r border-border p-6 flex-col z-40">
        <NavContent />
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 pt-20 lg:pt-8 p-6">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
