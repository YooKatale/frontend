import React, { createContext, useState, useEffect } from 'react';
import { fetchUserRole } from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const loadUserRole = async () => {
      try {
        const userRole = await fetchUserRole();
        setRole(userRole.role);
      } catch (error) {
        console.error('Failed to fetch user role', error);
      }
    };

    loadUserRole();
  }, []);

  return (
    <AuthContext.Provider value={{ user, role, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
