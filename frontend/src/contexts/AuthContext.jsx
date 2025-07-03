import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);

  const login = async (credentials) => {
    setLoading(true);
    // Mock login - replace with actual API call
    setTimeout(() => {
      setUser({
        id: 1,
        username: credentials.username,
        email: credentials.email || `${credentials.username}@example.com`,
      });
      setIsAuthenticated(true);
      setLoading(false);
    }, 1000);
  };

  const register = async (userData) => {
    setLoading(true);
    // Mock register - replace with actual API call
    setTimeout(() => {
      setUser({
        id: Date.now(),
        username: userData.username,
        email: userData.email,
      });
      setIsAuthenticated(true);
      setLoading(false);
    }, 1000);
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
