import React from 'react';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { PassportViewer, PassportData } from '@/components/PassportViewer';
import Link from 'next/link';
import { ArrowLeft, ExternalLink, ShieldCheck } from 'lucide-react';

export const revalidate = 0;

interface PassportPageProps {
  params: {
    passportNumber: string;
  };
}

export default async function PassportPage({ params }: PassportPageProps) {
  const passport = await prisma.materialPassport.findUnique({
    where: { passportNumber: params.passportNumber },
    include: {
      material: {
        include: {
          category: true,
          inspections: {
            include: {
              standard: true,
              tests: true,
            },
            orderBy: { inspectionDate: 'desc' },
          },
        },
      },
      currentOwner: true,
    },
  });

  if (!passport) {
    notFound();
  }

  const mat = passport.material;

  let historyLog: any[] = [];
  try {
    historyLog = JSON.parse(passport.historyLog || '[]');
  } catch (e) {
    historyLog = [];
  }

  const passportData: PassportData = {
    passportNumber: passport.passportNumber,
    materialId: mat.materialId,
    materialName: mat.name,
    categoryName: mat.category.name,
    categorySlug: mat.category.slug,
    dimensions: mat.dimensions,
    quantity: mat.quantity,
    unit: mat.unit,
    weightKg: mat.weightKg,
    originSite: passport.originSite,
    originBuilding: mat.originBuilding,
    ageYears: mat.ageYears,
    previousUse: mat.previousUse,
    recoveryDate: mat.recoveryDate || passport.recoveryDate,
    manufacturingYear: passport.manufacturingYear,
    conditionGrade: mat.conditionGrade,
    verificationStatus: passport.verificationStatus,
    verifiedAt: passport.verifiedAt,
    verifiedByInspector: passport.verifiedByInspector,
    qrCodeDataUrl: passport.qrCodeDataUrl,
    embodiedCarbonSavedKg: passport.embodiedCarbonSavedKg,
    wasteDivertedKg: passport.wasteDivertedKg,
    circularityScore: passport.circularityScore,
    currentLocation: passport.currentLocation || mat.locationCity,
    reuseNotes: passport.reuseNotes,
    version: passport.version,
    historyLog,
    inspections: mat.inspections.map((insp) => ({
      inspectionDate: insp.inspectionDate,
      visualScore: insp.visualScore,
      assignedGrade: insp.assignedGrade,
      result: insp.result,
      remarks: insp.remarks,
      disclaimer: insp.disclaimer,
      standard: insp.standard ? { code: insp.standard.code, title: insp.standard.title } : null,
      tests: insp.tests.map((t) => ({
        testName: t.testName,
        method: t.method,
        unit: t.unit,
        recordedValue: t.recordedValue,
        thresholdRequired: t.thresholdRequired,
        status: t.status,
        notes: t.notes,
      })),
    })),
  };

  return (
    <div className="bg-slate-100/60 min-h-screen py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Top Back Navigation (Hidden in Print) */}
        <div className="flex items-center justify-between no-print">
          <Link
            href={`/materials/${mat.id}`}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-emerald-700 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-sm transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Material Listing</span>
          </Link>

          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 bg-emerald-100/80 px-3 py-1.5 rounded-xl border border-emerald-200">
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            <span>Cryptographically Verified Record</span>
          </div>
        </div>

        {/* Passport Certificate Component */}
        <PassportViewer data={passportData} />
      </div>
    </div>
  );
}
