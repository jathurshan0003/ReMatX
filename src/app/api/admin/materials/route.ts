import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromToken } from '@/lib/auth';

async function requireAdmin(req: NextRequest) {
  const token = req.cookies.get('rematx_token')?.value;
  const user = await getUserFromToken(token);
  return user?.role === 'ADMIN' ? user : null;
}

export async function DELETE(req: NextRequest) {
  try {
    const admin = await requireAdmin(req);
    if (!admin) return NextResponse.json({ error: 'Administrator access required.' }, { status: 403 });

    const { materialId } = await req.json();
    if (!materialId) return NextResponse.json({ error: 'Material ID is required.' }, { status: 400 });

    const material = await prisma.material.findUnique({ where: { id: materialId } });
    if (!material) return NextResponse.json({ error: 'Material not found.' }, { status: 404 });

    await prisma.$transaction(async (tx) => {
      const listings = await tx.listing.findMany({ where: { materialId }, select: { id: true } });
      const listingIds = listings.map((listing) => listing.id);

      if (listingIds.length > 0) {
        await tx.order.deleteMany({ where: { listingId: { in: listingIds } } });
        await tx.offer.deleteMany({ where: { listingId: { in: listingIds } } });
        await tx.listing.deleteMany({ where: { id: { in: listingIds } } });
      }

      await tx.material.delete({ where: { id: materialId } });
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}