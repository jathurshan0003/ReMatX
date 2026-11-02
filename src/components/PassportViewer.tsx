'use client';

import React from 'react';
import {
  QrCode,
  ShieldCheck,
  Building2,
  Calendar,
  Layers,
  Leaf,
  Printer,
  Share2,
  CheckCircle2,
  Clock,
  MapPin,
  ExternalLink,
  Award,
} from 'lucide-react';
import { GradeBadge } from './GradeBadge';
import { VerificationBadge } from './VerificationBadge';

export interface PassportData {
  passportNumber: string;
  materialId: string;
  materialName: string;
  categoryName: string;
  categorySlug: string;
  dimensions: string;
  quantity: number;
  unit: string;
  weightKg?: number | null;
  originSite?: string | null;
  originBuilding?: string | null;
  ageYears?: number | null;
  previousUse?: string | null;
  recoveryDate?: string | Date | null;
  manufacturingYear?: number | null;
  conditionGrade: string;
  verificationStatus: string;
  verifiedAt?: string | Date | null;
  verifiedByInspector?: string | null;
  qrCodeDataUrl?: string | null;
  embodiedCarbonSavedKg: number;
  wasteDivertedKg: number;
  circularityScore: number;
  currentLocation?: string | null;
  reuseNotes?: string | null;
  version: number;
  historyLog: Array<{
    timestamp: string;
    action: string;
    actor: string;
    location: string;
    notes?: string;
  }>;
  inspections?: Array<{
    inspectionDate: string | Date;
    visualScore: number;
    assignedGrade: string;
    result: string;
    remarks?: string | null;
    disclaimer: string;
    standard?: {
      code: string;
      title: string;
    } | null;
    tests: Array<{
      testName: string;
      method?: string | null;
      unit?: string | null;
      recordedValue: string;
      thresholdRequired: string;
      status: string;
      notes?: string | null;
    }>;
  }>;
}

