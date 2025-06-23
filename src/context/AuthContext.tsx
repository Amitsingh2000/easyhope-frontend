import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User } from "../types";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (formData: FormData) => Promise<void>;
  logout: () => Promise<void>;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // ✅ Improved Session Check
  const checkSession = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.warn("No token found, setting user to null.");
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/auth/me", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Session check failed: ${response.status}`);
      }

      const userData = await response.json();
      if (!userData?.id) {
        throw new Error("Invalid user data received (missing id).");
      }

      console.log("Authenticated User:", userData);
      setUser(userData);
    } catch (error) {
      console.error("Session check error:", error);
      localStorage.removeItem("token");
      setUser(null);
    }

    setLoading(false);
  };

  useEffect(() => {
    checkSession();
  }, []);

  // ✅ Login Function
  const login = async (email: string, password: string) => {
    try {
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Login failed");

      const { token, user } = data;
      if (!token || !user?.id) {
        throw new Error("Invalid token or user data received.");
      }

      localStorage.setItem("token", token);
      setUser(user);
      console.log("Logged in User:", user);

      navigate(user.role === "ADMIN" ? "/admin" : "/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  // ✅ Register Function (with error handling)
  const register = async (formData: FormData) => {
    try {
      const response = await fetch("http://localhost:8080/api/users/register", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Registration failed");
      }

      const data = await response.json();
      console.log("Registration successful:", data);
      return data;
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  };

  // ✅ Logout Function (optimized)
  const logout = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        console.warn("No token found, logging out locally.");
        setUser(null);
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }

      const response = await fetch("http://localhost:8080/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error(`Logout failed: ${response.status}`);

      setUser(null);
      localStorage.removeItem("token");
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const isAdmin = user?.role === "ADMIN";

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isAdmin, login, register, logout, setUser }}>
      {!loading ? children : <p>Loading...</p>} {/* ✅ Proper loading handling */}
    </AuthContext.Provider>
  );
};

// ✅ Custom Hook for using AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
