import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import NeonSpinner from "@/components/NeonSpinner";

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, roles, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <NeonSpinner />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  if (!roles.includes("admin")) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default AdminRoute;
