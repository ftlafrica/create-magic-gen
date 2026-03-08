import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Shield } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";

type AppRole = Database["public"]["Enums"]["app_role"];

interface UserRow {
  id: string;
  full_name: string | null;
  organization: string | null;
  role: AppRole;
  role_id: string;
}

const AdminPanel = () => {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchUsers = async () => {
    setLoading(true);
    const { data: roles, error: rolesErr } = await supabase
      .from("user_roles")
      .select("id, user_id, role");

    if (rolesErr) {
      toast({ title: "Error", description: rolesErr.message, variant: "destructive" });
      setLoading(false);
      return;
    }

    const { data: profiles, error: profilesErr } = await supabase
      .from("profiles")
      .select("id, full_name, organization");

    if (profilesErr) {
      toast({ title: "Error", description: profilesErr.message, variant: "destructive" });
      setLoading(false);
      return;
    }

    const profileMap = new Map(profiles?.map((p) => [p.id, p]) ?? []);
    const merged: UserRow[] = (roles ?? []).map((r) => {
      const profile = profileMap.get(r.user_id);
      return {
        id: r.user_id,
        full_name: profile?.full_name ?? null,
        organization: profile?.organization ?? null,
        role: r.role,
        role_id: r.id,
      };
    });

    setUsers(merged);
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (roleId: string, newRole: AppRole) => {
    const { error } = await supabase
      .from("user_roles")
      .update({ role: newRole })
      .eq("id", roleId);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Role updated" });
      setUsers((prev) =>
        prev.map((u) => (u.role_id === roleId ? { ...u, role: newRole } : u))
      );
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Shield className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Admin Panel</h1>
            <p className="text-muted-foreground">Manage users and roles</p>
          </div>
        </div>

        <div className="rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Organization</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                    Loading users...
                  </TableCell>
                </TableRow>
              ) : users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                    No users found
                  </TableCell>
                </TableRow>
              ) : (
                users.map((u) => (
                  <TableRow key={u.role_id}>
                    <TableCell className="font-medium">{u.full_name ?? "—"}</TableCell>
                    <TableCell>{u.organization ?? "—"}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{u.role}</Badge>
                    </TableCell>
                    <TableCell>
                      <Select
                        defaultValue={u.role}
                        onValueChange={(val) => handleRoleChange(u.role_id, val as AppRole)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="issuer">Issuer</SelectItem>
                          <SelectItem value="recipient">Recipient</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminPanel;
