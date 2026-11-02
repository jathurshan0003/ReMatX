'use client';

import React from 'react';
import { DashboardGuard } from '@/components/DashboardGuard';

const BUYER_ROLES = ['BUYER', 'ARCHITECT', 'ADMIN'];

interface BuyerDashboardWrapperProps {
  children: React.ReactNode;
}

export function BuyerDashboardWrapper({ children }: BuyerDashboardWrapperProps) {
  return (
    <DashboardGuard allowedRoles={BUYER_ROLES} dashboardLabel="Buyer / Specifier Dashboard">
      {children}
    </DashboardGuard>
  );
}
