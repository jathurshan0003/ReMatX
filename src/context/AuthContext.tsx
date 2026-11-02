'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthUser } from '@/lib/auth';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: AuthUser | null;
  role: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password?: string) => Promise<{ success: boolean; redirectUrl?: string; error?: string }>;
  register: (data: any) => Promise<{ success: boolean; redirectUrl?: string; error?: string }>;
  logout: () => Promise<void>;
  getRoleDashboard: (role?: string | null) => string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  const getRoleDashboard = (r?: string | null) => {
    const activeRole = r || user?.role;
    switch (activeRole) {
      case 'CONTRACTOR':
      case 'SELLER':
      case 'CONSTRUCTION_COMPANY':
        return '/dashboard/seller';
      case 'BUYER':
      case 'ARCHITECT':
        return '/dashboard/buyer';
      case 'INSPECTOR':
      case 'ENGINEER':
        return '/dashboard/inspector';
      case 'ADMIN':
        return '/dashboard/admin';
      default:
        return '/marketplace';
    }
  };

  const fetchUser = async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error(err);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const login = async (email: string, password?: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Login failed' };
      }

      setUser(data.user);
      router.refresh();
      return { success: true, redirectUrl: data.redirectUrl };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const register = async (formData: any) => {
    try {
      const isMultipart = formData instanceof FormData;
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        ...(isMultipart ? {} : { headers: { 'Content-Type': 'application/json' } }),
        body: isMultipart ? formData : JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Registration failed' };
      }

      setUser(data.user);
      router.refresh();
      return { success: true, redirectUrl: data.redirectUrl };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (e) {
      console.error(e);
    }
    setUser(null);
    router.push('/auth/login');
    router.refresh();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || null,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        getRoleDashboard,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
