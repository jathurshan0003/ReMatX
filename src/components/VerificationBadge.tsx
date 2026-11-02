import React from 'react';
import { Clock, AlertCircle, Star, XCircle } from 'lucide-react';

interface VerificationBadgeProps {
  status: string;
  inspectorName?: string | null;
  verifiedAt?: string | Date | null;
  size?: 'sm' | 'md';
}

export const VerificationBadge: React.FC<VerificationBadgeProps> = ({
  status,
  inspectorName,
  verifiedAt,
  size = 'md',
}) => {
  if (status === 'VERIFIED' || status === 'VERIFIED_BATCH' || status === 'AVAILABLE') {
    return (
      <div
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-300 shadow-sm ${
          size === 'sm' ? 'text-[11px] py-0.5' : ''
        }`}
        title={
          inspectorName
            ? `Verified by ${inspectorName} on ${verifiedAt ? new Date(verifiedAt).toLocaleDateString() : 'audited date'}`
            : 'Technical Audit Completed'
        }
      >
        <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
        <span>{status === 'VERIFIED' ? 'Verified Material' : 'Verified Batch'}</span>
      </div>
    );
  }

  if (status === 'REJECTED') {
    return (
      <div
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-800 border border-red-300 shadow-sm ${
          size === 'sm' ? 'text-[11px] py-0.5' : ''
        }`}
        title="Material batch rejected during inspection"
      >
        <XCircle className="w-3.5 h-3.5 text-red-600" />
        <span>Rejected Material</span>
      </div>
    );
  }

  if (status === 'UNDER_REVIEW') {
    return (
      <div
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-300 shadow-sm ${
          size === 'sm' ? 'text-[11px] py-0.5' : ''
        }`}
      >
        <Clock className="w-3.5 h-3.5 text-amber-600 animate-spin" />
        <span>Audit in Progress</span>
      </div>
    );
  }

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-300 shadow-sm ${
        size === 'sm' ? 'text-[11px] py-0.5' : ''
      }`}
    >
      <AlertCircle className="w-3.5 h-3.5 text-slate-500" />
      <span>Self-Declared</span>
    </div>
  );
};
