
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  
  // If still loading auth state, show nothing (or could add a loading spinner)
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }
  
  // If not authenticated, redirect to login
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  
  // If authenticated, show the protected content
  return <>{children}</>;
};

export default ProtectedRoute;
