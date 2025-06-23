import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface ProtectedRouteProps {
  requiredRole: "USER" | "ADMIN";
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ requiredRole }) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    //console.log("User not authenticated, redirecting to login...");
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== requiredRole) {
    //console.log(`Unauthorized access: Redirecting to ${user?.role === "ADMIN" ? "/admin" : "/dashboard"}`);
    return <Navigate to={user?.role === "ADMIN" ? "/admin" : "/dashboard"} replace />;
  }

  //console.log("User authorized, rendering page...");
  return <Outlet />;
};

export default ProtectedRoute;
