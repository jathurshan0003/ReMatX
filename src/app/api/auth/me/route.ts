import { NextRequest, NextResponse } from 'next/server';
import { getUserFromToken } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('rematx_token')?.value;
    const authUser = await getUserFromToken(token);

    if (!authUser) {
      return NextResponse.json({ user: null });
    }

    return NextResponse.json({ user: authUser });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
