'use client';

import React, { useState } from 'react';

export function BuyerOfferActions({ offerId, initialStatus }: { offerId: string; initialStatus: string }) {
  const [status, setStatus] = useState(initialStatus);
  const [error, setError] = useState<string | null>(null);
  const [buying, setBuying] = useState(false);

  const buyNegotiatedOffer = async () => {
    setError(null);
    setBuying(true);
    const response = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ offerId, deliveryAddress: 'Buyer delivery site' }),
    });
    const data = await response.json();
    setBuying(false);
    if (!response.ok) {
      setError(data.error || 'Could not place negotiated order.');
      return;
    }
    window.location.href = '/orders';
  };

  const acceptCounter = async () => {
    setError(null);
    const response = await fetch('/api/offers', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ offerId, action: 'ACCEPT_COUNTER' }),
    });
    const data = await response.json();
    if (!response.ok) {
      setError(data.error || 'Could not accept counter-offer.');
      return;
    }
    setStatus(data.offer.status);
  };

  return status === 'ACCEPTED' ? (
    <button disabled={buying} onClick={buyNegotiatedOffer} className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-[11px] font-bold disabled:opacity-50">
      {buying ? 'Buying...' : 'Buy Negotiated Material'}
    </button>
  ) : (
    <div className="flex flex-col items-end gap-1">
      <button onClick={acceptCounter} className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-[11px] font-bold">
        Accept Counter
      </button>
      {error && <span className="text-[10px] text-rose-700">{error}</span>}
    </div>
  );
}