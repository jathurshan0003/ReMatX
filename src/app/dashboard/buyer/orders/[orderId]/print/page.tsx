import React from 'react';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';
import { getUserFromToken } from '@/lib/auth';
import PrintReceiptClient from './PrintReceiptClient';

interface Props {
  params: { orderId: string };
}

export const revalidate = 0;

export default async function PrintReceiptPage({ params }: Props) {
  const cookieStore = await cookies();
  const token = cookieStore.get('rematx_token')?.value;
  const authUser = await getUserFromToken(token);

  const order = await prisma.order.findUnique({
    where: { id: params.orderId },
    include: {
      buyer: {
        include: { company: true },
      },
      seller: {
        include: { company: true },
      },
      listing: {
        include: {
          material: {
            include: {
              category: true,
              inspections: {
                include: { inspector: true, standard: true },
                orderBy: { createdAt: 'desc' },
                take: 1,
              },
            },
          },
        },
      },
    },
  });

  if (!order) notFound();

  // Only buyer, seller, or admin can view receipt
  if (
    authUser &&
    authUser.role !== 'ADMIN' &&
    authUser.id !== order.buyerId &&
    authUser.id !== order.sellerId
  ) {
    notFound();
  }

  const inspection = order.listing.material.inspections[0] ?? null;
  const images: string[] = (() => {
    try { return JSON.parse(order.listing.material.images); } catch { return []; }
  })();

  return (
    <PrintReceiptClient
      order={order as any}
      inspection={inspection as any}
      images={images}
    />
  );
}
