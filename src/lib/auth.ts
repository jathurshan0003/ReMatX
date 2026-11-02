import jwt from 'jsonwebtoken';
import { prisma } from './prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'rematx-secret-development-key-2026-supersecure';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
  companyName?: string;
  companyId?: string | null;
  avatarUrl?: string | null;
  isVerified: boolean;
}

export function signToken(user: AuthUser): string {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      companyId: user.companyId,
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

export function verifyToken(token: string): any {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
}

export async function getUserFromToken(token?: string | null): Promise<AuthUser | null> {
  if (!token) return null;
  const decoded = verifyToken(token);
  if (!decoded || !decoded.id) return null;

  const user = await prisma.user.findUnique({
    where: { id: decoded.id },
    include: { company: true },
  });

  if (!user) return null;

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    companyName: user.company?.name,
    companyId: user.companyId,
    avatarUrl: user.avatarUrl,
    isVerified: user.isVerified,
  };
}


