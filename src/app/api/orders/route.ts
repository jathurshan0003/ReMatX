import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { listingId, offerId, quantity: requestedQuantityInput, unitPrice: requestedUnitPrice, subtotal: requestedSubtotal, logisticsFee: requestedLogisticsFee, totalAmount: requestedTotalAmount, deliveryAddress } = body;

    // Authenticate user & enforce buyer role
    const token = req.cookies.get('rematx_token')?.value;
    const authUser = await getUserFromToken(token);

    if (!authUser) {
      return NextResponse.json({ error: 'Please sign in to place an order.' }, { status: 401 });
    }

    if (authUser.role === 'INSPECTOR' || authUser.role === 'ENGINEER') {
      return NextResponse.json(
        { error: 'Materials Auditors & Inspectors are not permitted to purchase commercial material lots.' },
        { status: 403 }
      );
    }

    const negotiatedOffer = offerId
      ? await prisma.offer.findUnique({ where: { id: offerId }, include: { order: true, listing: { include: { material: true } } } })
      : null;
    if (offerId && (!negotiatedOffer || negotiatedOffer.buyerId !== authUser.id || negotiatedOffer.status !== 'ACCEPTED' || negotiatedOffer.order)) {
      return NextResponse.json({ error: 'This negotiated offer is not accepted by both parties.' }, { status: 409 });
    }

    const effectiveListingId = negotiatedOffer?.listingId || listingId;
    const listing = negotiatedOffer?.listing || await prisma.listing.findUnique({
      where: { id: effectiveListingId },
      include: { material: true },
    });
    if (!listing) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 });
    }

    if (authUser.id === listing.sellerId) {
      return NextResponse.json(
        { error: 'You cannot purchase your own material stockpile.' },
        { status: 400 }
      );
    }

    const requestedQuantity = negotiatedOffer?.requestedQuantity ?? Number(requestedQuantityInput);
    if (!Number.isFinite(requestedQuantity) || requestedQuantity <= 0) {
      return NextResponse.json({ error: 'Purchase quantity must be greater than zero.' }, { status: 400 });
    }

    if (requestedQuantity < listing.minOrderQuantity) {
      return NextResponse.json(
        { error: `The minimum order quantity is ${listing.minOrderQuantity} ${listing.unit}.` },
        { status: 400 }
      );
    }

    const currentAvailable = listing.availableQuantity;
    if (currentAvailable <= 0 || listing.status === 'SOLD' || listing.material.status === 'SOLD') {
      return NextResponse.json(
        { error: 'This material is completely sold out and no longer available for purchase.' },
        { status: 400 }
      );
    }

    if (requestedQuantity > currentAvailable) {
      return NextResponse.json(
        {
          error: `Requested amount (${requestedQuantity} ${listing.unit}) exceeds available stock. Only ${currentAvailable} ${listing.unit} are currently available.`,
          availableQuantity: currentAvailable,
        },
        { status: 400 }
      );
    }

    const unitPrice = negotiatedOffer?.counterPrice ?? negotiatedOffer?.offeredPricePerUnit ?? Number(requestedUnitPrice);
    const subtotal = requestedQuantity * unitPrice;
    const logisticsFee = 450;
    const totalAmount = negotiatedOffer ? subtotal + logisticsFee : Number(requestedTotalAmount);
    const buyer = authUser;

    const result = await prisma.$transaction(async (tx) => {
      // 1. Decrement availableQuantity on listing
      const stockUpdate = await tx.listing.updateMany({
        where: {
          id: listing.id,
          status: 'ACTIVE',
          availableQuantity: { gte: requestedQuantity },
        },
        data: {
          availableQuantity: { decrement: requestedQuantity },
        },
      });

      if (stockUpdate.count === 0) {
        throw new Error('INSUFFICIENT_STOCK');
      }

      // 2. Decrement quantity on the material record automatically
      await tx.material.update({
        where: { id: listing.materialId },
        data: {
          quantity: { decrement: requestedQuantity },
        },
      });

      const count = await tx.order.count();
      const orderNumber = `ORD-2026-${String(count + 19).padStart(5, '0')}`;
      const invoiceNumber = `INV-2026-${String(count + 85).padStart(4, '0')}`;
      const trackingNumber = `TRK-LK-${Math.floor(100000 + Math.random() * 900000)}`;

      const createdOrder = await tx.order.create({
        data: {
          orderNumber,
          listingId: listing.id,
          buyerId: buyer.id,
          sellerId: listing.sellerId,
          quantity: requestedQuantity,
          unit: listing.unit,
          unitPrice,
          subtotal,
          taxAmount: 0.0,
          logisticsFee,
          totalAmount,
          paymentStatus: 'ESCROW_HELD',
          paymentMethod: 'ESCROW_BANK_TRANSFER',
          invoiceNumber,
          deliveryStatus: 'PICKUP_SCHEDULED',
          deliveryAddress: deliveryAddress || 'Contractor Delivery Site, Colombo',
          carrierName: 'Circular Haulage & Freight Logistics',
          trackingNumber,
          estimatedDelivery: new Date(Date.now() + 86400000 * 3),
          offerId: offerId || null,
        },
      });

      const updatedListing = await tx.listing.findUnique({
        where: { id: listing.id },
        select: { availableQuantity: true },
      });

      const updatedMaterial = await tx.material.findUnique({
        where: { id: listing.materialId },
        select: { quantity: true },
      });

      const remainingQuantity = updatedListing ? Math.max(0, updatedListing.availableQuantity) : 0;

      if (remainingQuantity <= 0) {
        await tx.listing.update({
          where: { id: listing.id },
          data: { status: 'SOLD', availableQuantity: 0 },
        });
        await tx.material.update({
          where: { id: listing.materialId },
          data: { status: 'SOLD', quantity: 0 },
        });
      }

      return {
        order: createdOrder,
        remainingQuantity,
      };
    });

    return NextResponse.json({
      success: true,
      order: result.order,
      remainingQuantity: result.remainingQuantity,
    });
  } catch (err: any) {
    if (err.message === 'INSUFFICIENT_STOCK') {
      return NextResponse.json(
        { error: 'Not enough material is available for this purchase. Another buyer may have just purchased from this lot. Please refresh and check remaining quantity.' },
        { status: 409 }
      );
    }
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
