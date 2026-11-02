'use client';

import React, { useRef } from 'react';
import { Printer, ArrowLeft, CheckCircle2, Package, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

interface Inspection {
  id: string;
  visualScore: number;
  assignedGrade: string;
  result: string;
  inspector: { name: string; company?: { name: string } | null };
  standard?: { code: string; title: string } | null;
  inspectionDate: string;
}

interface Order {
  id: string;
  orderNumber: string;
  invoiceNumber: string | null;
  createdAt: string;
  estimatedDelivery: string | null;
  trackingNumber: string | null;
  quantity: number;
  unit: string;
  unitPrice: number;
  subtotal: number;
  taxAmount: number;
  logisticsFee: number;
  totalAmount: number;
  paymentStatus: string;
  paymentMethod: string;
  deliveryStatus: string;
  deliveryAddress: string | null;
  buyer: {
    name: string;
    email: string;
    phone?: string | null;
    company?: { name: string; address?: string | null; contactPhone?: string | null } | null;
  };
  seller: {
    name: string;
    email: string;
    phone?: string | null;
    company?: { name: string; address?: string | null; contactPhone?: string | null } | null;
  };
  listing: {
    title: string;
    material: {
      materialId: string;
      name: string;
      description: string;
      dimensions: string;
      locationCity: string;
      locationAddress: string;
      conditionGrade: string;
      originBuilding?: string | null;
      category: { name: string };
    };
  };
}

function gradeLabel(g: string) {
  const map: Record<string, string> = {
    GRADE_A: 'Grade A — Excellent',
    GRADE_B: 'Grade B — Good',
    GRADE_C: 'Grade C — Fair',
    GRADE_D: 'Grade D — Poor',
    REJECTED: 'Rejected',
  };
  return map[g] ?? g;
}

export default function PrintReceiptClient({
  order,
  inspection,
  images,
}: {
  order: Order;
  inspection: Inspection | null;
  images: string[];
}) {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => window.print();

  const fmt = (n: number) =>
    new Intl.NumberFormat('en-LK', { style: 'currency', currency: 'LKR', maximumFractionDigits: 2 }).format(n);

  const fmtDate = (d: string) =>
    new Date(d).toLocaleDateString('en-LK', { year: 'numeric', month: 'long', day: 'numeric' });

  const m = order.listing.material;
  const firstImage = images[0] ?? null;

  return (
    <>
      {/* Screen controls — hidden when printing */}
      <div className="print:hidden bg-slate-100 min-h-screen py-8 px-4">
        <div className="max-w-4xl mx-auto space-y-4">
          {/* Top bar */}
          <div className="flex items-center justify-between">
            <Link
              href="/dashboard/buyer"
              className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 font-semibold"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Link>
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow transition-colors"
            >
              <Printer className="w-4 h-4" />
              Print Receipt
            </button>
          </div>

          {/* Preview frame */}
          <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-slate-200">
            <ReceiptBody order={order} inspection={inspection} firstImage={firstImage} fmt={fmt} fmtDate={fmtDate} m={m} />
          </div>
        </div>
      </div>

      {/* Print version — full width, no chrome */}
      <div className="hidden print:block">
        <ReceiptBody order={order} inspection={inspection} firstImage={firstImage} fmt={fmt} fmtDate={fmtDate} m={m} />
      </div>

      <style jsx global>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 15mm 15mm 15mm 15mm;
          }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
      `}</style>
    </>
  );
}

function ReceiptBody({
  order,
  inspection,
  firstImage,
  fmt,
  fmtDate,
  m,
}: {
  order: Order;
  inspection: Inspection | null;
  firstImage: string | null;
  fmt: (n: number) => string;
  fmtDate: (d: string) => string;
  m: Order['listing']['material'];
}) {
  return (
    <div className="p-10 font-sans text-slate-900 text-sm" style={{ minWidth: 640 }}>
      {/* ── Header ── */}
      <div className="flex items-start justify-between mb-8 pb-6 border-b-2 border-slate-900">
        <div>
          <div className="text-2xl font-black tracking-tight text-slate-900">
            Re<span className="text-emerald-600">Mat</span>X
          </div>
          <p className="text-xs text-slate-500 mt-0.5">Reusable Construction Materials Platform</p>
          <p className="text-[11px] text-slate-400 mt-0.5">www.rematx.lk • contact@rematx.lk</p>
        </div>
        <div className="text-right space-y-1">
          <div className="text-lg font-black text-slate-900">ORDER RECEIPT</div>
          <div className="text-xs text-slate-500">
            <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
              {order.orderNumber}
            </span>
          </div>
          {order.invoiceNumber && (
            <div className="text-[11px] text-slate-500">Invoice: <span className="font-mono">{order.invoiceNumber}</span></div>
          )}
          <div className="text-[11px] text-slate-500">
            Date: <span className="font-semibold">{fmtDate(order.createdAt)}</span>
          </div>
        </div>
      </div>

      {/* ── Physical Payment Notice ── */}
      <div className="mb-6 bg-amber-50 border border-amber-300 rounded-xl p-4 flex gap-3 items-start">
        <div className="mt-0.5 w-4 h-4 text-amber-600 shrink-0">⚠</div>
        <div>
          <p className="font-bold text-amber-800 text-xs">PHYSICAL PAYMENT REQUIRED</p>
          <p className="text-amber-700 text-[11px] mt-0.5 leading-relaxed">
            This order is settled by direct cash or bank transfer between buyer and seller.
            Present this receipt at the time of collection. Both parties must sign the confirmation section below.
          </p>
        </div>
      </div>

      {/* ── Parties ── */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
          <p className="text-[10px] font-bold uppercase text-slate-400 mb-2 tracking-widest">BUYER</p>
          <p className="font-bold text-slate-900">{order.buyer.name}</p>
          {order.buyer.company && (
            <p className="text-xs text-slate-600">{order.buyer.company.name}</p>
          )}
          <p className="text-[11px] text-slate-500 mt-1">{order.buyer.email}</p>
          {(order.buyer.phone || order.buyer.company?.contactPhone) && (
            <p className="text-[11px] text-slate-500">{order.buyer.phone || order.buyer.company?.contactPhone}</p>
          )}
          {order.buyer.company?.address && (
            <p className="text-[11px] text-slate-400 mt-1">{order.buyer.company.address}</p>
          )}
        </div>

        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
          <p className="text-[10px] font-bold uppercase text-slate-400 mb-2 tracking-widest">SELLER / SUPPLIER</p>
          <p className="font-bold text-slate-900">{order.seller.name}</p>
          {order.seller.company && (
            <p className="text-xs text-slate-600">{order.seller.company.name}</p>
          )}
          <p className="text-[11px] text-slate-500 mt-1">{order.seller.email}</p>
          {(order.seller.phone || order.seller.company?.contactPhone) && (
            <p className="text-[11px] text-slate-500">{order.seller.phone || order.seller.company?.contactPhone}</p>
          )}
          {order.seller.company?.address && (
            <p className="text-[11px] text-slate-400 mt-1">{order.seller.company.address}</p>
          )}
        </div>
      </div>

      {/* ── Material Details ── */}
      <div className="mb-6 border border-slate-200 rounded-xl overflow-hidden">
        <div className="bg-slate-900 text-white px-4 py-2.5 flex items-center gap-2">
          <Package className="w-4 h-4" />
          <span className="text-xs font-bold uppercase tracking-widest">Material Details</span>
        </div>
        <div className="p-4">
          <div className="flex gap-4 items-start">
            {firstImage && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={firstImage}
                alt={m.name}
                className="w-24 h-24 object-cover rounded-lg border border-slate-200 shrink-0"
              />
            )}
            <div className="flex-1 space-y-1.5">
              <div className="flex items-center gap-2">
                <p className="font-bold text-slate-900">{m.name}</p>
                <span className="font-mono text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">{m.materialId}</span>
              </div>
              <p className="text-xs text-slate-600">{m.category.name} • {m.dimensions}</p>
              <p className="text-[11px] text-slate-500 line-clamp-2">{m.description}</p>
              {m.originBuilding && (
                <p className="text-[11px] text-slate-500">Origin: <span className="font-semibold">{m.originBuilding}</span></p>
              )}
              <p className="text-[11px] text-slate-500">
                Location: <span className="font-semibold">{m.locationAddress}, {m.locationCity}</span>
              </p>
            </div>
          </div>

          {inspection && (
            <div className="mt-4 pt-4 border-t border-slate-100 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
              <div className="text-[11px] text-slate-600 space-y-0.5">
                <p className="font-bold text-emerald-700">Inspector Verified</p>
                <p>Grade: <span className="font-semibold">{gradeLabel(inspection.assignedGrade)}</span> • Visual Score: <span className="font-semibold">{inspection.visualScore}/100</span></p>
                {inspection.standard && (
                  <p>Standard: <span className="font-mono">{inspection.standard.code}</span> — {inspection.standard.title}</p>
                )}
                <p>Inspected by: <span className="font-semibold">{inspection.inspector.name}</span> on {fmtDate(inspection.inspectionDate)}</p>
                <p className="text-slate-400 italic text-[10px]">
                  Platform visual & non-destructive assessment. Structural reuse subject to project engineer validation.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Line Items ── */}
      <div className="mb-6 border border-slate-200 rounded-xl overflow-hidden">
        <div className="bg-slate-900 text-white px-4 py-2.5">
          <span className="text-xs font-bold uppercase tracking-widest">Order Summary</span>
        </div>
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="text-left px-4 py-2.5 font-semibold text-slate-600">Description</th>
              <th className="text-right px-4 py-2.5 font-semibold text-slate-600">Qty</th>
              <th className="text-right px-4 py-2.5 font-semibold text-slate-600">Unit Price</th>
              <th className="text-right px-4 py-2.5 font-semibold text-slate-600">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            <tr>
              <td className="px-4 py-3">
                <p className="font-semibold text-slate-900">{m.name}</p>
                <p className="text-[10px] text-slate-400">{order.listing.title}</p>
              </td>
              <td className="text-right px-4 py-3 font-mono">
                {order.quantity.toLocaleString()} {order.unit}
              </td>
              <td className="text-right px-4 py-3 font-mono">{fmt(order.unitPrice)}</td>
              <td className="text-right px-4 py-3 font-mono font-semibold">{fmt(order.subtotal)}</td>
            </tr>
          </tbody>
          <tfoot className="border-t-2 border-slate-200">
            <tr className="bg-slate-50">
              <td colSpan={3} className="text-right px-4 py-2 text-slate-600">Subtotal</td>
              <td className="text-right px-4 py-2 font-mono text-slate-900">{fmt(order.subtotal)}</td>
            </tr>
            {order.logisticsFee > 0 && (
              <tr className="bg-slate-50">
                <td colSpan={3} className="text-right px-4 py-2 text-slate-600">Logistics & Handling Fee</td>
                <td className="text-right px-4 py-2 font-mono text-slate-900">{fmt(order.logisticsFee)}</td>
              </tr>
            )}
            {order.taxAmount > 0 && (
              <tr className="bg-slate-50">
                <td colSpan={3} className="text-right px-4 py-2 text-slate-600">Tax</td>
                <td className="text-right px-4 py-2 font-mono text-slate-900">{fmt(order.taxAmount)}</td>
              </tr>
            )}
            <tr className="bg-slate-900 text-white">
              <td colSpan={3} className="text-right px-4 py-3 font-bold text-sm">TOTAL AMOUNT DUE</td>
              <td className="text-right px-4 py-3 font-black text-sm font-mono">{fmt(order.totalAmount)}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* ── Delivery & Tracking ── */}
      <div className="grid grid-cols-2 gap-4 mb-6 text-[11px]">
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
          <p className="font-bold text-slate-700 mb-2 uppercase text-[10px] tracking-widest">Delivery Information</p>
          <p className="text-slate-600">Address: <span className="font-semibold text-slate-900">{order.deliveryAddress ?? 'To be confirmed'}</span></p>
          <p className="text-slate-600 mt-1">Status: <span className="font-semibold text-slate-900">{order.deliveryStatus}</span></p>
          {order.estimatedDelivery && (
            <p className="text-slate-600 mt-1">Est. Delivery: <span className="font-semibold text-slate-900">{fmtDate(order.estimatedDelivery)}</span></p>
          )}
          {order.trackingNumber && (
            <p className="text-slate-600 mt-1">Tracking: <span className="font-mono font-semibold text-slate-900">{order.trackingNumber}</span></p>
          )}
        </div>
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
          <p className="font-bold text-slate-700 mb-2 uppercase text-[10px] tracking-widest">Payment Information</p>
          <p className="text-slate-600">Method: <span className="font-semibold text-slate-900">Physical / Direct Payment</span></p>
          <p className="text-slate-600 mt-1">Payment Status: <span className="font-semibold text-slate-900">{order.paymentStatus}</span></p>
          <p className="text-slate-400 mt-2 text-[10px] italic leading-relaxed">
            Payment is made directly from buyer to seller at the time of goods collection or per agreed terms.
          </p>
        </div>
      </div>

      {/* ── Signature Blocks ── */}
      <div className="mb-8 border-t-2 border-dashed border-slate-300 pt-6">
        <p className="text-xs font-bold text-slate-700 mb-4 text-center uppercase tracking-widest">
          Confirmation of Receipt — Both parties must sign
        </p>
        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <div className="h-14 border-b border-slate-400"></div>
              <p className="text-[11px] text-slate-500 mt-1">Buyer Signature</p>
              <p className="text-[11px] font-bold text-slate-700">{order.buyer.name}</p>
              {order.buyer.company && <p className="text-[10px] text-slate-400">{order.buyer.company.name}</p>}
            </div>
            <div>
              <div className="h-8 border-b border-slate-400"></div>
              <p className="text-[11px] text-slate-500 mt-1">Date of Collection / Payment</p>
            </div>
          </div>
          <div className="space-y-6">
            <div>
              <div className="h-14 border-b border-slate-400"></div>
              <p className="text-[11px] text-slate-500 mt-1">Seller Signature</p>
              <p className="text-[11px] font-bold text-slate-700">{order.seller.name}</p>
              {order.seller.company && <p className="text-[10px] text-slate-400">{order.seller.company.name}</p>}
            </div>
            <div>
              <div className="h-8 border-b border-slate-400"></div>
              <p className="text-[11px] text-slate-500 mt-1">Date of Handover</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Footer ── */}
      <div className="border-t border-slate-200 pt-4 text-center space-y-1">
        <p className="text-[10px] text-slate-400">
          This document is a legally binding order confirmation between the buyer and seller on the ReMatX platform.
        </p>
        <p className="text-[10px] text-slate-400">
          Order ID: <span className="font-mono">{order.id}</span> • Generated: {new Date().toLocaleString('en-LK')}
        </p>
        <p className="text-[10px] text-slate-500 font-semibold">
          ReMatX — Circular Economy for Construction Materials • Sri Lanka
        </p>
      </div>
    </div>
  );
}
