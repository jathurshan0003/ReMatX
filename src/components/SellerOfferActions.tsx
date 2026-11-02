'use client';

import React, { useState } from 'react';

export function SellerOfferActions({ offer }: { offer: { id: string; status: string; counterPrice: number | null; offeredPricePerUnit: number } }) {
  const [status, setStatus] = useState(offer.status);
  const [counterPrice, setCounterPrice] = useState(offer.counterPrice?.toString() || '');
  const [error, setError] = useState<string | null>(null);

  const updateOffer = async (action: string) => {
    setError(null);
    const response = await fetch('/api/offers', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ offerId: offer.id, action, counterPrice }),
    });
    const data = await response.json();
    if (!response.ok) return setError(data.error || 'Could not update offer.');
    setStatus(data.offer.status);
    if (data.offer.counterPrice) setCounterPrice(String(data.offer.counterPrice));
  };

  if (status !== 'PENDING' && status !== 'COUNTERED') {
    return <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700">{status}</span>;
  }

  return (
    <div className="flex flex-wrap items-center justify-end gap-2">
      <button onClick={() => updateOffer('ACCEPT')} className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-[11px] font-bold">Accept</button>
      <button onClick={() => updateOffer('REJECT')} className="px-3 py-1.5 rounded-lg bg-rose-100 text-rose-700 text-[11px] font-bold">Reject</button>
      <input type="number" min="0.01" value={counterPrice} onChange={(e) => setCounterPrice(e.target.value)} placeholder="Counter LKR" className="w-24 px-2 py-1.5 border border-slate-300 rounded-lg text-[11px] text-slate-900" />
      <button onClick={() => updateOffer('COUNTER')} className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-[11px] font-bold">Counter</button>
      {error && <span className="w-full text-[10px] text-rose-700">{error}</span>}
    </div>
  );
}