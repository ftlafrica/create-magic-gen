import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PlusCircle, Edit, Trash2, Loader2, BookOpen } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const Courses = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const { data: courses = [], isLoading } = useQuery({
    queryKey: ["courses", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("Not authenticated");
      if (!name.trim()) throw new Error("Name is required");
      if (editingId) {
        const { error } = await supabase
          .from("courses")
          .update({ name: name.trim(), description: description.trim() || null })
          .eq("id", editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("courses").insert({
          name: name.trim(),
          description: description.trim() || null,
          owner_id: user.id,
        });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      toast.success(editingId ? "Course updated" : "Course created");
      resetForm();
    },
    onError: (e) => toast.error(e.message || "Failed to save"),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("courses").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      toast.success("Course deleted");
    },
    onError: () => toast.error("Failed to delete course"),
  });

  const resetForm = () => {
    setName("");
    setDescription("");
    setEditingId(null);
    setDialogOpen(false);
  };

  const openEdit = (course: any) => {
    setEditingId(course.id);
    setName(course.name);
    setDescription(course.description || "");
    setDialogOpen(true);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Courses</h1>
            <p className="text-muted-foreground text-lg">Manage courses for certificate issuance</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={(open) => { if (!open) resetForm(); setDialogOpen(open); }}>
            <DialogTrigger asChild>
              <Button variant="cta" size="lg">
                <PlusCircle className="w-5 h-5 mr-2" />
                Add Course
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingId ? "Edit Course" : "Create Course"}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="course-name">Course Name *</Label>
                  <Input
                    id="course-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., Data Science Fundamentals"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="course-desc">Description</Label>
                  <Input
                    id="course-desc"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Optional course description"
                  />
                </div>
                <Button
                  variant="cta"
                  className="w-full"
                  onClick={() => saveMutation.mutate()}
                  disabled={saveMutation.isPending || !name.trim()}
                >
                  {saveMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  {editingId ? "Update" : "Create"} Course
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : courses.length === 0 ? (
          <Card className="p-12 text-center bg-card/80 backdrop-blur-sm">
            <BookOpen className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
            <h3 className="text-xl font-bold mb-2">No courses yet</h3>
            <p className="text-muted-foreground mb-6">Create courses to easily assign them when issuing certificates.</p>
            <Button variant="cta" onClick={() => setDialogOpen(true)}>
              <PlusCircle className="w-5 h-5 mr-2" />
              Create Your First Course
            </Button>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course: any, index: number) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="p-6 bg-card/80 backdrop-blur-sm hover:border-secondary/50 transition-all glow-card">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 rounded-lg bg-secondary/20 flex items-center justify-center">
                      <BookOpen className="w-5 h-5 text-secondary" />
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm" onClick={() => openEdit(course)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete course?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently delete "{course.name}". Existing certificates referencing this course will not be affected.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => deleteMutation.mutate(course.id)}>
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                  <h3 className="font-bold text-lg mb-1">{course.name}</h3>
                  {course.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">{course.description}</p>
                  )}
                  <p className="text-xs text-muted-foreground mt-3">
                    Created {new Date(course.created_at).toLocaleDateString()}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Courses;
