import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { signToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get('content-type') || '';
    const payload = contentType.includes('multipart/form-data')
      ? await req.formData()
      : await req.json();
    const getValue = (key: string) => {
      const value = payload instanceof FormData ? payload.get(key) : payload[key];
      return typeof value === 'string' ? value : '';
    };
    const name = getValue('name');
    const email = getValue('email');
    const password = getValue('password');
    const role = getValue('role');
    const companyName = getValue('companyName');
    const companyType = getValue('companyType');
    const phone = getValue('phone');
    const avatar = payload instanceof FormData ? payload.get('avatar') : null;

    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { error: 'Name, email, password, and role are required' },
        { status: 400 }
      );
    }

    const normalizedRole = String(role).toUpperCase();
    const publicRoles = ['BUYER', 'SELLER', 'CONTRACTOR', 'CONSTRUCTION_COMPANY', 'ARCHITECT', 'ENGINEER', 'INSPECTOR'];
    if (!publicRoles.includes(normalizedRole)) {
      return NextResponse.json({ error: 'This role cannot be created through public registration.' }, { status: 403 });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check if user exists
    const existing = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 409 }
      );
    }

    // Create Company if provided
    let companyId: string | null = null;
    if (companyName) {
      const company = await prisma.company.create({
        data: {
          name: companyName,
          companyType: companyType || (normalizedRole === 'CONTRACTOR' ? 'DEMOLITION' : 'CONTRACTOR'),
          verifiedStatus: 'PENDING',
          contactEmail: normalizedEmail,
          contactPhone: phone || null,
        },
      });
      companyId = company.id;
    }

    const passwordHash = await bcrypt.hash(password, 10);
    let avatarUrl: string | null = null;
    if (avatar instanceof File && avatar.size > 0) {
      const allowedTypes = ['image/png', 'image/jpeg', 'image/webp'];
      if (!allowedTypes.includes(avatar.type)) {
        return NextResponse.json({ error: 'Profile photo must be PNG, JPG, or WebP.' }, { status: 400 });
      }
      if (avatar.size > 2 * 1024 * 1024) {
        return NextResponse.json({ error: 'Profile photo must be 2 MB or smaller.' }, { status: 400 });
      }
      const imageBuffer = Buffer.from(await avatar.arrayBuffer());
      avatarUrl = `data:${avatar.type};base64,${imageBuffer.toString('base64')}`;
    }

    const user = await prisma.user.create({
      data: {
        name,
        email: normalizedEmail,
        passwordHash,
        role: normalizedRole,
        phone: phone || null,
        companyId,
        isVerified: false,
        avatarUrl,
      },
      include: { company: true },
    });

    const authUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      companyId: user.companyId,
      companyName: user.company?.name,
      avatarUrl: user.avatarUrl,
      isVerified: user.isVerified,
    };

    const token = signToken(authUser);

    // Determine redirect
    let redirectUrl = '/marketplace';
    if (user.role === 'CONTRACTOR' || user.role === 'SELLER') {
      redirectUrl = '/dashboard/seller';
    } else if (user.role === 'BUYER' || user.role === 'ARCHITECT') {
      redirectUrl = '/dashboard/buyer';
    } else if (user.role === 'INSPECTOR' || user.role === 'ENGINEER') {
      redirectUrl = '/dashboard/inspector';
    } else if (user.role === 'ADMIN') {
      redirectUrl = '/dashboard/admin';
    }

    const res = NextResponse.json({
      success: true,
      user: authUser,
      redirectUrl,
    });

    res.cookies.set('rematx_token', token, {
      httpOnly: false,
      secure: false,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return res;
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
