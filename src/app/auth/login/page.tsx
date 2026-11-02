'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Recycle, ArrowRight, Lock, Mail } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const result = await login(email, password);
    if (result.success) {
      router.push(result.redirectUrl || '/marketplace');
    } else {
      setError(result.error || 'Failed to sign in');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch">
        {/* Left Side: Standard Login Form (7 cols) */}
        <div className="md:col-span-7 bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 shadow-xl flex flex-col justify-between">
          <div className="space-y-6">
            <div>
              <Link href="/" className="inline-flex items-center gap-2 mb-4 group">
                <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
                  <Recycle className="w-4 h-4" />
                </div>
                <span className="font-black text-lg text-slate-900">
                  ReMat<span className="text-emerald-600">X</span>
                </span>
              </Link>
              <h1 className="text-2xl font-black text-slate-900">Role-Based Account Sign In</h1>
              <p className="text-xs text-slate-500 mt-1">
                Access your personalized circular procurement, salvage, or auditing desk.
              </p>
            </div>

            {error && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-semibold">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Email Address:</label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full pl-9 pr-3 py-2.5 border border-slate-300 rounded-xl text-slate-900 font-semibold focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Password:</label>
                <div className="relative">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-9 pr-3 py-2.5 border border-slate-300 rounded-xl text-slate-900 font-semibold focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-2"
              >
                <span>{loading ? 'Authenticating...' : 'Sign In & Enter Dashboard'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>

          <div className="pt-6 border-t border-slate-100 text-center text-xs text-slate-500 mt-6">
            Need a registered account?{' '}
            <Link href="/auth/register" className="font-bold text-emerald-700 hover:text-emerald-800">
              Register as Contractor, Buyer, or Inspector &rarr;
            </Link>
          </div>
        </div>

        <div className="md:col-span-5 bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <div>
              <h3 className="text-base font-bold text-white">Role-Based Platform Access</h3>
              <p className="text-xs text-slate-400 mt-1">
                Each account has specific permissions based on operational capability in the circular supply chain.
              </p>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="p-3 rounded-2xl border border-slate-700 bg-slate-800/80 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-400 text-xs">🏗️ Seller (Contractor / Salvager)</span>
                  <span className="text-[10px] font-bold text-amber-300/80 uppercase">Sell</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Upload recovered construction lots with photos, request audits, manage inventories, and accept orders.
                </p>
              </div>

              <div className="p-3 rounded-2xl border border-slate-700 bg-slate-800/80 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-blue-400 text-xs">🛒 Buyer (Builder / Specifier)</span>
                  <span className="text-[10px] font-bold text-blue-300/80 uppercase">Buy</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Browse catalog of verified materials, place escrow orders, submit price offers, and track delivery.
                </p>
              </div>

              <div className="p-3 rounded-2xl border border-slate-700 bg-slate-800/80 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-400 text-xs">🔬 Inspector (Materials Auditor)</span>
                  <span className="text-[10px] font-bold text-emerald-300/80 uppercase">Inspect</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Review uploaded photos, conduct non-destructive tests, and verify material batches with Grade A–D results.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400 text-center">
            New to ReMatX? Register your specialized account above to get started.
          </div>
        </div>
      </div>
    </div>
  );
}
