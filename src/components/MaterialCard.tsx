import React from 'react';
import Link from 'next/link';
import { GradeBadge } from './GradeBadge';
import { VerificationBadge } from './VerificationBadge';
import { MapPin, ShieldCheck, Sparkles, Layers, ArrowRight } from 'lucide-react';
import { calculateCircularImpact } from '@/lib/carbon';

export interface MaterialCardProps {
  id: string;
  materialId: string;
  name: string;
  category: {
    name: string;
    slug: string;
  };
  dimensions: string;
  quantity: number;
  unit: string;
  conditionGrade: string;
  locationCity: string;
  status: string;
  images: string;
  passport?: {
    passportNumber: string;
    verificationStatus: string;
    verifiedByInspector?: string | null;
  } | null;
  listing?: {
    pricePerUnit: number;
    listingType: string;
  } | null;
}

export const MaterialCard: React.FC<{ material: MaterialCardProps }> = ({ material }) => {
  let parsedImages: string[] = [];
  try {
    parsedImages = JSON.parse(material.images || '[]');
  } catch (e) {
    parsedImages = [];
  }
  const imageUrl =
    parsedImages[0] ||
    'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?w=800&auto=format&fit=crop&q=80';

  const price = material.listing?.pricePerUnit;
  const impact = calculateCircularImpact(material.category.slug, material.quantity, material.conditionGrade);

  return (
    <div className="group bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-emerald-300 transition-all duration-300 flex flex-col overflow-hidden">
      {/* Card Image & Badges */}
      <div className="relative h-52 w-full overflow-hidden bg-slate-100">
        <img
          src={imageUrl}
          alt={material.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          <GradeBadge grade={material.conditionGrade} size="sm" />
          <VerificationBadge
            status={material.passport ? material.passport.verificationStatus : material.status === 'AVAILABLE' ? 'VERIFIED_BATCH' : material.status}
            inspectorName={material.passport?.verifiedByInspector}
            size="sm"
          />
        </div>

        {/* Passport Quick Badge */}
        {material.passport && (
          <div className="absolute top-3 right-3 z-10">
            <Link
              href={`/passports/${material.passport.passportNumber}`}
              className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-900/80 hover:bg-emerald-600 text-white text-[11px] font-bold backdrop-blur border border-white/20 shadow-md transition-colors"
              title="View Verifiable Material Passport"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Passport</span>
            </Link>
          </div>
        )}

        {/* Bottom Image Overlay: Material ID & Category */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs font-medium z-10">
          <span className="font-mono bg-black/40 px-2 py-0.5 rounded backdrop-blur text-[11px] text-emerald-300">
            {material.materialId}
          </span>
          <span className="bg-white/20 backdrop-blur px-2 py-0.5 rounded text-[11px]">
            {material.category.name}
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-1">
            <Link href={`/materials/${material.id}`}>{material.name}</Link>
          </h3>

          {/* Key Specs */}
          <div className="mt-2.5 grid grid-cols-2 gap-2 text-xs text-slate-600">
            <div className="flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{material.dimensions}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{material.locationCity}</span>
            </div>
          </div>

          {/* Quantity & Carbon Pill */}
          <div className="mt-3 flex items-center justify-between gap-2 pt-3 border-t border-slate-100">
            <div className="text-xs">
              <span className="text-slate-500">Available:</span>{' '}
              <span className="font-bold text-slate-800">
                {material.quantity.toLocaleString()} {material.unit}
              </span>
            </div>
            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[11px] font-semibold border border-emerald-200">
              <Sparkles className="w-3 h-3 text-emerald-600" />
              <span>{impact.carbonSavedKg.toLocaleString()} kg CO₂e</span>
            </div>
          </div>
        </div>

        {/* Footer: Price and CTA */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <div>
            {price ? (
              <div>
                <span className="text-xs text-slate-500">Unit Price</span>
                <p className="text-lg font-black text-slate-900 leading-none mt-0.5">
                  LKR {price.toLocaleString()}
                  <span className="text-xs font-normal text-slate-500">/{material.unit.split(' ')[0]}</span>
                </p>
              </div>
            ) : (
              <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-1 rounded">
                Quote on Request
              </span>
            )}
          </div>

          <Link
            href={`/materials/${material.id}`}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-emerald-600 text-white text-xs font-bold transition-all shadow-sm group-hover:translate-x-0.5"
          >
            <span>Inspect</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};
