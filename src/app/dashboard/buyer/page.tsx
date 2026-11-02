import React from 'react';
import { prisma } from '@/lib/prisma';
import { BuyerDashboardWrapper } from '@/components/BuyerDashboardWrapper';
import Link from 'next/link';
import {
  ShoppingBag,
  Send,
  FileText,
  QrCode,
  CheckCircle2,
  Clock,
  ArrowRight,
  Sparkles,
  Building2,
  Printer,
} from 'lucide-react';
import { GradeBadge } from '@/components/GradeBadge';

import { cookies } from 'next/headers';
import { getUserFromToken } from '@/lib/auth';
import { BuyerOfferActions } from '@/components/BuyerOfferActions';

export const revalidate = 0;

export default async function BuyerDashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('rematx_token')?.value;
  const authUser = await getUserFromToken(token);

  const orders = await prisma.order.findMany({
    where: authUser?.role === 'ADMIN' ? {} : (authUser ? { buyerId: authUser.id } : {}),
    include: {
      listing: {
        include: {
          material: {
            include: {
              category: true,
              passport: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  const offers = await prisma.offer.findMany({
    where: authUser?.role === 'ADMIN' ? {} : (authUser ? { buyerId: authUser.id } : {}),
    include: {
      listing: {
        include: {
          material: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  // Passports in buyer custody
  const passports = await prisma.materialPassport.findMany({
    include: {
      material: {
        include: { category: true },
      },
    },
    take: 4,
  });

  return (
    <BuyerDashboardWrapper>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Buyer Welcome Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-10 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 font-mono text-[11px] font-bold">
              Buyer &amp; Specifier Portal
            </span>
            <span className="text-slate-400 text-xs">•</span>
            <span className="text-slate-400 text-xs">{authUser?.companyName || 'Commercial Buyer / Contractor'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Welcome back, {authUser?.name || 'Buyer'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
            Manage your procurement pipelines, project quotations, active escrow orders, and registered Digital
            Material Passports.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/marketplace"
            className="px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs transition-colors shadow-sm"
          >
            Source New Materials &rarr;
          </Link>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs text-slate-500 font-semibold block">Active Escrow Orders</span>
          <p className="text-2xl font-black text-slate-900 mt-1">{orders.length}</p>
          <span className="text-[10px] text-emerald-600 font-bold">Funds held in escrow</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs text-slate-500 font-semibold block">Offers &amp; Quotations</span>
          <p className="text-2xl font-black text-slate-900 mt-1">{offers.length}</p>
          <span className="text-[10px] text-blue-600 font-bold">In active negotiation</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs text-slate-500 font-semibold block">Embodied CO₂ Avoided</span>
          <p className="text-2xl font-black text-emerald-600 mt-1">1,260 kg</p>
          <span className="text-[10px] text-emerald-600 font-bold">LEED &amp; GreenSL credits</span>
        </div>
      </div>

      {/* Section: Active Orders */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-emerald-600" />
            <h2 className="text-lg font-bold text-slate-900">Procurement Orders &amp; Delivery Tracking</h2>
          </div>
          <Link href="/orders" className="text-xs font-bold text-emerald-700 hover:text-emerald-800">
            View All Orders &rarr;
          </Link>
        </div>

        <div className="divide-y divide-slate-100">
          {orders.length === 0 && (
            <p className="py-6 text-xs text-slate-400 text-center">No orders yet. Browse the marketplace to purchase verified materials.</p>
          )}
          {orders.map((o) => (
            <div key={o.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded text-[11px]">
                    {o.orderNumber}
                  </span>
                  <span className="font-bold text-slate-900">{o.listing.material.name}</span>
                </div>
                <p className="text-slate-500 mt-1">
                  Qty: <span className="font-semibold text-slate-800">{o.quantity.toLocaleString()} {o.unit}</span> • Total: <span className="font-bold text-slate-900">LKR {o.totalAmount.toLocaleString()}</span>
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-50 text-blue-800 border border-blue-200">
                  {o.deliveryStatus}
                </span>
                <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  {o.paymentStatus}
                </span>
                <Link
                  href={`/dashboard/buyer/orders/${o.id}/print`}
                  target="_blank"
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-emerald-700 text-white rounded-lg font-bold text-[11px] transition-colors"
                  title="Print Receipt"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Print Receipt
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section: Offers & Quotations */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <Send className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-bold text-slate-900">Submitted Offers &amp; Negotiations</h2>
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {offers.map((off) => (
            <div key={off.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
              <div>
                <span className="font-bold text-slate-900 text-sm block">
                  {off.listing.material.name}
                </span>
                <p className="text-slate-500 mt-0.5">
                  Offered: <span className="font-bold text-slate-900">LKR {off.offeredPricePerUnit} / unit</span> for {off.requestedQuantity} units
                </p>
                {off.counterPrice && (
                  <p className="text-blue-700 mt-1 font-semibold">Seller counter-offer: LKR {off.counterPrice} / unit</p>
                )}
                {off.notes && (
                  <p className="text-slate-400 italic text-[11px] mt-1">&quot;{off.notes}&quot;</p>
                )}
              </div>

              <div className="flex items-center gap-2">
                {['COUNTERED', 'ACCEPTED'].includes(off.status) && (
                  <BuyerOfferActions offerId={off.id} initialStatus={off.status} />
                )}
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold ${
                    off.status === 'ACCEPTED'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {off.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section: Material Passports in Project Specification */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <QrCode className="w-5 h-5 text-emerald-600" />
            <h2 className="text-lg font-bold text-slate-900">Material Passports Spec Library</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {passports.map((p) => (
            <div key={p.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                  {p.passportNumber}
                </span>
                <GradeBadge grade={p.material.conditionGrade} size="sm" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-xs line-clamp-1">{p.material.name}</h4>
                <p className="text-[11px] text-slate-500">{p.material.category.name}</p>
              </div>
              <Link
                href={`/passports/${p.passportNumber}`}
                className="block text-center w-full py-1.5 px-3 rounded-lg bg-slate-900 hover:bg-emerald-600 text-white font-bold text-xs transition-colors"
              >
                Inspect Passport &rarr;
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
    </BuyerDashboardWrapper>
  );
}
