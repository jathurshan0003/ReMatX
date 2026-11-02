'use client';

import React, { useState } from 'react';
import {
  FileCheck,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Layers,
  Award,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
  Camera,
  Image as ImageIcon,
  ZoomIn,
} from 'lucide-react';
import Link from 'next/link';
import { CATEGORY_TEST_CRITERIA } from '@/lib/constants';
import { GradeBadge } from '@/components/GradeBadge';
import { useAuth } from '@/context/AuthContext';

interface InspectorClientProps {
  pendingMaterials: any[];
  verifiedPassports: any[];
  standards: any[];
}

export const InspectorDashboardClient: React.FC<InspectorClientProps> = ({
  pendingMaterials,
  verifiedPassports,
  standards,
}) => {
  const { user } = useAuth();
  const [materialsList, setMaterialsList] = useState<any[]>(pendingMaterials);
  const [selectedMaterial, setSelectedMaterial] = useState<any>(pendingMaterials[0] || null);
  const [selectedStandardId, setSelectedStandardId] = useState<string>(standards[0]?.id || '');
  const [activePhotoIdx, setActivePhotoIdx] = useState<number>(0);
  const [visualScore, setVisualScore] = useState<number>(90);
  const [assignedGrade, setAssignedGrade] = useState<string>('GRADE_A');
  const [remarks, setRemarks] = useState<string>(
    'Material photos and technical parameters reviewed. Clean edges and mortar removal verified in compliance with SLSI standard.'
  );
  const [rejectionReason, setRejectionReason] = useState<string>('');
  const [testValues, setTestValues] = useState<Record<string, { val: string; status: string }>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [outcomeState, setOutcomeState] = useState<'verified' | 'rejected' | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>('');

  // Parse images of currently selected material
  let currentImages: string[] = [];
  try {
    currentImages = JSON.parse(selectedMaterial?.images || '[]');
  } catch (e) {
    currentImages = [];
  }
  if (currentImages.length === 0 && selectedMaterial?.images) {
    currentImages = [selectedMaterial.images];
  }

  // Initialize tests based on selected material category
  const criteria = selectedMaterial
    ? CATEGORY_TEST_CRITERIA[selectedMaterial.category?.slug] || CATEGORY_TEST_CRITERIA.bricks
    : [];

  const handleTestChange = (testName: string, field: 'val' | 'status', value: string) => {
    setTestValues((prev) => ({
      ...prev,
      [testName]: {
        val: field === 'val' ? value : prev[testName]?.val || '',
        status: field === 'status' ? value : prev[testName]?.status || 'PASS',
      },
    }));
  };

  const handleAuditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMaterial) return;

    const isRejection = assignedGrade === 'REJECTED';

    // JS validation (form is noValidate so browser won't block)
    if (isRejection && !rejectionReason.trim()) {
      setErrorMsg('Please provide a rejection reason before rejecting this material.');
      return;
    }
    if (!isRejection && (visualScore < 0 || visualScore > 100)) {
      setErrorMsg('Visual score must be between 0 and 100.');
      return;
    }
    setErrorMsg('');
    setIsSubmitting(true);

    const formattedTests = criteria.map((c) => ({
      testName: c.name,
      method: 'Standard SLSI Visual & Laboratory Probe',
      unit: c.unit,
      recordedValue: testValues[c.name]?.val || '16.5',
      thresholdRequired: c.typicalThreshold,
      status: testValues[c.name]?.status || 'PASS',
    }));

    const finalRemarks = isRejection
      ? `REJECTED — ${rejectionReason.trim()}`
      : remarks;

    try {
      const res = await fetch('/api/inspections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          materialId: selectedMaterial.id,
          standardId: selectedStandardId,
          visualScore,
          assignedGrade,
          result: isRejection ? 'FAILED' : 'PASSED',
          remarks: finalRemarks,
          tests: formattedTests,
        }),
      });

      if (res.ok) {
        setOutcomeState(isRejection ? 'rejected' : 'verified');
        setMaterialsList((prev) =>
          prev.map((m) =>
            m.id === selectedMaterial.id
              ? { ...m, status: isRejection ? 'REJECTED' : 'AVAILABLE', conditionGrade: assignedGrade }
              : m
          )
        );
      } else {
        const data = await res.json();
        setErrorMsg(data.error || 'Failed to record audit results.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Network error — could not contact the server. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Inspector Top Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-10 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono text-[11px] font-bold">
              Accredited Quality Auditor Desk
            </span>
            <span className="text-slate-400 text-xs">•</span>
            <span className="text-slate-400 text-xs">SLSI / ISO Verification Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            {user?.name || 'Materials Auditor Desk'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
            Review uploaded material photos, conduct laboratory &amp; non-destructive tests against official standards,
            award condition grades (Grade A–D, R), and verify material batches for marketplace procurement.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/standards"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition-colors"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Standards Registry &rarr;</span>
          </Link>
        </div>
      </div>

      {/* Main Split: Left = Audit Queue, Right = Dynamic Inspection Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Queue of Materials (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center justify-between">
            <span>Audit Queue ({materialsList.length} Lots)</span>
            <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">
              Awaiting Verification
            </span>
          </h2>

          <div className="space-y-3">
            {materialsList.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-500 text-xs">
                No materials currently awaiting audit.
              </div>
            ) : (
              materialsList.map((mat) => {
                const isSelected = selectedMaterial?.id === mat.id;
                let matImgs: string[] = [];
                try {
                  matImgs = JSON.parse(mat.images || '[]');
                } catch (e) {
                  matImgs = [];
                }
                const firstImg = matImgs[0];
                        const isVerified = mat.status === 'AVAILABLE';
                        const isRejected = mat.status === 'REJECTED';

                        return (
                          <div
                            key={mat.id}
                            onClick={() => {
                              setSelectedMaterial(mat);
                              setActivePhotoIdx(0);
                              setOutcomeState(null);
                              setRejectionReason('');
                              setAssignedGrade('GRADE_A');
                              setErrorMsg('');
                            }}
                            className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                              isSelected
                                ? 'bg-emerald-50/90 border-emerald-500 shadow-md ring-2 ring-emerald-500/20'
                                : 'bg-white border-slate-200 hover:border-slate-300'
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              {firstImg ? (
                                <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                                  <img src={firstImg} alt="Lot thumbnail" className="w-full h-full object-cover" />
                                </div>
                              ) : (
                                <div className="w-14 h-14 rounded-xl bg-slate-100 shrink-0 border border-slate-200 flex items-center justify-center text-slate-400">
                                  <ImageIcon className="w-5 h-5" />
                                </div>
                              )}

                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between text-xs">
                                  <span className="font-mono font-bold text-slate-500 text-[11px]">{mat.materialId}</span>
                                  <span
                                    className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                                      isVerified
                                        ? 'bg-emerald-100 text-emerald-800'
                                        : isRejected
                                        ? 'bg-red-100 text-red-800'
                                        : 'bg-amber-100 text-amber-800'
                                    }`}
                                  >
                                    {isVerified ? 'Verified' : isRejected ? 'Rejected' : 'Needs Audit'}
                                  </span>
                                </div>

                        <h3 className="font-bold text-slate-900 text-xs mt-1 truncate">{mat.name}</h3>
                        <p className="text-[11px] text-slate-500">{mat.category?.name || 'General Masonry'}</p>

                        <div className="mt-2 pt-1 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-600">
                          <span>{mat.quantity} {mat.unit}</span>
                          <span className="font-semibold text-slate-800">{mat.locationCity}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Dynamic Category Audit Form & Photo Inspector (8 cols) */}
        <div className="lg:col-span-8">
          {outcomeState === 'verified' ? (
            <div className="bg-white rounded-3xl border border-emerald-300 p-8 shadow-xl text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full uppercase tracking-wider">
                  Verification Recorded
                </span>
                <h3 className="text-2xl font-black text-slate-900 mt-2">Batch Verified Successfully</h3>
                <p className="text-xs text-slate-600 mt-1 max-w-md mx-auto">
                  The material batch passed inspection and is now listed as <strong>Available</strong> for buyer procurement.
                </p>
              </div>
              <div className="flex justify-center pt-4">
                <button
                  onClick={() => setOutcomeState(null)}
                  className="px-4 py-3 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50"
                >
                  Audit Another Lot
                </button>
              </div>
            </div>
          ) : outcomeState === 'rejected' ? (
            <div className="bg-white rounded-3xl border border-red-300 p-8 shadow-xl text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-red-100 text-red-700 mx-auto flex items-center justify-center">
                <XCircle className="w-8 h-8" />
              </div>
              <div>
                <span className="text-xs font-mono font-bold text-red-700 bg-red-100 px-3 py-1 rounded-full uppercase tracking-wider">
                  Rejection Recorded
                </span>
                <h3 className="text-2xl font-black text-slate-900 mt-2">Material Batch Rejected</h3>
                <p className="text-xs text-slate-600 mt-1 max-w-md mx-auto">
                  This material has been marked as <strong>Rejected</strong> and will not appear in the marketplace.
                  The seller will need to address the identified issues and re-submit for inspection.
                </p>
              </div>
              <div className="flex justify-center pt-4">
                <button
                  onClick={() => setOutcomeState(null)}
                  className="px-4 py-3 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50"
                >
                  Review Another Lot
                </button>
              </div>
            </div>
          ) : selectedMaterial ? (
            <form
              onSubmit={handleAuditSubmit}
              noValidate
              className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6 text-xs"
            >
              {/* Material Audit Header */}
              <div className="border-b border-slate-100 pb-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold font-mono uppercase tracking-wider text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                    {selectedMaterial.materialId}
                  </span>
                  <span className="text-xs text-slate-500 font-semibold">
                    Category: {selectedMaterial.category?.name}
                  </span>
                </div>
                <h2 className="text-xl font-black text-slate-900 mt-2">{selectedMaterial.name}</h2>
                <p className="text-slate-600 mt-0.5">
                  Origin: <span className="font-semibold">{selectedMaterial.originBuilding || 'Deconstruction Site'}</span> • Depot:{' '}
                  <span className="font-semibold">{selectedMaterial.locationAddress}</span>
                </p>
              </div>

              {/* PHOTO INSPECTION SHOWCASE (CRITICAL VERIFICATION REQUIREMENT) */}
              <div className="space-y-3 bg-slate-50 p-5 rounded-2xl border border-slate-200">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 uppercase tracking-wider text-xs flex items-center gap-2">
                    <Camera className="w-4 h-4 text-emerald-600" />
                    <span>Uploaded Material Photos ({currentImages.length} Evidence Photos)</span>
                  </h3>
                  <span className="text-[10px] text-slate-500">
                    Inspect surface finish, mortar removal, and edge integrity
                  </span>
                </div>

                {currentImages.length > 0 ? (
                  <div className="space-y-3">
                    {/* Main Image Inspector View */}
                    <div className="relative h-72 w-full rounded-xl overflow-hidden bg-slate-900 border border-slate-200 shadow-inner flex items-center justify-center group">
                      <img
                        src={currentImages[activePhotoIdx] || currentImages[0]}
                        alt="Audited material evidence"
                        className="max-h-full max-w-full object-contain"
                      />
                      <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur px-2.5 py-1 rounded-lg text-white font-mono text-[10px] flex items-center gap-1.5">
                        <ZoomIn className="w-3 h-3 text-emerald-400" />
                        <span>Photo {activePhotoIdx + 1} of {currentImages.length}</span>
                      </div>
                    </div>

                    {/* Thumbnail Selector */}
                    {currentImages.length > 1 && (
                      <div className="flex gap-2 overflow-x-auto pb-1">
                        {currentImages.map((img, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setActivePhotoIdx(idx)}
                            className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 shrink-0 transition-all ${
                              activePhotoIdx === idx
                                ? 'border-emerald-500 ring-2 ring-emerald-500/30'
                                : 'border-slate-200 opacity-70 hover:opacity-100'
                            }`}
                          >
                            <img src={img} alt={`Thumb ${idx + 1}`} className="w-full h-full object-cover" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-6 text-center text-slate-400 text-xs italic">
                    No photos were uploaded for this lot.
                  </div>
                )}
              </div>

              {/* Standard Assignment & Visual Score */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Applicable Technical Standard:</label>
                  <select
                    value={selectedStandardId}
                    onChange={(e) => setSelectedStandardId(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white font-semibold text-slate-900"
                  >
                    {standards.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.code} — {s.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Visual Integrity Score (0–100 based on photos):
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={visualScore}
                    onChange={(e) => setVisualScore(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl font-bold"
                    required
                  />
                </div>
              </div>

              {/* Dynamic Category Inspection Criteria Table */}
              <div className="space-y-3">
                <h3 className="font-bold text-slate-900 uppercase tracking-wider text-xs flex items-center gap-2">
                  <Award className="w-4 h-4 text-emerald-600" />
                  <span>Standard Benchmark Tests ({criteria.length} Parameters)</span>
                </h3>

                <div className="overflow-x-auto border border-slate-200 rounded-2xl">
                  <table className="min-w-full divide-y divide-slate-200 text-xs">
                    <thead>
                      <tr className="bg-slate-50 text-slate-700 text-left font-bold">
                        <th className="py-2.5 px-3">Test Field Parameter</th>
                        <th className="py-2.5 px-3">Required Threshold</th>
                        <th className="py-2.5 px-3">Audited Measurement</th>
                        <th className="py-2.5 px-3 text-center">Outcome</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {criteria.map((c, i) => (
                        <tr key={i} className="hover:bg-slate-50/50">
                          <td className="py-2.5 px-3 font-semibold text-slate-900">{c.name}</td>
                          <td className="py-2.5 px-3 font-mono text-slate-500">
                            {c.typicalThreshold} ({c.unit})
                          </td>
                          <td className="py-2.5 px-3">
                            <input
                              type="text"
                              placeholder={`Recorded value (${c.unit})`}
                              defaultValue={
                                i === 0 ? '17.8' : i === 1 ? '9.2' : i === 2 ? '1.5' : '1.0'
                              }
                              onChange={(e) => handleTestChange(c.name, 'val', e.target.value)}
                              className="w-32 px-2.5 py-1 border border-slate-300 rounded-lg text-xs font-mono font-bold"
                            />
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            <select
                              defaultValue="PASS"
                              onChange={(e) => handleTestChange(c.name, 'status', e.target.value)}
                              className="px-2 py-1 border border-slate-300 rounded-lg text-xs font-bold bg-white text-emerald-700"
                            >
                              <option value="PASS">PASS</option>
                              <option value="CONDITIONAL">CONDITIONAL</option>
                              <option value="FAIL">FAIL</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Awarded Condition Grade Outcome */}
              <div className="space-y-2">
                <label className="block font-bold text-slate-900 text-xs">
                  Assigned Certified Condition Grade:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {[
                    { grade: 'GRADE_A', label: 'Grade A', sub: 'Direct Structural' },
                    { grade: 'GRADE_B', label: 'Grade B', sub: 'Minor Prep' },
                    { grade: 'GRADE_C', label: 'Grade C', sub: 'Non-Structural' },
                    { grade: 'GRADE_D', label: 'Grade D', sub: 'Reprocessing' },
                    { grade: 'REJECTED', label: 'Grade R', sub: 'Rejected' },
                  ].map((g) => (
                    <button
                      key={g.grade}
                      type="button"
                      onClick={() => setAssignedGrade(g.grade)}
                      className={`p-2.5 rounded-xl border text-center transition-all ${
                        assignedGrade === g.grade
                          ? g.grade === 'REJECTED'
                            ? 'border-red-500 bg-red-50 text-red-950 ring-2 ring-red-500/20 font-bold'
                            : 'border-emerald-500 bg-emerald-50 text-emerald-950 ring-2 ring-emerald-500/20 font-bold'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <span className="block font-bold text-xs">{g.label}</span>
                      <span className="block text-[10px] text-slate-500">{g.sub}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Rejection Reason — only shown when Grade R is selected */}
              {assignedGrade === 'REJECTED' ? (
                <div className="space-y-1.5">
                  <label className="block font-bold text-red-700 mb-1 flex items-center gap-1.5">
                    <XCircle className="w-4 h-4" />
                    Rejection Reason (required):
                  </label>
                  <textarea
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    rows={3}
                    placeholder="Describe clearly why this material batch is being rejected — e.g. insufficient photographic evidence, test values below SLSI threshold, structural damage observed..."
                    className="w-full px-3 py-2 border-2 border-red-300 rounded-xl text-slate-900 bg-red-50 placeholder-red-300 focus:outline-none focus:border-red-500"
                  />
                  <p className="text-[10px] text-red-600">This reason will be recorded in the inspection log and visible to the seller.</p>
                </div>
              ) : (
                /* Remarks — shown for all non-rejection grades */
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Auditor Technical Remarks:</label>
                  <textarea
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-slate-900"
                  />
                </div>
              )}

              {/* Statutory Disclaimer Notice */}
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-900 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  By submitting this audit, you certify that the recorded test values and photographic evidence comply with the SLSI standard
                  procedure. This record is permanent and will be visible to all parties.
                </span>
              </div>

              {/* Inline error message */}
              {errorMsg && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-300 rounded-xl text-xs text-red-700 font-semibold">
                  <XCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Submit CTA — two distinct buttons based on grade */}
              <div className="flex items-center justify-end gap-3 pt-2">
                {assignedGrade === 'REJECTED' ? (
                  <button
                    type="submit"
                    disabled={isSubmitting || !rejectionReason.trim()}
                    className="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-xs shadow-md transition-colors flex items-center gap-2"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>{isSubmitting ? 'Recording Rejection...' : 'Reject Material Batch'}</span>
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs shadow-md transition-colors flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{isSubmitting ? 'Recording Verification...' : 'Verify Material Batch'}</span>
                  </button>
                )}
              </div>
            </form>
          ) : (
            <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 text-slate-500 text-xs">
              Select a material from the audit queue to begin technical inspection.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
