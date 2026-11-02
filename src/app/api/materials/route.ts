import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import QRCode from 'qrcode';
import { calculateCircularImpact } from '@/lib/carbon';
import { getUserFromToken } from '@/lib/auth';
import { SRI_LANKA_DISTRICTS } from '@/lib/constants';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const grade = searchParams.get('grade');
    const q = searchParams.get('q');

    const where: any = { status: 'AVAILABLE' };

    if (category) {
      where.category = { slug: category };
    }
    if (grade) {
      where.conditionGrade = grade;
    }
    if (q) {
      where.OR = [
        { name: { contains: q } },
        { description: { contains: q } },
        { materialId: { contains: q } },
      ];
    }

    const materials = await prisma.material.findMany({
      where,
      include: {
        category: true,
        passport: true,
        listings: { where: { status: 'ACTIVE' } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(materials);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Authenticate user & enforce seller/contractor role
    const token = req.cookies.get('rematx_token')?.value;
    const authUser = await getUserFromToken(token);

    if (!authUser) {
      return NextResponse.json({ error: 'Please sign in to list materials.' }, { status: 401 });
    }

    const allowedRoles = ['CONTRACTOR', 'SELLER', 'CONSTRUCTION_COMPANY', 'ADMIN'];
    if (!allowedRoles.includes(authUser.role)) {
      return NextResponse.json(
        { error: `Your account role (${authUser.role}) cannot list materials for sale. Only Demolition Contractors, Salvagers, and Admins can create listings.` },
        { status: 403 }
      );
    }

    const seller = authUser;

    const category = await prisma.materialCategory.findUnique({
      where: { slug: body.categorySlug || 'bricks' },
    });
    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    if (!SRI_LANKA_DISTRICTS.includes(body.locationCity)) {
      return NextResponse.json({ error: 'Please select one of Sri Lanka\'s 25 districts.' }, { status: 400 });
    }

    const rawImages = Array.isArray(body.images) ? body.images.filter(Boolean) : [];
    if (rawImages.length === 0) {
      return NextResponse.json(
        { error: 'At least one photo of the material must be uploaded for inspection and verification.' },
        { status: 400 }
      );
    }

    // All newly uploaded materials require inspector verification
    const status = 'UNDER_REVIEW';

    const existingIds = await prisma.material.findMany({
      select: { materialId: true },
    });
    const highestId = existingIds.reduce((highest, item) => {
      const match = item.materialId.match(/^RM-2026-(\d+)$/);
      return match ? Math.max(highest, Number(match[1])) : highest;
    }, 0);

    let material;
    let materialId = '';
    for (let attempt = 0; attempt < 5; attempt += 1) {
      materialId = `RM-2026-${String(highestId + attempt + 1).padStart(6, '0')}`;
      try {
        material = await prisma.material.create({
          data: {
            materialId,
            categoryId: category.id,
            sellerId: seller.id,
            name: body.name,
            description: body.description,
            dimensions: body.dimensions || '225 × 105 × 65 mm',
            quantity: Number(body.quantity) || 100,
            unit: body.unit || 'units',
            originBuilding: body.originBuilding,
            ageYears: Number(body.ageYears) || 10,
            previousUse: body.previousUse,
            recoveryDate: new Date(),
            conditionGrade: body.conditionGrade || 'GRADE_A',
            conditionNotes: body.conditionNotes,
            locationAddress: body.locationAddress || 'Depot Facility',
            locationCity: body.locationCity || 'Colombo',
            status,
            images: JSON.stringify(rawImages),
            documents: JSON.stringify([]),
          },
        });
        break;
      } catch (error: any) {
        if (error?.code !== 'P2002' || attempt === 4) throw error;
      }
    }

    if (!material) {
      return NextResponse.json({ error: 'Could not allocate a unique material ID. Please try again.' }, { status: 409 });
    }

    // Create listing
    if (body.pricePerUnit) {
      await prisma.listing.create({
        data: {
          materialId: material.id,
          sellerId: seller.id,
          title: material.name,
          pricePerUnit: Number(body.pricePerUnit),
          availableQuantity: material.quantity,
          unit: material.unit,
          listingType: 'BUY_NOW',
          status: 'ACTIVE',
        },
      });
    }

    return NextResponse.json({ success: true, materialId, id: material.id });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
