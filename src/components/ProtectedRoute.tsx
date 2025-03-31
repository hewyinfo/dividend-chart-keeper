
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  // Development bypass option
  const [bypassAuth, setBypassAuth] = useState(() => {
    return localStorage.getItem("bypassAuth") === "true";
  });
  const { user, loading } = useAuth();
  
  // Toggle auth bypass
  const toggleBypass = () => {
    const newValue = !bypassAuth;
    setBypassAuth(newValue);
    localStorage.setItem("bypassAuth", String(newValue));
  };
  
  // If still loading auth state, show loading indicator
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }
  
  // If bypassing auth or authenticated, show the protected content
  if (bypassAuth || user) {
    return (
      <>
        {/* Development mode indicator */}
        {bypassAuth && !user && (
          <div className="fixed bottom-4 right-4 z-50">
            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-2 rounded shadow-lg flex items-center space-x-2">
              <span className="text-xs font-medium">DEV MODE: Auth Bypassed</span>
              <button 
                onClick={toggleBypass}
                className="bg-yellow-500 hover:bg-yellow-600 text-white text-xs px-2 py-1 rounded"
              >
                Disable
              </button>
            </div>
          </div>
        )}
        {children}
      </>
    );
  }
  
  // If not authenticated and not bypassing, redirect to login
  return <Navigate to="/auth" replace />;
};

export default ProtectedRoute;
