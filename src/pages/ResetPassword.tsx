import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import AuthShell from "@/components/auth/AuthShell";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Recovery hash is handled automatically by Supabase client.
  }, []);

  const strength = useMemo(() => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  }, [password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast({ title: "Passwords don't match", variant: "destructive" });
      return;
    }
    if (password.length < 8) {
      toast({ title: "Password must be at least 8 characters", variant: "destructive" });
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) {
      toast({ title: "Error updating password", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Password updated successfully!" });
      navigate("/signin");
    }
  };

  const strengthColors = ["bg-destructive", "bg-destructive", "bg-cta", "bg-secondary", "bg-secondary"];

  return (
    <AuthShell
      title="Reset Password"
      subtitle="Enter your new password below"
      backTo="/signin"
      backLabel="Back to sign in"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="password">New Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input id="password" type="password" placeholder="••••••••" className="pl-10 h-11"
              value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          {password.length > 0 && (
            <div className="flex gap-1 pt-1">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${i < strength ? strengthColors[strength] : "bg-border"}`} />
              ))}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input id="confirmPassword" type="password" placeholder="••••••••" className="pl-10 h-11"
              value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
          </div>
          {confirmPassword.length > 0 && confirmPassword !== password && (
            <p className="text-xs text-destructive">Passwords don't match</p>
          )}
        </div>

        <Button variant="cta" className="w-full rounded-full" size="lg" disabled={loading}>
          {loading ? "Updating..." : "Update Password"}
        </Button>
      </form>
    </AuthShell>
  );
};

export default ResetPassword;
