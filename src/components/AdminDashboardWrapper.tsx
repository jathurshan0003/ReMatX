'use client';

import React from 'react';
import { DashboardGuard } from '@/components/DashboardGuard';

const ADMIN_ROLES = ['ADMIN'];

interface AdminDashboardWrapperProps {
  children: React.ReactNode;
}

export function AdminDashboardWrapper({ children }: AdminDashboardWrapperProps) {
  return (
    <DashboardGuard allowedRoles={ADMIN_ROLES} dashboardLabel="Admin Control Panel">
      {children}
    </DashboardGuard>
  );
}
