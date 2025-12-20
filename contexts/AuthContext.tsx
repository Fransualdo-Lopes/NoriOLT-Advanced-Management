
import React, { createContext, useContext, useState, useEffect } from 'react';
// Corrected import: UserRole is exported from '../roles', not '../types'
import { User } from '../types';
import { Permission, ROLE_PERMISSIONS, UserRole } from '../roles';
import { authService } from '../services/authService';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (credentials: any) => Promise<void>;
  logout: () => void;
  hasPermission: (permission: Permission) => boolean;
  role: UserRole | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(authService.getCurrentUser());
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(authService.isAuthenticated());

  const login = async (credentials: any) => {
    const response = await authService.login(credentials);
    setUser(response.user);
    setIsAuthenticated(true);
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  const hasPermission = (permission: Permission): boolean => {
    if (!user) return false;
    const permissions = ROLE_PERMISSIONS[user.role as UserRole] || [];
    return permissions.includes(permission);
  };

  const role = user ? (user.role as UserRole) : null;

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, hasPermission, role }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
