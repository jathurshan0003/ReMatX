import React from 'react';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import {
  ShoppingBag,
  Truck,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ExternalLink,
  FileText,
  MapPin,
  ArrowRight,
  DollarSign,
} from 'lucide-react';

export const revalidate = 0;

export default async function OrdersPage() {
  const orders = await prisma.order.findMany({
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
      buyer: true,
      seller: {
        include: { company: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="border-b border-slate-200 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">
            Transactions &amp; Logistics
          </span>
          <h1 className="text-3xl font-black text-slate-900 mt-1">Orders &amp; Escrow Tracking</h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Track material custody transfers, escrow funds security, and site delivery dispatches.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 bg-emerald-50 px-3.5 py-2 rounded-xl border border-emerald-200">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Escrow Protected Marketplace</span>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-6">
        {orders.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 space-y-3">
            <ShoppingBag className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="font-bold text-slate-800 text-base">No active orders</h3>
            <p className="text-xs text-slate-500">
              Browse the marketplace and use "Buy Now" or "Make Offer" to initiate an escrow order.
            </p>
            <Link
              href="/marketplace"
              className="inline-block mt-2 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold"
            >
              Go to Marketplace &rarr;
            </Link>
          </div>
        ) : (
          orders.map((order) => {
            const mat = order.listing.material;
            let materialImages: string[] = [];
            try {
              materialImages = JSON.parse(mat.images || '[]');
            } catch {
              materialImages = [];
            }
            const uploadedImage = materialImages.find((image) => typeof image === 'string' && image.trim());
            return (
              <div
                key={order.id}
                className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6 hover:border-emerald-300 transition-colors"
              >
                {/* Order Top Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4 text-xs">
                  <div>
                    <span className="font-mono font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded text-[11px]">
                      {order.orderNumber}
                    </span>
                    <span className="text-slate-400 mx-2">•</span>
                    <span className="text-slate-500">Placed on {new Date(order.createdAt).toLocaleDateString()}</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    {/* Payment Status Pill */}
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-bold bg-amber-50 text-amber-800 border border-amber-300">
                      <Clock className="w-3.5 h-3.5 text-amber-600" />
                      <span>Payment: {order.paymentStatus}</span>
                    </div>

                    {/* Delivery Status Pill */}
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-bold bg-blue-50 text-blue-800 border border-blue-300">
                      <Truck className="w-3.5 h-3.5 text-blue-600" />
                      <span>Delivery: {order.deliveryStatus}</span>
                    </div>
                  </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                  {/* Item Summary (7 cols) */}
                  <div className="md:col-span-7 flex items-start gap-4">
                    <div className="w-20 h-20 rounded-2xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0">
                      {uploadedImage ? (
                        <img
                          src={uploadedImage}
                          alt={mat.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[10px] font-semibold text-slate-400 text-center px-2">
                          No image
                        </div>
                      )}
                    </div>
                    <div className="space-y-1 text-xs">
                      <Link
                        href={`/materials/${mat.id}`}
                        className="font-bold text-slate-900 text-sm hover:text-emerald-700 transition-colors block"
                      >
                        {mat.name}
                      </Link>
                      <p className="text-slate-500">
                        Category: <span className="font-semibold text-slate-700">{mat.category.name}</span>
                      </p>
                      <p className="text-slate-500">
                        Quantity Ordered:{' '}
                        <span className="font-bold text-slate-900">
                          {order.quantity.toLocaleString()} {order.unit}
                        </span>
                      </p>
                      {mat.passport && (
                        <Link
                          href={`/passports/${mat.passport.passportNumber}`}
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 hover:text-emerald-800 pt-1"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>Digital Passport ({mat.passport.passportNumber})</span>
                        </Link>
                      )}
                    </div>
                  </div>

                  {/* Financial & Invoicing (5 cols) */}
                  <div className="md:col-span-5 bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-xs">
                    <div className="flex justify-between text-slate-600">
                      <span>Item Subtotal:</span>
                      <span className="font-semibold text-slate-800">
                        LKR {order.subtotal.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Circularity Logistics:</span>
                      <span className="font-semibold text-slate-800">
                        LKR {order.logisticsFee.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-slate-900 font-bold pt-2 border-t border-slate-200 text-sm">
                      <span>Total Invoiced:</span>
                      <span className="text-emerald-700 font-black">
                        LKR {order.totalAmount.toLocaleString()}
                      </span>
                    </div>
                    {order.invoiceNumber && (
                      <div className="text-[10px] text-slate-400 text-right pt-1 font-mono">
                        Invoice Ref: {order.invoiceNumber}
                      </div>
                    )}
                  </div>
                </div>

                {/* Logistics Details */}
                <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Site Delivery Destination:</span>
                    <span className="font-semibold text-slate-800 truncate block mt-0.5">
                      {order.deliveryAddress || 'Central Contractor Yard'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Freight Carrier:</span>
                    <span className="font-semibold text-slate-800 block mt-0.5">
                      {order.carrierName || 'Circular Haulage Logistics'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Waybill Tracking:</span>
                    <span className="font-mono font-bold text-emerald-700 block mt-0.5">
                      {order.trackingNumber || 'PENDING DISPATCH'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
