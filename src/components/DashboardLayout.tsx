import { ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  FileText, 
  Award, 
  BarChart3, 
  Settings,
  LogOut,
  Menu,
  Briefcase
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import AfriCertifyLogo from "@/components/AfriCertifyLogo";
import { useAuth } from "@/contexts/AuthContext";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { profile, roles, signOut } = useAuth();

  const isRecipient = roles.includes("recipient");
  const isAdmin = roles.includes("admin");

  const issuerNav = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
    { icon: FileText, label: "Templates", path: "/templates" },
    { icon: Award, label: "Certificates", path: "/certificates" },
    { icon: BarChart3, label: "Analytics", path: "/analytics" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];

  const recipientNav = [
    { icon: Briefcase, label: "Portfolio", path: "/portfolio" },
    { icon: Award, label: "Certificates", path: "/certificates" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];

  const baseNav = isRecipient ? recipientNav : issuerNav;
  const navItems = isAdmin
    ? [...baseNav, { icon: Shield, label: "Admin", path: "/admin" }]
    : baseNav;

  const initials = profile?.full_name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) ?? "?";

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const NavContent = () => (
    <>
      <div className="mb-8">
        <Link to="/">
          <AfriCertifyLogo size="md" showTagline />
        </Link>
        <div className="flex items-center gap-2 mt-3 ml-1">
          <Avatar className="h-8 w-8">
            <AvatarImage src={profile?.avatar_url ?? undefined} />
            <AvatarFallback className="text-xs">{initials}</AvatarFallback>
          </Avatar>
          <span className="text-xs text-muted-foreground truncate">
            {profile?.full_name ?? "User"}
          </span>
        </div>
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
        <Button
          variant="ghost"
          className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={handleSignOut}
        >
          <LogOut className="w-5 h-5 mr-3" />
          Sign Out
        </Button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-background">
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

      <aside className="hidden lg:flex fixed left-0 top-0 h-screen w-64 bg-card/80 backdrop-blur-lg border-r border-border p-6 flex-col z-40">
        <NavContent />
      </aside>

      <main className="lg:ml-64 pt-20 lg:pt-8 p-6">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
