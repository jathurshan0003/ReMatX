import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { listingId, requestedQuantity, offeredPricePerUnit, notes } = body;

    // Authenticate user & enforce buyer role
    const token = req.cookies.get('rematx_token')?.value;
    const authUser = await getUserFromToken(token);

    if (!authUser) {
      return NextResponse.json({ error: 'Please sign in to submit an offer or quotation request.' }, { status: 401 });
    }

    if (authUser.role === 'INSPECTOR' || authUser.role === 'ENGINEER') {
      return NextResponse.json(
        { error: 'Materials Auditors & Inspectors are not permitted to submit commercial offers.' },
        { status: 403 }
      );
    }

    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
    });
    if (!listing) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 });
    }

    if (authUser.id === listing.sellerId) {
      return NextResponse.json(
        { error: 'You cannot submit an offer on your own material listing.' },
        { status: 400 }
      );
    }

    const reqQty = Number(requestedQuantity);
    if (!Number.isFinite(reqQty) || reqQty <= 0) {
      return NextResponse.json({ error: 'Requested quantity must be greater than zero.' }, { status: 400 });
    }

    if (reqQty > listing.availableQuantity) {
      return NextResponse.json(
        {
          error: `Requested amount (${reqQty} ${listing.unit}) exceeds available stock. Only ${listing.availableQuantity} ${listing.unit} are available.`,
        },
        { status: 400 }
      );
    }

    const buyer = authUser;

    const totalOfferAmount = reqQty * Number(offeredPricePerUnit);

    const offer = await prisma.offer.create({
      data: {
        listingId: listing.id,
        buyerId: buyer.id,
        requestedQuantity: Number(requestedQuantity),
        offeredPricePerUnit: Number(offeredPricePerUnit),
        totalOfferAmount,
        notes,
        status: 'PENDING',
      },
    });

    return NextResponse.json({ success: true, offer });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const token = req.cookies.get('rematx_token')?.value;
    const authUser = await getUserFromToken(token);
    if (!authUser) return NextResponse.json({ error: 'Please sign in.' }, { status: 401 });

    const { offerId, action, counterPrice } = await req.json();
    const offer = await prisma.offer.findUnique({
      where: { id: offerId },
      include: { listing: true },
    });
    if (!offer) return NextResponse.json({ error: 'Offer not found.' }, { status: 404 });

    const isSeller = authUser.id === offer.listing.sellerId || authUser.role === 'ADMIN';
    const isBuyer = authUser.id === offer.buyerId;
    if (!isSeller && !isBuyer) return NextResponse.json({ error: 'You cannot modify this offer.' }, { status: 403 });

    if (!['ACCEPT', 'REJECT', 'COUNTER', 'ACCEPT_COUNTER'].includes(action)) {
      return NextResponse.json({ error: 'Invalid negotiation action.' }, { status: 400 });
    }

    if (action === 'COUNTER') {
      const price = Number(counterPrice);
      if (!isSeller || !Number.isFinite(price) || price <= 0) {
        return NextResponse.json({ error: 'A seller counter price greater than zero is required.' }, { status: 400 });
      }
      const updated = await prisma.offer.update({
        where: { id: offer.id },
        data: { counterPrice: price, status: 'COUNTERED', totalOfferAmount: offer.requestedQuantity * price },
      });
      return NextResponse.json({ success: true, offer: updated });
    }

    if (action === 'ACCEPT_COUNTER' && (!isBuyer || offer.status !== 'COUNTERED' || !offer.counterPrice)) {
      return NextResponse.json({ error: 'Only the buyer can accept an active counter-offer.' }, { status: 400 });
    }
    if (action === 'ACCEPT' && !isSeller) {
      return NextResponse.json({ error: 'Only the seller can accept the original offer.' }, { status: 403 });
    }
    if (action === 'REJECT' && !isSeller) {
      return NextResponse.json({ error: 'Only the seller can reject an offer.' }, { status: 403 });
    }

    const updated = await prisma.offer.update({
      where: { id: offer.id },
      data: { status: action === 'REJECT' ? 'REJECTED' : 'ACCEPTED' },
    });
    return NextResponse.json({ success: true, offer: updated });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
