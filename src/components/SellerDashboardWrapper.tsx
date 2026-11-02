'use client';

import React from 'react';
import { DashboardGuard } from '@/components/DashboardGuard';

const SELLER_ROLES = ['CONTRACTOR', 'SELLER', 'CONSTRUCTION_COMPANY', 'ADMIN'];

interface SellerDashboardWrapperProps {
  children: React.ReactNode;
}

export function SellerDashboardWrapper({ children }: SellerDashboardWrapperProps) {
  return (
    <DashboardGuard allowedRoles={SELLER_ROLES} dashboardLabel="Seller / Contractor Dashboard">
      {children}
    </DashboardGuard>
  );
}
