import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { getUserFromToken } from '@/lib/auth';

const USER_ROLES = ['BUYER', 'SELLER', 'CONTRACTOR', 'CONSTRUCTION_COMPANY', 'ARCHITECT', 'ENGINEER', 'INSPECTOR', 'ADMIN'];

async function requireAdmin(req: NextRequest) {
  const token = req.cookies.get('rematx_token')?.value;
  const user = await getUserFromToken(token);
  return user?.role === 'ADMIN' ? user : null;
}

export async function POST(req: NextRequest) {
  try {
    const admin = await requireAdmin(req);
    if (!admin) return NextResponse.json({ error: 'Administrator access required.' }, { status: 403 });

    const { name, email, password, role } = await req.json();
    const normalizedEmail = String(email || '').toLowerCase().trim();
    const normalizedRole = String(role || '').toUpperCase();

    if (!name || !normalizedEmail || !password || !USER_ROLES.includes(normalizedRole)) {
      return NextResponse.json({ error: 'Name, email, password, and a valid role are required.' }, { status: 400 });
    }
    if (String(password).length < 12) {
      return NextResponse.json({ error: 'Password must be at least 12 characters long.' }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (existing) return NextResponse.json({ error: 'A user with this email already exists.' }, { status: 409 });

    const user = await prisma.user.create({
      data: {
        name: String(name).trim(),
        email: normalizedEmail,
        passwordHash: await bcrypt.hash(password, 12),
        role: normalizedRole,
        isVerified: normalizedRole === 'ADMIN',
      },
      select: { id: true, name: true, email: true, role: true, isVerified: true },
    });

    return NextResponse.json({ success: true, user }, { status: 201 });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const admin = await requireAdmin(req);
    if (!admin) return NextResponse.json({ error: 'Administrator access required.' }, { status: 403 });

    const { userId } = await req.json();
    if (!userId) return NextResponse.json({ error: 'User ID is required.' }, { status: 400 });
    if (userId === admin.id) return NextResponse.json({ error: 'You cannot remove your own administrator account.' }, { status: 400 });

    const target = await prisma.user.findUnique({ where: { id: userId }, select: { id: true, companyId: true } });
    if (!target) return NextResponse.json({ error: 'User not found.' }, { status: 404 });

    await prisma.$transaction(async (tx) => {
      await tx.materialPassport.updateMany({ where: { currentOwnerId: userId }, data: { currentOwnerId: null } });
      await tx.notification.deleteMany({ where: { userId } });
      await tx.review.deleteMany({ where: { OR: [{ authorId: userId }, { targetUserId: userId }] } });
      await tx.message.deleteMany({ where: { OR: [{ senderId: userId }, { receiverId: userId }] } });
      await tx.order.deleteMany({ where: { OR: [{ buyerId: userId }, { sellerId: userId }] } });
      await tx.offer.deleteMany({ where: { buyerId: userId } });
      await tx.inspection.deleteMany({ where: { inspectorId: userId } });
      await tx.listing.deleteMany({ where: { sellerId: userId } });
      await tx.material.deleteMany({ where: { sellerId: userId } });
      await tx.user.delete({ where: { id: userId } });
      if (target.companyId && (await tx.user.count({ where: { companyId: target.companyId } })) === 0) {
        await tx.company.delete({ where: { id: target.companyId } });
      }
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}