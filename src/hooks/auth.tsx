import React, { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { login as apiLogin } from '../api';
import type { User } from '../types/auth';

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string, remember: boolean) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const STORAGE_KEY = 'atlas_auth_user';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as User;
        setUser(parsed);
      } catch {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  const handleLogin = async (username: string, password: string, remember: boolean) => {
    setIsLoading(true);
    try {
      const loggedUser = await apiLogin(username, password);
      setUser(loggedUser);
      if (remember) {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(loggedUser));
      } else {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
    window.localStorage.removeItem(STORAGE_KEY);
  };

  const value: AuthContextValue = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login: handleLogin,
    logout: handleLogout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
};

