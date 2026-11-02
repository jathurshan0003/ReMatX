import React from 'react';
import { prisma } from '@/lib/prisma';
import { InspectorDashboardClient } from '@/components/InspectorDashboardClient';
import { InspectorDashboardWrapper } from '@/components/InspectorDashboardWrapper';

export const revalidate = 0;

export default async function InspectorDashboardPage() {
  const materials = await prisma.material.findMany({
    include: {
      category: true,
      passport: true,
      inspections: {
        include: { tests: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  const standards = await prisma.standard.findMany();
  const verifiedPassports = await prisma.materialPassport.findMany({
    include: {
      material: { include: { category: true } },
    },
  });

  return (
    <InspectorDashboardWrapper>
      <InspectorDashboardClient
        pendingMaterials={materials}
        verifiedPassports={verifiedPassports}
        standards={standards}
      />
    </InspectorDashboardWrapper>
  );
}
