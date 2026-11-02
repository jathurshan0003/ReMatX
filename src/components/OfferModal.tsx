'use client';

import React, { useState } from 'react';
import { X, CheckCircle2, ShieldCheck, DollarSign, Send, ArrowRight, Truck, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface OfferModalProps {
  isOpen: boolean;
  onClose: () => void;
  material: {
    id: string;
    materialId: string;
    name: string;
    unit: string;
    quantity: number;
    locationCity: string;
    listing?: {
      id: string;
      pricePerUnit: number;
      minOrderQuantity: number;
      availableQuantity: number;
    } | null;
  };
  initialMode?: 'BUY_NOW' | 'MAKE_OFFER' | 'REQUEST_QUOTE';
  onOrderSuccess?: (remainingQuantity: number) => void;
}

export const OfferModal: React.FC<OfferModalProps> = ({
  isOpen,
  onClose,
  material,
  initialMode = 'BUY_NOW',
  onOrderSuccess,
}) => {
  const router = useRouter();
  const [mode, setMode] = useState<'BUY_NOW' | 'MAKE_OFFER' | 'REQUEST_QUOTE'>(initialMode);
  const [quantity, setQuantity] = useState<number>(
    material.listing?.minOrderQuantity || Math.min(500, material.listing?.availableQuantity || material.quantity)
  );
  const [offeredPrice, setOfferedPrice] = useState<number>(material.listing?.pricePerUnit || 50);
  const [notes, setNotes] = useState<string>('');
  const [deliveryAddress, setDeliveryAddress] = useState<string>('Plot 42, Marine Drive, Colombo 03');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const availableStock = material.listing?.availableQuantity ?? material.quantity;
  const isOverStock = quantity > availableStock;

  const unitPrice = mode === 'BUY_NOW' ? material.listing?.pricePerUnit || 0 : offeredPrice;
  const subtotal = quantity * unitPrice;
  const estimatedLogistics = 450;
  const totalAmount = subtotal + estimatedLogistics;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (quantity <= 0) {
      setErrorMessage('Quantity must be greater than zero.');
      return;
    }

    if (quantity > availableStock) {
      setErrorMessage(
        `Requested quantity (${quantity} ${material.unit}) exceeds available stock. Only ${availableStock} ${material.unit} are available.`
      );
      return;
    }

    setSubmitting(true);

    try {
      if (mode === 'BUY_NOW') {
        const res = await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            listingId: material.listing?.id,
            materialId: material.id,
            quantity,
            unitPrice,
            subtotal,
            logisticsFee: estimatedLogistics,
            totalAmount,
            deliveryAddress,
          }),
        });

        const data = await res.json();
        if (res.ok) {
          setSuccessMessage('Order placed successfully! Stock has been updated automatically.');
          if (onOrderSuccess && typeof data.remainingQuantity === 'number') {
            onOrderSuccess(data.remainingQuantity);
          }
          router.refresh();
          setTimeout(() => {
            router.push('/orders');
          }, 1500);
        } else {
          setErrorMessage(data.error || 'Could not complete order. Please ensure listing has available quantity.');
        }
      } else {
        const res = await fetch('/api/offers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            listingId: material.listing?.id,
            materialId: material.id,
            requestedQuantity: quantity,
            offeredPricePerUnit: offeredPrice,
            notes,
            mode,
          }),
        });

        const data = await res.json();
        if (res.ok) {
          setSuccessMessage(
            mode === 'MAKE_OFFER'
              ? 'Offer sent to seller for review!'
              : 'Formal quotation request submitted!'
          );
          router.refresh();
          setTimeout(() => {
            onClose();
            router.push('/dashboard/buyer');
          }, 1500);
        } else {
          setErrorMessage(data.error || 'Failed to submit offer. Please check requested quantity.');
        }
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Error submitting transaction.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200">
        {/* Header */}
        <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-bold">
              Transaction Workflow
            </span>
            <h3 className="text-lg font-black text-white">{material.name}</h3>
            <p className="text-xs text-slate-400 font-mono mt-0.5">ID: {material.materialId}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Workflow Switcher Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 text-xs font-bold text-slate-600">
          <button
            type="button"
            onClick={() => setMode('BUY_NOW')}
            className={`flex-1 py-3 px-4 text-center transition-colors ${
              mode === 'BUY_NOW'
                ? 'bg-white text-emerald-700 border-b-2 border-emerald-600'
                : 'hover:text-slate-900'
            }`}
          >
            Buy Now (Escrow)
          </button>
          <button
            type="button"
            onClick={() => setMode('MAKE_OFFER')}
            className={`flex-1 py-3 px-4 text-center transition-colors ${
              mode === 'MAKE_OFFER'
                ? 'bg-white text-emerald-700 border-b-2 border-emerald-600'
                : 'hover:text-slate-900'
            }`}
          >
            Make an Offer
          </button>
          <button
            type="button"
            onClick={() => setMode('REQUEST_QUOTE')}
            className={`flex-1 py-3 px-4 text-center transition-colors ${
              mode === 'REQUEST_QUOTE'
                ? 'bg-white text-emerald-700 border-b-2 border-emerald-600'
                : 'hover:text-slate-900'
            }`}
          >
            Request Quote
          </button>
        </div>

        {successMessage ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-base text-slate-900">Success!</h4>
            <p className="text-xs text-slate-600">{successMessage}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
            {errorMessage && (
              <div className="p-3.5 bg-rose-50 border border-rose-300 text-rose-800 rounded-2xl text-xs font-bold flex items-start gap-2 shadow-sm animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Quantity */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block font-bold text-slate-700">
                  Quantity Needed ({material.unit}):
                </label>
                <span className={`text-[11px] font-bold ${availableStock <= 0 ? 'text-rose-600' : 'text-slate-500'}`}>
                  {availableStock <= 0
                    ? 'Out of stock'
                    : `${availableStock.toLocaleString()} ${material.unit} in stock`}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={1}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                  className={`w-full px-3 py-2 border rounded-xl font-bold text-slate-900 focus:outline-none focus:ring-2 ${
                    isOverStock
                      ? 'border-rose-400 bg-rose-50/40 focus:ring-rose-500 text-rose-900'
                      : 'border-slate-300 focus:ring-emerald-500'
                  }`}
                  required
                />
              </div>
              {isOverStock && (
                <p className="text-[11px] font-bold text-rose-600 mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>
                    Cannot order {quantity.toLocaleString()} {material.unit}. Only {availableStock.toLocaleString()} {material.unit} available.
                  </span>
                </p>
              )}
            </div>

            {/* Price field based on mode */}
            {mode === 'MAKE_OFFER' ? (
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Your Offered Price per {material.unit.split(' ')[0]} (LKR):
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min={1}
                    value={offeredPrice}
                    onChange={(e) => setOfferedPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 pl-8 border border-slate-300 rounded-xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                  <span className="absolute left-3 top-2.5 text-slate-400 font-bold">Rs</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Listed price: LKR {material.listing?.pricePerUnit?.toLocaleString()} / {material.unit}
                </p>
              </div>
            ) : mode === 'REQUEST_QUOTE' ? (
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Project Specification &amp; Special Requirements:
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="E.g., Require delivery with crane offloading to site in Moratuwa in 2 phases..."
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>
            ) : (
              <div>
                <label className="block font-bold text-slate-700 mb-1">Delivery Destination:</label>
                <div className="relative">
                  <input
                    type="text"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    className="w-full px-3 py-2 pl-8 border border-slate-300 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                  <Truck className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
                </div>
              </div>
            )}

            {/* Financial Breakdown (For Buy Now & Offers) */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-slate-600">
              <div className="flex justify-between">
                <span>Material Subtotal:</span>
                <span className="font-semibold text-slate-900">
                  LKR {subtotal.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Circular Haulage:</span>
                <span className="font-semibold text-slate-900">
                  LKR {estimatedLogistics.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-200 text-sm font-bold text-slate-900">
                <span>Total Commitment:</span>
                <span className="text-emerald-700 text-base font-black">
                  LKR {totalAmount.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-slate-500 bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-200">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                Protected by ReMatX Escrow: Funds are held securely and released only after delivery
                inspection passes on site.
              </span>
            </div>

            {/* Submit CTA */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 px-4 rounded-xl border border-slate-300 text-slate-700 font-bold hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md transition-colors flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <span>Processing...</span>
                ) : mode === 'BUY_NOW' ? (
                  <>
                    <span>Confirm Order</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                ) : mode === 'MAKE_OFFER' ? (
                  <>
                    <span>Submit Offer</span>
                    <Send className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    <span>Request Quote</span>
                    <Send className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
