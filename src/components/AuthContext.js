import React, { createContext, useState } from "react";

// Create the context
export const AuthContext = createContext();

// Create a provider component
export const AuthProvider = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false); // You can initialize this with `false` or get it from localStorage
  const [user, setUser] = useState(null);

  const login = (userData) => {
    setIsAdmin(userData.isAdmin);
    setUser(userData);
  };

  const logout = () => {
    setIsAdmin(false);
    setUser(null);
    localStorage.clear();
  };

  return (
    <AuthContext.Provider value={{ isAdmin, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
