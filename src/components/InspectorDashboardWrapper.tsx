'use client';

import React from 'react';
import { DashboardGuard } from '@/components/DashboardGuard';

const INSPECTOR_ROLES = ['INSPECTOR', 'ENGINEER', 'ADMIN'];

interface InspectorDashboardWrapperProps {
  children: React.ReactNode;
}

export function InspectorDashboardWrapper({ children }: InspectorDashboardWrapperProps) {
  return (
    <DashboardGuard allowedRoles={INSPECTOR_ROLES} dashboardLabel="Inspector / Auditor Dashboard">
      {children}
    </DashboardGuard>
  );
}
