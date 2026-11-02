'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { ShieldX, LogIn, ArrowRight } from 'lucide-react';

interface DashboardGuardProps {
  allowedRoles: string[];
  dashboardLabel: string;
  children: React.ReactNode;
}

export function DashboardGuard({ allowedRoles, dashboardLabel, children }: DashboardGuardProps) {
  const { user, isAuthenticated, isLoading, getRoleDashboard } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center space-y-6 bg-white border border-slate-200 rounded-3xl p-10 shadow-sm">
          <div className="mx-auto w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center">
            <LogIn className="w-7 h-7 text-slate-500" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900">Sign In Required</h2>
            <p className="text-sm text-slate-500 mt-2">
              You must be signed in to access the <strong>{dashboardLabel}</strong>.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/auth/login"
              className="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-sm hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              Sign In
            </Link>
            <Link
              href="/auth/register"
              className="px-5 py-2.5 rounded-xl bg-slate-100 text-slate-800 font-bold text-sm hover:bg-slate-200 transition-colors"
            >
              Create Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!allowedRoles.includes(user.role)) {
    const correctDashboard = getRoleDashboard(user.role);
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center space-y-6 bg-white border border-red-100 rounded-3xl p-10 shadow-sm">
          <div className="mx-auto w-14 h-14 rounded-full bg-red-50 flex items-center justify-center">
            <ShieldX className="w-7 h-7 text-red-500" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900">Access Restricted</h2>
            <p className="text-sm text-slate-500 mt-2">
              Your role (<strong className="text-slate-800">{user.role}</strong>) does not have
              permission to access the <strong>{dashboardLabel}</strong>.
            </p>
          </div>
          <div className="bg-slate-50 rounded-2xl p-4 text-left text-xs text-slate-600 space-y-1 border border-slate-200">
            <p className="font-bold text-slate-800 text-sm mb-2">Allowed roles for this page:</p>
            {allowedRoles.map((r) => (
              <div key={r} className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                <span className="font-mono font-bold">{r}</span>
              </div>
            ))}
          </div>
          <Link
            href={correctDashboard}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-sm hover:bg-emerald-700 transition-colors"
          >
            Go to My Dashboard
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
