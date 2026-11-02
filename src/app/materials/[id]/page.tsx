import React from 'react';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { MaterialDetailsClient } from '@/components/MaterialDetailsClient';

export const revalidate = 0;

interface MaterialPageProps {
  params: {
    id: string;
  };
}

export default async function MaterialPage({ params }: MaterialPageProps) {
  const material = await prisma.material.findUnique({
    where: { id: params.id },
    include: {
      category: true,
      seller: {
        include: { company: true },
      },
      passport: true,
      listings: {
        where: { status: 'ACTIVE' },
      },
      inspections: {
        include: {
          standard: true,
          tests: true,
        },
        orderBy: { inspectionDate: 'desc' },
      },
    },
  });

  if (!material) {
    notFound();
  }

  return <MaterialDetailsClient material={material} />;
}
