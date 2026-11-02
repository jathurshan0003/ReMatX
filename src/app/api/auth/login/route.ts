import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { signToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
      include: { company: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    if (!password) {
      return NextResponse.json({ error: 'Password is required' }, { status: 400 });
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

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

    // Determine target redirect by role
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

    // Set cookie
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
