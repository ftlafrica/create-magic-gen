import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, User, GraduationCap, Award } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import AuthShell from "@/components/auth/AuthShell";

const strengthLabel = (pwd: string) => {
  let score = 0;
  if (pwd.length >= 8) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  return ["Too short", "Weak", "Okay", "Good", "Strong"][score];
};

const SignUp = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"issuer" | "recipient">("issuer");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const strength = useMemo(() => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  }, [password]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      toast({ title: "Password must be at least 8 characters", variant: "destructive" });
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName, role },
        emailRedirectTo: window.location.origin,
      },
    });
    setLoading(false);
    if (error) {
      toast({ title: "Sign up failed", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Account created!", description: "Check your email to confirm your account." });
    navigate("/signin");
  };

  const strengthColors = ["bg-destructive", "bg-destructive", "bg-cta", "bg-secondary", "bg-secondary"];

  return (
    <AuthShell
      title="Create Account"
      subtitle="Start issuing verifiable certificates today"
      footer={
        <>
          Already have an account?{" "}
          <Link to="/signin" className="text-secondary hover:text-secondary/80 font-medium transition-colors">
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSignUp} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input id="name" placeholder="Dr. Jane Bello" className="pl-10 h-11"
              value={fullName} onChange={(e) => setFullName(e.target.value)} required />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input id="email" type="email" placeholder="you@example.com" className="pl-10 h-11"
              value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input id="password" type="password" placeholder="••••••••" className="pl-10 h-11"
              value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          {password.length > 0 && (
            <div className="space-y-1.5">
              <div className="flex gap-1">
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${i < strength ? strengthColors[strength] : "bg-border"}`} />
                ))}
              </div>
              <p className="text-xs text-muted-foreground">{strengthLabel(password)} · 8+ chars, mix case, numbers, symbols</p>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label>I want to</Label>
          <div className="grid grid-cols-2 gap-3">
            <button type="button" onClick={() => setRole("issuer")}
              className={`p-3 rounded-xl border text-sm font-medium transition-all duration-200 flex flex-col items-center gap-2 ${
                role === "issuer"
                  ? "border-secondary/60 bg-secondary/10 text-secondary shadow-[0_0_20px_-6px_hsl(var(--secondary)/0.5)]"
                  : "border-border text-muted-foreground hover:border-secondary/40 hover:text-foreground"
              }`}>
              <Award className="w-5 h-5" />
              Issue Certificates
            </button>
            <button type="button" onClick={() => setRole("recipient")}
              className={`p-3 rounded-xl border text-sm font-medium transition-all duration-200 flex flex-col items-center gap-2 ${
                role === "recipient"
                  ? "border-secondary/60 bg-secondary/10 text-secondary shadow-[0_0_20px_-6px_hsl(var(--secondary)/0.5)]"
                  : "border-border text-muted-foreground hover:border-secondary/40 hover:text-foreground"
              }`}>
              <GraduationCap className="w-5 h-5" />
              Receive Certificates
            </button>
          </div>
        </div>

        <Button variant="cta" className="w-full rounded-full" size="lg" disabled={loading}>
          {loading ? "Creating account..." : "Create Account"}
        </Button>
      </form>
    </AuthShell>
  );
};

export default SignUp;
