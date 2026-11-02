import React from 'react';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { SellerDashboardWrapper } from '@/components/SellerDashboardWrapper';
import {
  Layers,
  PlusCircle,
  FileCheck,
  QrCode,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Eye,
  Printer,
} from 'lucide-react';
import { GradeBadge } from '@/components/GradeBadge';
import { VerificationBadge } from '@/components/VerificationBadge';
import { SellerOfferActions } from '@/components/SellerOfferActions';

import { cookies } from 'next/headers';
import { getUserFromToken } from '@/lib/auth';

export const revalidate = 0;

export default async function SellerDashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('rematx_token')?.value;
  const authUser = await getUserFromToken(token);

  const materials = await prisma.material.findMany({
    where: authUser?.role === 'ADMIN' ? {} : (authUser ? { sellerId: authUser.id } : {}),
    include: {
      category: true,
      passport: true,
      listings: true,
      inspections: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  const orders = await prisma.order.findMany({
    where: authUser?.role === 'ADMIN' ? {} : (authUser ? { sellerId: authUser.id } : {}),
    include: {
      listing: {
        include: { material: true },
      },
      buyer: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  const offers = await prisma.offer.findMany({
    include: {
      listing: {
        include: { material: true },
      },
      buyer: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  const totalRevenue = orders.reduce((sum, o) => sum + o.subtotal, 0);

  return (
    <SellerDashboardWrapper>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Seller Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-10 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-mono text-[11px] font-bold">
              Demolition &amp; Salvage Portal
            </span>
            <span className="text-slate-400 text-xs">•</span>
            <span className="text-slate-400 text-xs">
              {authUser?.companyName || 'Registered Contractor / Salvager'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Seller Hub: {authUser?.name || 'Contractor'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
            Manage your salvaged construction inventories, request SLSI testing for newly deconstructed lots, review
            buyer offers, and fulfill orders.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/dashboard/seller/new"
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs transition-colors shadow-sm"
          >
            <PlusCircle className="w-4 h-4" />
            <span>List New Material Lot</span>
          </Link>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs text-slate-500 font-semibold block">Inventory Lots</span>
          <p className="text-2xl font-black text-slate-900 mt-1">{materials.length}</p>
          <span className="text-[10px] text-emerald-600 font-bold">Under active tracking</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs text-slate-500 font-semibold block">Incoming Offers</span>
          <p className="text-2xl font-black text-slate-900 mt-1">{offers.length}</p>
          <span className="text-[10px] text-amber-600 font-bold">Pending contractor action</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs text-slate-500 font-semibold block">Total Sales Volume</span>
          <p className="text-2xl font-black text-slate-900 mt-1">
            LKR {(totalRevenue / 1000).toFixed(0)}k
          </p>
          <span className="text-[10px] text-emerald-600 font-bold">Escrow secured</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs text-slate-500 font-semibold block">SLSI Audited Passports</span>
          <p className="text-2xl font-black text-emerald-600 mt-1">
            {materials.filter((m) => m.passport).length}
          </p>
          <span className="text-[10px] text-slate-500">100% QR traceable</span>
        </div>
      </div>

      {/* Inventory Lots Table */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-emerald-600" />
            <h2 className="text-lg font-bold text-slate-900">Salvaged Inventory Stockpiles</h2>
          </div>
          <Link
            href="/dashboard/seller/new"
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Add Material</span>
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-700 text-left font-bold">
                <th className="py-3 px-4">Lot ID</th>
                <th className="py-3 px-4">Material Name &amp; Stream</th>
                <th className="py-3 px-4">Quantity Available</th>
                <th className="py-3 px-4">Grade</th>
                <th className="py-3 px-4">Audit Status</th>
                <th className="py-3 px-4">Passport &amp; QR</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {materials.map((m) => (
                <tr key={m.id} className="hover:bg-slate-50/60">
                  <td className="py-3 px-4 font-mono font-bold text-slate-700">{m.materialId}</td>
                  <td className="py-3 px-4">
                    <Link
                      href={`/materials/${m.id}`}
                      className="font-bold text-slate-900 hover:text-emerald-700 block"
                    >
                      {m.name}
                    </Link>
                    <span className="text-[11px] text-slate-500">{m.category.name}</span>
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-800">
                    {m.quantity.toLocaleString()} {m.unit}
                  </td>
                  <td className="py-3 px-4">
                    <GradeBadge grade={m.conditionGrade} size="sm" />
                  </td>
                  <td className="py-3 px-4">
                    <VerificationBadge
                      status={m.passport ? m.passport.verificationStatus : m.status}
                      inspectorName={m.passport?.verifiedByInspector}
                      size="sm"
                    />
                  </td>
                  <td className="py-3 px-4">
                    {m.passport ? (
                      <Link
                        href={`/passports/${m.passport.passportNumber}`}
                        className="inline-flex items-center gap-1 font-mono text-[11px] font-bold text-emerald-700 hover:text-emerald-800"
                      >
                        <QrCode className="w-3.5 h-3.5" />
                        <span>{m.passport.passportNumber}</span>
                      </Link>
                    ) : (
                      <span className="text-slate-400 text-[11px]">Pending Audit</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Link
                      href={`/materials/${m.id}`}
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-[11px] font-bold transition-colors"
                    >
                      <Eye className="w-3 h-3" />
                      <span>View</span>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Incoming Buyer Offers & Quotations */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-emerald-600" />
            <h2 className="text-lg font-bold text-slate-900">Incoming Buyer Offers</h2>
          </div>
        </div>

        <div className="divide-y divide-slate-100 text-xs">
          {offers.map((off) => (
            <div key={off.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 text-sm">{off.listing.material.name}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                    Buyer: {off.buyer.name}
                  </span>
                </div>
                <p className="text-slate-600 mt-1">
                  Requested: <span className="font-bold text-slate-800">{off.requestedQuantity} units</span> @{' '}
                  <span className="font-bold text-emerald-700">LKR {off.offeredPricePerUnit}</span> (Total:{' '}
                  <span className="font-bold text-slate-900">LKR {off.totalOfferAmount.toLocaleString()}</span>)
                </p>
                {off.notes && <p className="text-slate-500 italic mt-1">&quot;{off.notes}&quot;</p>}
              </div>

              <SellerOfferActions offer={{ id: off.id, status: off.status, counterPrice: off.counterPrice, offeredPricePerUnit: off.offeredPricePerUnit }} />
            </div>
          ))}
        </div>
      </div>
      {/* Sold Orders */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
          <Printer className="w-5 h-5 text-emerald-600" />
          <h2 className="text-lg font-bold text-slate-900">Sold Orders & Receipts</h2>
        </div>
        <div className="divide-y divide-slate-100 text-xs">
          {orders.length === 0 && (
            <p className="py-6 text-xs text-slate-400 text-center">No completed orders yet.</p>
          )}
          {orders.map((o) => (
            <div key={o.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded text-[11px]">
                    {o.orderNumber}
                  </span>
                  <span className="font-bold text-slate-900">{o.listing.material.name}</span>
                </div>
                <p className="text-slate-500 mt-1">
                  Buyer: <span className="font-semibold text-slate-800">{o.buyer.name}</span> •{' '}
                  Qty: <span className="font-semibold">{o.quantity.toLocaleString()} {o.unit}</span> •{' '}
                  Total: <span className="font-bold text-slate-900">LKR {o.totalAmount.toLocaleString()}</span>
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  {o.paymentStatus}
                </span>
                <Link
                  href={`/dashboard/buyer/orders/${o.id}/print`}
                  target="_blank"
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-emerald-700 text-white rounded-lg font-bold text-[11px] transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Print Receipt
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
    </SellerDashboardWrapper>
  );
}
