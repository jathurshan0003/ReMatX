import React from 'react';
import { prisma } from '@/lib/prisma';
import { MaterialCard } from '@/components/MaterialCard';
import { Search, Layers, ShieldCheck } from 'lucide-react';
import { SRI_LANKA_DISTRICTS } from '@/lib/constants';
import Link from 'next/link';

export const revalidate = 0;

interface MarketplaceProps {
  searchParams: {
    q?: string;
    category?: string;
    grade?: string;
    verified?: string;
    district?: string;
  };
}

export default async function MarketplacePage({ searchParams }: MarketplaceProps) {
  const { q, category, grade, verified, district } = searchParams;

  const whereClause: any = {
    status: 'AVAILABLE',
  };

  if (q) {
    whereClause.OR = [
      { name: { contains: q } },
      { description: { contains: q } },
      { materialId: { contains: q } },
      { originBuilding: { contains: q } },
    ];
  }

  if (category) {
    whereClause.category = { slug: category };
  }

  if (grade) {
    whereClause.conditionGrade = grade;
  }

  if (district) {
    whereClause.locationCity = district;
  }

  if (verified === 'true') {
    whereClause.passport = {
      verificationStatus: 'VERIFIED',
    };
  }

  const materials = await prisma.material.findMany({
    where: whereClause,
    include: {
      category: true,
      passport: true,
      listings: { where: { status: 'ACTIVE' } },
    },
    orderBy: { createdAt: 'desc' },
  });

  const categories = await prisma.materialCategory.findMany();
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">
            Circular Sourcing Catalog
          </span>
          <h1 className="text-3xl font-black text-slate-900 mt-1">Reusable Materials Marketplace</h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Browse verified reclaimed structural elements, finishes, and masonry with Digital Passports.
          </p>
        </div>

      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-3">
        <form method="GET" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Keyword Search */}
          <div className="relative lg:col-span-2">
            <input
              type="text"
              name="q"
              defaultValue={q || ''}
              placeholder="Search bricks, I-beams, teak timber, doors..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </div>

          {/* Category Filter */}
          <div>
            <select
              name="category"
              defaultValue={category || ''}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select name="district" defaultValue={district || ''} className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500">
              <option value="">All Districts</option>
              {SRI_LANKA_DISTRICTS.map((district) => <option key={district} value={district}>{district}</option>)}
            </select>
          </div>

          {/* Condition Grade Filter */}
          <div>
            <select
              name="grade"
              defaultValue={grade || ''}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">All Condition Grades</option>
              <option value="GRADE_A">Grade A (Direct Reuse)</option>
              <option value="GRADE_B">Grade B (Minor Prep)</option>
              <option value="GRADE_C">Grade C (Non-Structural)</option>
              <option value="GRADE_D">Grade D (Recycling)</option>
            </select>
          </div>

          {/* Submit */}
          <div>
            <button
              type="submit"
              className="w-full py-2 px-4 rounded-xl bg-slate-900 hover:bg-emerald-600 text-white font-bold text-xs transition-colors shadow-sm"
            >
              Filter Catalog
            </button>
          </div>
        </form>

        {/* Quick Filter Tags */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs text-slate-600">
          <span className="text-slate-400 font-semibold text-[11px]">Quick Filters:</span>
          <Link
            href="/marketplace"
            className={`px-2.5 py-1 rounded-lg border text-[11px] ${
              !category && !grade && !district
                ? 'bg-emerald-50 text-emerald-700 border-emerald-300 font-bold'
                : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
            }`}
          >
            All Stockpiles
          </Link>
          <Link
            href="/marketplace?verified=true"
            className={`px-2.5 py-1 rounded-lg border text-[11px] flex items-center gap-1 ${
              verified === 'true'
                ? 'bg-emerald-50 text-emerald-700 border-emerald-300 font-bold'
                : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <ShieldCheck className="w-3 h-3 text-emerald-600" />
            <span>Audited &amp; Verified Only</span>
          </Link>
          <Link
            href="/marketplace?grade=GRADE_A"
            className={`px-2.5 py-1 rounded-lg border text-[11px] ${
              grade === 'GRADE_A'
                ? 'bg-emerald-50 text-emerald-700 border-emerald-300 font-bold'
                : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
            }`}
          >
            Grade A Direct Reuse
          </Link>
          <Link
            href="/marketplace?category=structural-steel"
            className="px-2.5 py-1 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-[11px]"
          >
            Structural Steel
          </Link>
          <Link
            href="/marketplace?category=timber"
            className="px-2.5 py-1 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-[11px]"
          >
            Teak Timber
          </Link>
        </div>
      </div>

      {/* Marketplace Grid */}
      <div>
        {materials.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-3">
            <Layers className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="font-bold text-slate-800 text-base">No materials match your filters</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">Try resetting your search or selecting another district.</p>
            <Link href="/marketplace" className="inline-block mt-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold">Clear All Filters</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {materials.map((m) => (
              <MaterialCard key={m.id} material={{
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
                }} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