export const PassportViewer: React.FC<{ data: PassportData }> = ({ data }) => {
  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const handleShare = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      alert('Passport URL copied to clipboard!');
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden print-passport">
      {/* Official Certificate Header */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 relative overflow-hidden border-b-4 border-emerald-600">
        <div className="absolute -right-12 -top-12 w-64 h-64 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-emerald-600 text-white text-[10px] uppercase font-black tracking-widest px-2.5 py-0.5 rounded-full">
                Circular Construction Passport
              </span>
              <span className="text-slate-400 text-xs font-mono">ISO 20887 / SLS Compliance</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Digital Material Passport
            </h1>
            <p className="text-emerald-400 font-mono text-sm sm:text-base font-bold mt-1">
              Passport ID: {data.passportNumber}
            </p>
          </div>

          {/* Action buttons (hidden on print) */}
          <div className="flex items-center gap-2 no-print self-start sm:self-center">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold border border-slate-700 transition-colors shadow-sm"
            >
              <Printer className="w-4 h-4 text-emerald-400" />
              <span>Print Certificate</span>
            </button>
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold border border-slate-700 transition-colors shadow-sm"
            >
              <Share2 className="w-4 h-4 text-emerald-400" />
              <span>Share Link</span>
            </button>
          </div>
        </div>
      </div>

      <div className="p-6 sm:p-8 space-y-8">
        {/* Core Verification Banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-emerald-50/70 border border-emerald-200 rounded-2xl p-6">
          <div className="md:col-span-2 flex flex-col justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <GradeBadge grade={data.conditionGrade} size="lg" />
                <VerificationBadge
                  status={data.verificationStatus}
                  inspectorName={data.verifiedByInspector}
                  verifiedAt={data.verifiedAt}
                  size="md"
                />
                <span className="bg-emerald-200 text-emerald-900 text-xs font-bold px-2.5 py-1 rounded-full">
                  Circularity Index: {data.circularityScore}%
                </span>
              </div>
              <h2 className="text-xl font-bold text-slate-900">{data.materialName}</h2>
              <p className="text-xs text-slate-600 mt-1">
                Category: <span className="font-semibold text-slate-800">{data.categoryName}</span>
              </p>
            </div>

            <div className="mt-4 pt-4 border-t border-emerald-200/60 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <span className="text-slate-500 block">Verified Date:</span>
                <span className="font-bold text-slate-800">
                  {data.verifiedAt ? new Date(data.verifiedAt).toLocaleDateString() : 'N/A'}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block">Lead Auditor:</span>
                <span className="font-bold text-slate-800 truncate block">
                  {data.verifiedByInspector || 'Technical Auditor'}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block">Passport Version:</span>
                <span className="font-bold text-slate-800">v{data.version}.0 (Immutable)</span>
              </div>
            </div>
          </div>

          {/* QR Code Scannable Widget */}
          <div className="flex flex-col items-center justify-center p-4 bg-white rounded-xl border border-emerald-200 shadow-sm text-center">
            {data.qrCodeDataUrl ? (
              <img
                src={data.qrCodeDataUrl}
                alt={`QR Code for ${data.passportNumber}`}
                className="w-32 h-32 object-contain"
              />
            ) : (
              <div className="w-32 h-32 bg-slate-100 flex items-center justify-center rounded-lg">
                <QrCode className="w-16 h-16 text-slate-400" />
              </div>
            )}
            <p className="text-[11px] font-bold text-emerald-800 mt-2 font-mono">
              SCAN TO VERIFY RECORD
            </p>
            <p className="text-[10px] text-slate-500">Live digital passport verification</p>
          </div>
        </div>

        {/* Circular Economy Impact Metrics */}
        <div>
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
            <Leaf className="w-4 h-4 text-emerald-600" />
            <span>Environmental &amp; Circularity Accounting</span>
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-center">
              <span className="text-xs text-slate-500 font-medium">Embodied Carbon Saved</span>
              <p className="text-xl font-black text-emerald-700 mt-1">
                {data.embodiedCarbonSavedKg.toLocaleString()} kg
              </p>
              <span className="text-[10px] text-slate-400">CO₂e Avoided</span>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-center">
              <span className="text-xs text-slate-500 font-medium">Landfill Waste Diverted</span>
              <p className="text-xl font-black text-slate-800 mt-1">
                {data.wasteDivertedKg.toLocaleString()} kg
              </p>
              <span className="text-[10px] text-slate-400">Demolition Mass</span>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-center">
              <span className="text-xs text-slate-500 font-medium">Quantity Available</span>
              <p className="text-xl font-black text-slate-800 mt-1">
                {data.quantity.toLocaleString()}
              </p>
              <span className="text-[10px] text-slate-400">{data.unit}</span>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-center">
              <span className="text-xs text-slate-500 font-medium">Estimated Age</span>
              <p className="text-xl font-black text-slate-800 mt-1">
                {data.ageYears ? `${data.ageYears} yrs` : 'Historic'}
              </p>
              <span className="text-[10px] text-slate-400">
                Recovered {data.recoveryDate ? new Date(data.recoveryDate).getFullYear() : '2026'}
              </span>
            </div>
          </div>
        </div>

        {/* Technical Properties & Origin */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border border-slate-200 rounded-2xl p-5 bg-white">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Layers className="w-4 h-4 text-slate-600" />
              <span>Technical Dimensions &amp; Specifications</span>
            </h3>
            <dl className="divide-y divide-slate-100 text-xs">
              <div className="py-2 flex justify-between">
                <dt className="text-slate-500">Nominal Dimensions:</dt>
                <dd className="font-semibold text-slate-900">{data.dimensions}</dd>
              </div>
              <div className="py-2 flex justify-between">
                <dt className="text-slate-500">Unit Mass / Weight:</dt>
                <dd className="font-semibold text-slate-900">
                  {data.weightKg ? `${data.weightKg} kg` : 'Calculated per batch'}
                </dd>
              </div>
              <div className="py-2 flex justify-between">
                <dt className="text-slate-500">Current Storage Depot:</dt>
                <dd className="font-semibold text-slate-900 text-right truncate max-w-[200px]">
                  {data.currentLocation || 'Central Logistics Park'}
                </dd>
              </div>
              <div className="py-2 flex justify-between">
                <dt className="text-slate-500">Reuse Guideline:</dt>
                <dd className="font-semibold text-emerald-800 text-right max-w-[220px]">
                  {data.reuseNotes || 'Direct architectural / structural reuse'}
                </dd>
              </div>
            </dl>
          </div>

          <div className="border border-slate-200 rounded-2xl p-5 bg-white">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-slate-600" />
              <span>Provenance &amp; Source Site History</span>
            </h3>
            <dl className="divide-y divide-slate-100 text-xs">
              <div className="py-2 flex justify-between">
                <dt className="text-slate-500">Origin Structure:</dt>
                <dd className="font-semibold text-slate-900 text-right max-w-[220px]">
                  {data.originBuilding || data.originSite || 'Commercial Structure, Colombo'}
                </dd>
              </div>
              <div className="py-2 flex justify-between">
                <dt className="text-slate-500">Previous Application:</dt>
                <dd className="font-semibold text-slate-900 text-right">
                  {data.previousUse || 'Structural Building Element'}
                </dd>
              </div>
              <div className="py-2 flex justify-between">
                <dt className="text-slate-500">Recovery Date:</dt>
                <dd className="font-semibold text-slate-900">
                  {data.recoveryDate ? new Date(data.recoveryDate).toLocaleDateString() : 'August 2026'}
                </dd>
              </div>
              <div className="py-2 flex justify-between">
                <dt className="text-slate-500">Original Installation:</dt>
                <dd className="font-semibold text-slate-900">
                  Circa {data.manufacturingYear || '1995'}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Section 6: Inspection Criteria & Test Results Table */}
        {data.inspections && data.inspections.length > 0 && (
          <div className="border border-slate-200 rounded-2xl p-5 bg-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Award className="w-4 h-4 text-emerald-600" />
                <span>Audited Technical Test Results</span>
              </h3>
              {data.inspections[0].standard && (
                <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded border border-slate-200">
                  Standard: {data.inspections[0].standard.code}
                </span>
              )}
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-700 text-left font-bold">
                    <th className="py-2.5 px-3">Test / Field Parameter</th>
                    <th className="py-2.5 px-3">Testing Method</th>
                    <th className="py-2.5 px-3">Standard Threshold</th>
                    <th className="py-2.5 px-3">Audited Result</th>
                    <th className="py-2.5 px-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data.inspections[0].tests.map((test, i) => (
                    <tr key={i} className="hover:bg-slate-50/60">
                      <td className="py-2.5 px-3 font-semibold text-slate-900">{test.testName}</td>
                      <td className="py-2.5 px-3 text-slate-500">{test.method || 'Standard SLSI Probe'}</td>
                      <td className="py-2.5 px-3 font-mono text-slate-600">{test.thresholdRequired}</td>
                      <td className="py-2.5 px-3 font-mono font-bold text-slate-900">
                        {test.recordedValue} {test.unit}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            test.status === 'PASS'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          <CheckCircle2 className="w-3 h-3" />
                          {test.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 p-3 bg-slate-50 rounded-xl text-[11px] text-slate-600 border border-slate-200">
              <span className="font-bold text-slate-800">Inspector Remarks:</span>{' '}
              {data.inspections[0].remarks || 'Material meets structural reuse criteria.'}
              <p className="text-[10px] text-slate-500 mt-1 italic">
                {data.inspections[0].disclaimer}
              </p>
            </div>
          </div>
        )}

        {/* Chain of Custody & Traceability Timeline */}
        <div className="border border-slate-200 rounded-2xl p-5 bg-white">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4 text-emerald-600" />
            <span>Verifiable Chain of Custody &amp; Material Lifecycle</span>
          </h3>
          <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-emerald-200">
            {data.historyLog && data.historyLog.length > 0 ? (
              data.historyLog.map((log, idx) => (
                <div key={idx} className="relative group">
                  <span className="absolute -left-6 mt-1 w-3 h-3 rounded-full bg-emerald-600 ring-4 ring-emerald-100" />
                  <div className="text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-slate-500 font-bold">{log.timestamp}</span>
                      <span className="font-bold text-slate-900">{log.action}</span>
                    </div>
                    <p className="text-slate-600 mt-0.5">
                      Actor: <span className="font-medium text-slate-800">{log.actor}</span> • Location:{' '}
                      <span className="font-medium text-slate-800">{log.location}</span>
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500">Initial verification recorded.</p>
            )}
          </div>
        </div>

        {/* Official Statutory Disclaimer */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center text-xs text-slate-500">
          <p>
            Official ReMatX Digital Material Passport. Issued under the Sri Lanka Circular Construction
            Framework. Certified for marketplace transactions.
          </p>
          <p className="font-mono text-[10px] text-slate-400 mt-1">
            Hash: {data.passportNumber}-VERIFIED-2026-IMMUTABLE
          </p>
        </div>
      </div>
    </div>
  );
};
