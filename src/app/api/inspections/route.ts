import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromToken } from '@/lib/auth';
import { cookies } from 'next/headers';

const AUDIT_ROLES = ['INSPECTOR', 'ENGINEER', 'ADMIN'];

export async function POST(req: NextRequest) {
  try {
    // --- Auth enforcement ---
    const cookieStore = await cookies();
    const token = cookieStore.get('rematx_token')?.value;
    const authUser = await getUserFromToken(token);

    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized. Please sign in.' }, { status: 401 });
    }
    if (!AUDIT_ROLES.includes(authUser.role)) {
      return NextResponse.json(
        { error: `Forbidden. Only ${AUDIT_ROLES.join(', ')} roles can conduct inspections.` },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { materialId, standardId, visualScore, assignedGrade, result, remarks, tests } = body;
    const allowedGrades = ['GRADE_A', 'GRADE_B', 'GRADE_C', 'GRADE_D', 'REJECTED'];

    if (!allowedGrades.includes(assignedGrade)) {
      return NextResponse.json({ error: 'Please select a valid inspection outcome.' }, { status: 400 });
    }

    if (assignedGrade === 'REJECTED' && !String(remarks || '').trim()) {
      return NextResponse.json({ error: 'A rejection reason is required.' }, { status: 400 });
    }

    // Use the authenticated user as the inspector
    const inspector = await prisma.user.findUnique({ where: { id: authUser.id } });
    if (!inspector) {
      return NextResponse.json({ error: 'Inspector user not found' }, { status: 400 });
    }

    const material = await prisma.material.findUnique({
      where: { id: materialId },
    });
    if (!material) {
      return NextResponse.json({ error: 'Material not found' }, { status: 404 });
    }

    // 1. Create inspection record
    const inspection = await prisma.inspection.create({
      data: {
        materialId: material.id,
        inspectorId: inspector.id,
        standardId: standardId || null,
        visualScore: visualScore || 90,
        assignedGrade: assignedGrade || 'GRADE_A',
        result: result || 'PASSED',
        remarks: remarks || 'Material inspected and certified according to SLSI standard benchmarks.',
        disclaimer: 'Platform visual & non-destructive audit. Load-bearing structural reuse subject to project engineer validation.',
      },
    });

    // 2. Insert test rows
    if (tests && Array.isArray(tests)) {
      await prisma.inspectionTest.createMany({
        data: tests.map((t: any) => ({
          inspectionId: inspection.id,
          testName: t.testName,
          method: t.method || 'Standard SLSI Probe',
          unit: t.unit || '',
          recordedValue: String(t.recordedValue || '15.0'),
          thresholdRequired: String(t.thresholdRequired || 'Pass'),
          status: t.status || 'PASS',
          notes: t.notes || null,
        })),
      });
    }

    // 3. Update material conditionGrade and status
    await prisma.material.update({
      where: { id: material.id },
      data: {
        conditionGrade: assignedGrade,
        status: assignedGrade === 'REJECTED' ? 'REJECTED' : 'AVAILABLE',
      },
    });

    return NextResponse.json({
      success: true,
      inspectionId: inspection.id,
      verified: assignedGrade !== 'REJECTED',
      status: assignedGrade === 'REJECTED' ? 'REJECTED' : 'AVAILABLE',
    });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
