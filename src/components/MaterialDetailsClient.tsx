'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { GradeBadge } from '@/components/GradeBadge';
import { VerificationBadge } from '@/components/VerificationBadge';
import { OfferModal } from '@/components/OfferModal';
import {
  ShieldCheck,
  MapPin,
  Layers,
  Calendar,
  Building2,
  FileText,
  Sparkles,
  ShoppingBag,
  Send,
  MessageSquare,
  Truck,
  CheckCircle2,
  Scale,
  ExternalLink,
  Clock,
} from 'lucide-react';
import { calculateCircularImpact } from '@/lib/carbon';
import { useAuth } from '@/context/AuthContext';

interface MaterialDetailsClientProps {
  material: any;
}

export const MaterialDetailsClient: React.FC<MaterialDetailsClientProps> = ({ material }) => {
  const { user, role, isAuthenticated } = useAuth();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'BUY_NOW' | 'MAKE_OFFER' | 'REQUEST_QUOTE'>('BUY_NOW');

  const isOwner = user?.id === material.sellerId || (user?.email && user.email === material.seller?.email);
  const isInspector = role === 'INSPECTOR' || role === 'ENGINEER';
  const canBuy = (!isOwner && !isInspector && isAuthenticated) || role === 'ADMIN';

  let images: string[] = [];
  try {
    images = JSON.parse(material.images || '[]');
  } catch (e) {
    images = [];
  }
  if (images.length === 0) {
    images = ['https://images.unsplash.com/photo-1590069261209-f8e9b8642343?w=800&auto=format&fit=crop&q=80'];
  }

  let documents: Array<{ title: string; type: string; url: string }> = [];
  try {
    documents = JSON.parse(material.documents || '[]');
  } catch (e) {
    documents = [];
  }

  const listing = material.listings[0];
  const passport = material.passport;
  const inspection = material.inspections[0];

  const initialStock = listing ? listing.availableQuantity : material.quantity;
  const [currentQuantity, setCurrentQuantity] = useState<number>(initialStock);
  const [materialStatus, setMaterialStatus] = useState<string>(material.status);

  const impact = calculateCircularImpact(material.category.slug, currentQuantity, material.conditionGrade);

  const openModal = (mode: 'BUY_NOW' | 'MAKE_OFFER' | 'REQUEST_QUOTE') => {
    setModalMode(mode);
    setModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-slate-500">
        <Link href="/" className="hover:text-slate-900">Home</Link>
        <span>/</span>
        <Link href="/marketplace" className="hover:text-slate-900">Marketplace</Link>
        <span>/</span>
        <Link href={`/marketplace?category=${material.category.slug}`} className="hover:text-slate-900">
          {material.category.name}
        </Link>
        <span>/</span>
        <span className="font-bold text-slate-900 font-mono">{material.materialId}</span>
      </nav>

      {/* Main Grid: Media & Key Buying Box */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left: Gallery & Provenance Details (7 cols) */}
        <div className="lg:col-span-7 space-y-8">
          {/* Image Showcase */}
          <div className="space-y-3">
            <div className="relative h-96 w-full rounded-3xl overflow-hidden border border-slate-200 bg-slate-100 shadow-md">
              <img
                src={images[activeImageIndex]}
                alt={material.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                <GradeBadge grade={material.conditionGrade} size="md" />
                <VerificationBadge
                  status={passport ? passport.verificationStatus : material.status === 'AVAILABLE' ? 'VERIFIED_BATCH' : material.status}
                  inspectorName={passport?.verifiedByInspector}
                  size="md"
                />
              </div>

              {passport && (
                <div className="absolute top-4 right-4">
                  <Link
                    href={`/passports/${passport.passportNumber}`}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/85 hover:bg-emerald-600 text-white text-xs font-bold backdrop-blur border border-white/20 shadow-lg transition-colors"
                  >
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>View Material Passport</span>
                  </Link>
                </div>
              )}

              <div className="absolute bottom-4 left-4 bg-slate-900/80 backdrop-blur px-3 py-1 rounded-lg text-white font-mono text-xs font-bold">
                ID: {material.materialId}
              </div>
            </div>

            {/* Thumbnail Row */}
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                      activeImageIndex === idx ? 'border-emerald-500 ring-2 ring-emerald-500/20' : 'border-slate-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="thumb" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Description & Technical Summary */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Material Description &amp; Provenance</h2>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed whitespace-pre-line">
                {material.description}
              </p>
            </div>

            {/* Specification Grid */}
            <div className="pt-4 border-t border-slate-100">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
                Dimensional &amp; Origin Attributes
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-500 block">Nominal Dimensions:</span>
                  <span className="font-bold text-slate-900 mt-0.5 block">{material.dimensions}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-500 block">Available Quantity:</span>
                  <span className="font-bold text-slate-900 mt-0.5 block">
                    {currentQuantity.toLocaleString()} {material.unit}
                  </span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-500 block">Unit Weight / Mass:</span>
                  <span className="font-bold text-slate-900 mt-0.5 block">
                    {material.weightKg ? `${material.weightKg} kg` : 'As specified'}
                  </span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-500 block">Deconstruction Source:</span>
                  <span className="font-bold text-slate-900 mt-0.5 block truncate">
                    {material.originBuilding || 'Commercial Structure'}
                  </span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-500 block">Original Installation:</span>
                  <span className="font-bold text-slate-900 mt-0.5 block">
                    {material.ageYears ? `Circa ${new Date().getFullYear() - material.ageYears} (~${material.ageYears} yrs)` : 'Historic'}
                  </span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-500 block">Storage Environment:</span>
                  <span className="font-bold text-slate-900 mt-0.5 block truncate">
                    {material.storageCondition || 'Covered Logistics Depot'}
                  </span>
                </div>
              </div>
            </div>

            {/* Inspection Test Results Preview */}
            {inspection && inspection.tests && inspection.tests.length > 0 && (
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Inspector Test Evidence ({inspection.tests.length} Criteria Logged)
                  </h3>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    Score: {inspection.visualScore}/100
                  </span>
                </div>

                <div className="divide-y divide-slate-100 text-xs">
                  {inspection.tests.map((t: any, i: number) => (
                    <div key={i} className="py-2.5 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-slate-900">{t.testName}</span>
                        <span className="text-slate-500 text-[11px] block">{t.method}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-mono font-bold text-slate-900">
                          {t.recordedValue} {t.unit}
                        </span>
                        <span className="text-[10px] text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full font-bold ml-2">
                          {t.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Commercial Action Box & Pricing (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xl space-y-6 sticky top-24">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">
                {material.category.name}
              </span>
              <h1 className="text-2xl font-black text-slate-900 mt-1">{material.name}</h1>
              <div className="flex items-center gap-2 text-xs text-slate-500 mt-2">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>
                  {material.locationAddress}, {material.locationCity}
                </span>
              </div>
            </div>

            {/* Pricing Details */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              {listing ? (
                <div>
                  <span className="text-xs text-slate-500 font-semibold">Direct Marketplace Price:</span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-3xl font-black text-slate-900">
                      LKR {listing.pricePerUnit.toLocaleString()}
                    </span>
                    <span className="text-xs text-slate-500">per {material.unit}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Minimum order: {listing.minOrderQuantity} {material.unit}
                  </p>
                </div>
              ) : (
                <div className="py-2">
                  <span className="text-sm font-bold text-amber-800">
                    Pricing Available upon Quotation / Offer
                  </span>
                </div>
              )}
            </div>

            {/* Circular Impact Metrics Highlight */}
            <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-emerald-900 font-bold">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>Environmental Benefit (Circular Dividend)</span>
              </div>
              <div className="grid grid-cols-2 gap-3 pt-1 text-slate-700">
                <div>
                  <span className="text-[10px] text-slate-500 block">Carbon Avoidance:</span>
                  <span className="font-bold text-emerald-700 text-sm">
                    {impact.carbonSavedKg.toLocaleString()} kg CO₂e
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Landfill Diversion:</span>
                  <span className="font-bold text-slate-900 text-sm">
                    {impact.wasteDivertedKg.toLocaleString()} kg
                  </span>
                </div>
              </div>
            </div>

            {/* Role-Specific Action Controls */}
            <div className="space-y-3 pt-2">
              {isOwner ? (
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 space-y-2.5">
                  <div className="flex items-center gap-2 text-amber-900 font-bold text-xs">
                    <span className="px-2 py-0.5 rounded bg-amber-200/90 text-[10px] uppercase font-bold">
                      Seller Stockpile Owner
                    </span>
                    <span>You own this listed lot</span>
                  </div>
                  <p className="text-[11px] text-amber-800 leading-relaxed">
                    This material is published from your contractor account. You can monitor offers, view escrow
                    settlements, or request further testing from your inventory desk.
                  </p>
                  <Link
                    href="/dashboard/seller"
                    className="w-full py-2.5 px-3 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <span>Manage Stockpile in Contractor Hub &rarr;</span>
                  </Link>
                </div>
              ) : isInspector ? (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 space-y-2.5">
                  <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Materials Auditor / Inspector Desk</span>
                  </div>
                  <p className="text-[11px] text-emerald-800 leading-relaxed">
                    You are signed in with an inspector license. Perform non-destructive tests, evaluate standard
                    tolerances, and assign Grade A–D to verify material batches.
                  </p>
                  <Link
                    href="/dashboard/inspector"
                    className="w-full py-2.5 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <span>Conduct Technical Audit in Inspector Hub &rarr;</span>
                  </Link>
                  <span className="block text-[10px] text-slate-500 italic text-center">
                    Auditors do not purchase commercial material lots directly.
                  </span>
                </div>
              ) : !isAuthenticated ? (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="text-center space-y-1">
                    <span className="text-xs font-bold text-slate-900 block">Sign In to Procure or Make Offers</span>
                    <p className="text-[11px] text-slate-500">
                      Buyers and Contractors use protected escrow transactions.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    <Link
                      href="/auth/login"
                      className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs text-center transition-colors shadow-sm"
                    >
                      Sign In
                    </Link>
                  </div>
                </div>
              ) : materialStatus === 'UNDER_REVIEW' ? (
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 space-y-2.5">
                  <div className="flex items-center gap-2 text-amber-900 font-bold text-xs">
                    <Clock className="w-4 h-4 text-amber-600" />
                    <span>Pending Quality Inspection &amp; Verification</span>
                  </div>
                  <p className="text-[11px] text-amber-800 leading-relaxed">
                    This material lot and uploaded photos are currently queued for audit by accredited SLSI/ISO inspectors.
                    Purchasing and escrow orders will unlock once certification is completed.
                  </p>
                  <div className="p-2.5 bg-white/90 rounded-xl text-[10px] font-bold text-amber-900 border border-amber-200 flex items-center justify-between">
                    <span>Audit Status: Under Review</span>
                    <span className="font-mono">{material.materialId}</span>
                  </div>
                </div>
              ) : materialStatus === 'SOLD' || currentQuantity <= 0 ? (
                <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200 space-y-2 text-center">
                  <span className="text-xs font-black uppercase tracking-wider text-rose-600 block">Out of Stock</span>
                  <p className="text-[11px] text-slate-500">
                    All units of this material lot have been purchased by registered buyers.
                  </p>
                  <button
                    disabled
                    className="w-full py-3 px-4 rounded-xl bg-slate-200 text-slate-400 font-bold text-xs cursor-not-allowed"
                  >
                    Sold Out
                  </button>
                </div>
              ) : (
                <>
                  <button
                    onClick={() => openModal('BUY_NOW')}
                    className="w-full py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Buy Now (Escrow Secured)</span>
                  </button>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => openModal('MAKE_OFFER')}
                      className="py-2.5 px-3 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-800 font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Make an Offer</span>
                    </button>
                    <button
                      onClick={() => openModal('REQUEST_QUOTE')}
                      className="py-2.5 px-3 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-800 font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
                    >
                      <FileText className="w-3.5 h-3.5 text-blue-600" />
                      <span>Request Quote</span>
                    </button>
                  </div>
                </>
              )}

              {passport && (
                <Link
                  href={`/passports/${passport.passportNumber}`}
                  className="w-full py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Digital Material Passport</span>
                </Link>
              )}
            </div>

            {/* Verified Seller Info */}
            <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
              {material.seller.avatarUrl ? (
                <img
                  src={material.seller.avatarUrl}
                  alt={material.seller.name}
                  className="w-10 h-10 rounded-full object-cover border border-slate-200"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold">
                  {material.seller.name?.charAt(0).toUpperCase() || '?'}
                </div>
              )}
              <div className="text-xs">
                <p className="font-bold text-slate-900">{material.seller.name}</p>
                <p className="text-slate-500">{material.seller.company?.name || 'Verified Salvage Partner'}</p>
              </div>
            </div>

            {/* Section 22 Technical Disclaimer Alert */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-500 leading-relaxed flex items-start gap-2">
              <Scale className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                <strong>Structural Reuse Note:</strong> Marketplace Grade{' '}
                {material.conditionGrade.replace('GRADE_', '')} provides condition guidance. Critical
                load-bearing installations require project structural engineer validation.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Transaction Modal (Buy Now / Offer / Quote) */}
      <OfferModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        material={{
          id: material.id,
          materialId: material.materialId,
          name: material.name,
          unit: material.unit,
          quantity: currentQuantity,
          locationCity: material.locationCity,
          listing: listing
            ? {
                id: listing.id,
                pricePerUnit: listing.pricePerUnit,
                minOrderQuantity: listing.minOrderQuantity,
                availableQuantity: currentQuantity,
              }
            : null,
        }}
        initialMode={modalMode}
        onOrderSuccess={(remaining) => {
          setCurrentQuantity(remaining);
          if (remaining <= 0) {
            setMaterialStatus('SOLD');
          }
        }}
      />
    </div>
  );
};
