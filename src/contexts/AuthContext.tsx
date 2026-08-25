import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole } from '../types';
import { authService } from '../services/auth/authService';

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  activeRole: UserRole;
  setActiveRole: (role: UserRole) => void;
  setUser: (user: UserProfile | null) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  logout: () => void;
  hasRole: (role: UserRole) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUserState] = useState<UserProfile | null>(() => authService.getCurrentUser());
  const [activeRole, setActiveRole] = useState<UserRole>('STUDENT');

  useEffect(() => {
    if (user?.roles && user.roles.length > 0) {
      if (!user.roles.includes(activeRole)) {
        setActiveRole(user.roles[0]);
      }
    }
  }, [user]);

  const setUser = (newUser: UserProfile | null) => {
    setUserState(newUser);
    if (newUser) {
      authService.saveUser(newUser);
    } else {
      authService.logout();
    }
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    if (!user) return;
    const updated = { ...user, ...updates };
    setUser(updated);
  };

  const logout = () => {
    authService.logout();
    setUserState(null);
  };

  const hasRole = (role: UserRole) => {
    return authService.hasRole(user, role);
  };

  const isAdmin = Boolean(user?.roles?.includes('ENEMIND_ADMIN') || user?.email === 'enemindcompany@gmail.com');

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin,
        activeRole,
        setActiveRole,
        setUser,
        updateProfile,
        logout,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
