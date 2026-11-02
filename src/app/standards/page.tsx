import React from 'react';
import { prisma } from '@/lib/prisma';
import { ShieldCheck, BookOpen, CheckCircle2, History, AlertTriangle, Layers, Scale } from 'lucide-react';
import Link from 'next/link';

export const revalidate = 0;

export default async function StandardsPage() {
  const standards = await prisma.standard.findMany({
    include: {
      category: true,
      inspections: {
        take: 3,
        include: {
          material: true,
        },
      },
    },
    orderBy: { code: 'asc' },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="border-b border-slate-200 pb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold mb-3">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Section 14: Technical Standards Registry</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900">
          Standards Engine &amp; Acceptance Criteria
        </h1>
        <p className="text-sm text-slate-600 mt-2 max-w-3xl leading-relaxed">
          ReMatX maintains a versioned library of official testing procedures, tolerance thresholds, and acceptance
          criteria. When an inspector audits a material, the certificate permanently references the exact standard
          version effective on the test date, preserving auditable compliance for statutory building review.
        </p>
      </div>

      {/* Standards Grid */}
      <div className="space-y-6">
        {standards.map((std) => {
          let criteria: Array<{ parameter: string; min?: number; max?: number; maxScore?: number; allowed?: string[]; unit: string; required: boolean }> = [];
          try {
            criteria = JSON.parse(std.acceptanceCriteria || '[]');
          } catch (e) {
            criteria = [];
          }

          return (
            <div
              key={std.id}
              className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6 hover:border-emerald-300 transition-colors"
            >
              {/* Header row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded">
                      {std.code}
                    </span>
                    <span className="text-xs text-slate-500 font-semibold">• Version {std.version}</span>
                    <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium">
                      {std.category.name}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 mt-2">{std.title}</h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Governing Body: <span className="font-semibold text-slate-700">{std.organization}</span>
                  </p>
                </div>

                <div className="text-right sm:self-start">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{std.status} Standard</span>
                  </span>
                  <span className="text-[11px] text-slate-400 block mt-1">
                    Effective: {new Date(std.effectiveDate).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Scope */}
              <div className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <span className="font-bold text-slate-900 block mb-1">Standard Scope &amp; Testing Methodology:</span>
                <p>{std.scope}</p>
              </div>

              {/* Acceptance Criteria Table */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  Mandatory Acceptance Criteria &amp; Threshold Limits
                </h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-slate-200 text-xs">
                    <thead>
                      <tr className="bg-slate-50 text-slate-700 text-left font-bold">
                        <th className="py-2.5 px-3">Testing Parameter</th>
                        <th className="py-2.5 px-3">Required Limit / Threshold</th>
                        <th className="py-2.5 px-3">Unit</th>
                        <th className="py-2.5 px-3 text-center">Compliance</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {criteria.map((c, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/60">
                          <td className="py-2.5 px-3 font-semibold text-slate-900">{c.parameter}</td>
                          <td className="py-2.5 px-3 font-mono text-slate-700">
                            {c.min !== undefined && `>= ${c.min}`}
                            {c.max !== undefined && `<= ${c.max}`}
                            {c.maxScore !== undefined && `Score <= ${c.maxScore}`}
                            {c.allowed && `Allowed: [${c.allowed.join(', ')}]`}
                          </td>
                          <td className="py-2.5 px-3 text-slate-500">{c.unit}</td>
                          <td className="py-2.5 px-3 text-center">
                            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                              Mandatory
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Linked Certifications / Inspections */}
              {std.inspections.length > 0 && (
                <div className="pt-4 border-t border-slate-100 text-xs flex items-center justify-between text-slate-500">
                  <div className="flex items-center gap-2">
                    <History className="w-4 h-4 text-emerald-600" />
                    <span>
                      Audited {std.inspections.length} materials currently in circulation under this specification.
                    </span>
                  </div>
                  <Link
                    href={`/marketplace?category=${std.category.slug}`}
                    className="font-bold text-emerald-700 hover:text-emerald-800"
                  >
                    View Materials &rarr;
                  </Link>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Engineering Authority Notice */}
      <div className="p-6 rounded-3xl bg-slate-900 text-white border border-slate-800 flex items-start gap-4">
        <Scale className="w-6 h-6 text-amber-400 shrink-0 mt-1" />
        <div className="text-xs space-y-2 text-slate-300">
          <h4 className="text-sm font-bold text-white">
            Statutory Versioning Principle (Section 14 &amp; 22):
          </h4>
          <p className="leading-relaxed">
            Standard records are immutable. When test criteria update, a new version is created (e.g. 2026.2) rather
            than overwriting existing benchmarks. Every Digital Material Passport links permanently to the standard
            version under which it was issued, safeguarding historical engineering validity for future architects and
            auditors.
          </p>
        </div>
      </div>
    </div>
  );
}
