import { ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard, FileText, Award, BarChart3, Settings,
  LogOut, Menu, Briefcase, Shield, BookOpen, Bell, Search, Plus,
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import AfriCertifyLogo from "@/components/AfriCertifyLogo";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { profile, roles, signOut, user } = useAuth();

  const isRecipient = roles.includes("recipient");
  const isAdmin = roles.includes("admin");

  const issuerNav = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
    { icon: FileText, label: "Templates", path: "/templates" },
    { icon: BookOpen, label: "Courses", path: "/courses" },
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
    ?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) ?? user?.email?.[0].toUpperCase() ?? "?";

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const currentItem = navItems.find((n) => n.path === location.pathname);

  const NavContent = () => (
    <div className="h-full flex flex-col">
      <div className="mb-7">
        <Link to="/">
          <AfriCertifyLogo size="sm" showTagline />
        </Link>
      </div>

      <div className="mb-6 px-2">
        <div className="flex items-center gap-3 p-3 rounded-xl glass">
          <Avatar className="h-10 w-10 ring-1 ring-secondary/40">
            <AvatarImage src={profile?.avatar_url ?? undefined} />
            <AvatarFallback className="text-xs bg-secondary/20 text-secondary font-bold">{initials}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold truncate">{profile?.full_name ?? "User"}</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
              {isAdmin ? "Admin" : isRecipient ? "Recipient" : "Issuer"}
            </p>
          </div>
        </div>
      </div>

      <p className="px-3 mb-2 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Menu</p>
      <nav className="space-y-1 flex-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link key={item.path} to={item.path}>
              <div
                className={cn(
                  "relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group",
                  isActive
                    ? "bg-secondary/10 text-secondary"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/5"
                )}
              >
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-0.5 rounded-r bg-secondary shadow-[0_0_12px_hsl(var(--secondary))]" />
                )}
                <item.icon className={cn("w-4 h-4 transition-transform duration-200", isActive ? "scale-110" : "group-hover:scale-110")} />
                <span>{item.label}</span>
                {item.label === "Admin" && (
                  <span className="ml-auto text-[9px] px-1.5 py-0.5 rounded-full bg-accent/20 text-accent font-bold">PRO</span>
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="pt-4 border-t border-border/60 space-y-2">
        <Link to="/issue-certificate">
          <Button variant="cta" size="sm" className="w-full rounded-full">
            <Plus className="w-3.5 h-3.5" /> Issue Certificate
          </Button>
        </Link>
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={handleSignOut}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background relative">
      {/* Ambient bg */}
      <div className="fixed inset-0 bg-mesh opacity-60 pointer-events-none" />

      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-14 z-50 glass-strong flex items-center px-3 gap-2">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <Menu className="w-5 h-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-5 bg-[hsl(var(--surface-1))] border-secondary/15">
            <NavContent />
          </SheetContent>
        </Sheet>
        <AfriCertifyLogo size="sm" />
        <div className="ml-auto flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-9 w-9 relative">
            <Bell className="w-4 h-4" />
            <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-cta animate-glow-pulse" />
          </Button>
          <Avatar className="h-8 w-8 ring-1 ring-secondary/40">
            <AvatarImage src={profile?.avatar_url ?? undefined} />
            <AvatarFallback className="text-[10px] bg-secondary/20 text-secondary font-bold">{initials}</AvatarFallback>
          </Avatar>
        </div>
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 h-screen w-64 z-40 p-4">
        <div className="w-full h-full glass-strong rounded-2xl p-5 flex flex-col">
          <NavContent />
        </div>
      </aside>

      {/* Desktop top bar */}
      <header className="hidden lg:flex fixed top-0 left-64 right-0 h-16 z-30 items-center px-6 gap-4 bg-background/60 backdrop-blur-xl border-b border-border/40">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <LayoutDashboard className="w-4 h-4" />
          <span>/</span>
          <span className="text-foreground font-medium">{currentItem?.label ?? "Dashboard"}</span>
        </div>
        <div className="ml-auto flex items-center gap-3">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search certificates, templates..." className="pl-9 h-9 glass" />
          </div>
          <Button variant="ghost" size="icon" className="h-9 w-9 relative glass">
            <Bell className="w-4 h-4" />
            <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-cta animate-glow-pulse" />
          </Button>
        </div>
      </header>

      <main className="lg:ml-64 lg:pt-16 pt-14 relative z-10">
        <div className="p-5 sm:p-6 lg:p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
