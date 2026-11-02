import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { MaterialCard } from '@/components/MaterialCard';
import {
  Recycle,
  ShieldCheck,
  Layers,
  ArrowRight,
  TrendingDown,
  Building,
  CheckCircle2,
  Sparkles,
  FileCheck,
  Scale,
  Award,
  Truck,
} from 'lucide-react';

export const revalidate = 0; // Fresh data for demo

export default async function HomePage() {
  const materials = await prisma.material.findMany({
    where: { status: 'AVAILABLE' },
    include: {
      category: true,
      passport: true,
      listings: { where: { status: 'ACTIVE' } },
    },
    take: 6,
    orderBy: { createdAt: 'desc' },
  });

  const categories = await prisma.materialCategory.findMany({
    include: {
      _count: {
        select: { materials: true },
      },
    },
  });

  // Calculate platform aggregate circularity impact
  const allPassports = await prisma.materialPassport.findMany();
  const totalCarbonKg = allPassports.reduce((acc, p) => acc + p.embodiedCarbonSavedKg, 0);
  const totalWasteKg = allPassports.reduce((acc, p) => acc + p.wasteDivertedKg, 0);

  return (
    <div className="space-y-16 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-900 text-white pt-16 pb-24 border-b border-slate-800">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px]" />
        <div className="absolute top-1/4 right-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 gap-12 items-center">
            <div className="space-y-6 max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 text-xs font-bold tracking-wide">
                <Recycle className="w-4 h-4 animate-spin" />
                <span>Circular Construction &amp; Material Traceability</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.1]">
                Buy &amp; Sell Verified{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
                  Reusable Construction
                </span>{' '}
                Materials
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
                ReMatX bridges building deconstruction and new architecture. Every recovered material is audited,
                tested against SLSI/ISO standards, and given a transparent marketplace condition grade. Existing
                <strong> Digital Material Passports</strong> remain available when a lot has one.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
                <Link
                  href="/marketplace"
                  className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-sm transition-all shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40"
                >
                  <span>Explore Marketplace</span>
                  <ArrowRight className="w-4 h-4 text-slate-950" />
                </Link>

                <Link
                  href="/dashboard/seller/new"
                  className="flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm border border-slate-700 transition-colors"
                >
                  <span>List Materials &rarr;</span>
                </Link>
              </div>

              {/* Technical Credibility Chips */}
              <div className="pt-6 border-t border-slate-800/80 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>SLSI / ISO Standardised Testing</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-emerald-400" />
                  <span>Grades A–D &amp; R Framework</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Verified Traceability</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Live Metrics Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-8">
          <div className="text-center md:border-r border-slate-100">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Landfill Diverted
            </span>
            <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              {(totalWasteKg / 1000).toFixed(1)} <span className="text-sm font-semibold text-slate-500">Tonnes</span>
            </p>
            <span className="text-[11px] text-emerald-600 font-semibold flex items-center justify-center gap-1 mt-0.5">
              <Sparkles className="w-3 h-3" /> Solid building mass
            </span>
          </div>

          <div className="text-center md:border-r border-slate-100">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Embodied CO₂ Saved
            </span>
            <p className="text-2xl sm:text-3xl font-black text-emerald-600 mt-1">
              {totalCarbonKg.toLocaleString()}{' '}
              <span className="text-sm font-semibold text-slate-500">kg CO₂e</span>
            </p>
            <span className="text-[11px] text-slate-500 mt-0.5 block">ICE carbon coefficients</span>
          </div>

          <div className="text-center md:border-r border-slate-100">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Verified Stockpiles
            </span>
            <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              {allPassports.length} <span className="text-sm font-semibold text-slate-500">Passports</span>
            </p>
            <span className="text-[11px] text-slate-500 mt-0.5 block">100% Audited &amp; QR tagged</span>
          </div>

          <div className="text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Active Standards
            </span>
            <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              5 <span className="text-sm font-semibold text-slate-500">Protocols</span>
            </p>
            <span className="text-[11px] text-slate-500 mt-0.5 block">SLSI &amp; ISO Frameworks</span>
          </div>
        </div>
      </section>

      {/* Section 1 & 15: End-to-End Circular Lifecycle Diagram */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            The Circular Pipeline
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-3">
            How Recovered Materials Flow to New Buildings
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            Structured workflow ensuring technical integrity, standards compliance, and custody transfer.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-sm mb-4">
              01
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Building Deconstruction &amp; Audit</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Materials are selectively unbolted, extracted, and categorized on-site prior to demolition rather than
              being sent to landfill.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-sm mb-4">
              02
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Inspection &amp; Standards Testing</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Certified material auditors perform ultrasonic, compressive, and moisture tests against category-specific
              standards.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative">
            <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold text-sm mb-4">
              03
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Digital Material Passport &amp; QR</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Verified batches receive their inspection record and Grade A–D rating. Passport and QR records remain
              available separately when provided.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-sm mb-4">
              04
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Escrow Trade &amp; Future Reuse</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Contractors and architects procure materials with escrow payment protection and logistics tracking for
              the new building.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Verified Materials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">
              Audited Stockpiles
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              Featured Verified Materials Ready for Dispatch
            </h2>
          </div>
          <Link
            href="/marketplace"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 transition-colors"
          >
            <span>View All Stockpiles ({materials.length})</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {materials.map((m) => (
            <MaterialCard
              key={m.id}
              material={{
                id: m.id,
                materialId: m.materialId,
                name: m.name,
                category: { name: m.category.name, slug: m.category.slug },
                dimensions: m.dimensions,
                quantity: m.quantity,
                unit: m.unit,
                conditionGrade: m.conditionGrade,
                locationCity: m.locationCity,
                status: m.status,
                images: m.images,
                passport: m.passport
                  ? {
                      passportNumber: m.passport.passportNumber,
                      verificationStatus: m.passport.verificationStatus,
                      verifiedByInspector: m.passport.verifiedByInspector,
                    }
                  : null,
                listing: m.listings[0]
                  ? {
                      pricePerUnit: m.listings[0].pricePerUnit,
                      listingType: m.listings[0].listingType,
                    }
                  : null,
              }}
            />
          ))}
        </div>
      </section>

      {/* Section 5: Material Grading Framework Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-slate-900 text-white rounded-3xl p-8 sm:p-12">
        <div className="max-w-3xl mb-8">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 font-mono">
            Platform Grading Standard (Section 5)
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white mt-2">
            Transparent Material Grading Framework
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
            Every material is visually inspected and tested to determine its reuse potential. This transparent
            grading standard separates direct structural items from reprocessing stock.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-slate-800/80 p-5 rounded-2xl border border-emerald-500/30">
            <span className="inline-block px-2.5 py-1 rounded-full bg-emerald-400 text-slate-950 font-black text-xs mb-3">
              Grade A
            </span>
            <h3 className="font-bold text-white text-sm">Direct Reuse</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Suitable for direct structural or architectural reuse subject to applicable technical requirements.
            </p>
          </div>

          <div className="bg-slate-800/80 p-5 rounded-2xl border border-blue-500/30">
            <span className="inline-block px-2.5 py-1 rounded-full bg-blue-400 text-slate-950 font-black text-xs mb-3">
              Grade B
            </span>
            <h3 className="font-bold text-white text-sm">Minor Preparation</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Reusable with minor repair, cleaning, denailing, or preparatory surface trimming.
            </p>
          </div>

          <div className="bg-slate-800/80 p-5 rounded-2xl border border-amber-500/30">
            <span className="inline-block px-2.5 py-1 rounded-full bg-amber-400 text-slate-950 font-black text-xs mb-3">
              Grade C
            </span>
            <h3 className="font-bold text-white text-sm">Non-Structural</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Suitable for secondary applications, landscape masonry, or non-critical partitioning.
            </p>
          </div>

          <div className="bg-slate-800/80 p-5 rounded-2xl border border-orange-500/30">
            <span className="inline-block px-2.5 py-1 rounded-full bg-orange-400 text-slate-950 font-black text-xs mb-3">
              Grade D
            </span>
            <h3 className="font-bold text-white text-sm">Reprocessing</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Better suited for recycling, aggregate crushing, or material reprocessing than direct reuse.
            </p>
          </div>

          <div className="bg-slate-800/80 p-5 rounded-2xl border border-red-500/30">
            <span className="inline-block px-2.5 py-1 rounded-full bg-red-400 text-slate-950 font-black text-xs mb-3">
              Grade R
            </span>
            <h3 className="font-bold text-white text-sm">Rejected</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Rejected for marketplace reuse based on safety or inspection degradation failure criteria.
            </p>
          </div>
        </div>
      </section>

      {/* Category Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">
            Material Taxonomy
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
            Explore Material Streams by Category
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/marketplace?category=${cat.slug}`}
              className="group bg-white p-5 rounded-2xl border border-slate-200 hover:border-emerald-300 hover:shadow-lg transition-all text-left"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold mb-3 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm group-hover:text-emerald-700 transition-colors">
                {cat.name}
              </h3>
              <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{cat.description}</p>
              <div className="mt-3 text-[10px] font-bold text-emerald-600 flex items-center justify-between">
                <span>{cat._count.materials} listings</span>
                <span>&rarr;</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
