'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  Recycle,
  HardHat,
  Building2,
  FileCheck,
  Compass,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();

  const [role, setRole] = useState('CONTRACTOR');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [companyName, setCompanyName] = useState('');
  const [companyType, setCompanyType] = useState('DEMOLITION');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const roles = [
    {
      id: 'CONTRACTOR',
      badge: 'SELL MATERIALS',
      title: 'Seller (Contractor / Salvager)',
      desc: 'List recovered materials with pictures, set pricing, request audits, and fulfill orders.',
      icon: HardHat,
      color: 'amber',
    },
    {
      id: 'BUYER',
      badge: 'BUY MATERIALS',
      title: 'Buyer (Builder / Procurement)',
      desc: 'Browse certified inventory, purchase verified materials, and submit price offers.',
      icon: Building2,
      color: 'blue',
    },
    {
      id: 'INSPECTOR',
      badge: 'INSPECT MATERIALS',
      title: 'Inspector (Quality Auditor)',
      desc: 'Review uploaded photos, conduct SLSI standard tests, and assign grades to material batches.',
      icon: FileCheck,
      color: 'emerald',
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData();
    formData.set('name', name);
    formData.set('email', email);
    formData.set('password', password);
    formData.set('role', role);
    formData.set('phone', phone);
    formData.set('companyName', companyName);
    formData.set('companyType', companyType);
    if (avatarFile) formData.set('avatar', avatarFile);

    const result = await register(formData);

    if (result.success) {
      router.push(result.redirectUrl || '/marketplace');
    } else {
      setError(result.error || 'Failed to create account');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8">
      <div className="text-center max-w-xl mx-auto space-y-2">
        <Link href="/" className="inline-flex items-center gap-2 mb-2 group">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
            <Recycle className="w-4 h-4" />
          </div>
          <span className="font-black text-lg text-slate-900">
            ReMat<span className="text-emerald-600">X</span>
          </span>
        </Link>
        <h1 className="text-3xl font-black text-slate-900">Create Role-Based Account</h1>
        <p className="text-xs text-slate-500">
          Select your operational role in the circular construction supply chain.
        </p>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl text-xs font-semibold text-center">
          {error}
        </div>
      )}

      {/* Step 1: Role Selection Cards */}
      <div className="space-y-3">
        <label className="block font-bold text-xs uppercase tracking-wider text-slate-500 text-center">
          Select Your Organization / Individual Capability:
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {roles.map((r) => {
            const Icon = r.icon;
            const isSelected = role === r.id;
            return (
              <button
                key={r.id}
                type="button"
                onClick={() => {
                  setRole(r.id);
                  if (r.id === 'CONTRACTOR') setCompanyType('DEMOLITION');
                  if (r.id === 'BUYER') setCompanyType('CONTRACTOR');
                  if (r.id === 'INSPECTOR') setCompanyType('ENGINEERING');
                }}
                className={`p-5 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                  isSelected
                    ? 'border-emerald-500 bg-emerald-50/80 shadow-lg ring-2 ring-emerald-500/20'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        isSelected ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    {isSelected ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    ) : (
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                        {r.badge}
                      </span>
                    )}
                  </div>
                  {isSelected && (
                    <span className="inline-block mb-1.5 text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                      {r.badge}
                    </span>
                  )}
                  <h3 className="font-bold text-slate-900 text-sm">{r.title}</h3>
                  <p className="text-[11px] text-slate-500 mt-1.5 leading-relaxed">{r.desc}</p>
                </div>
                <div className="mt-4 pt-2 border-t border-slate-100 text-[10px] font-bold text-slate-500 uppercase">
                  Role ID: <span className="font-mono text-emerald-700">{r.id}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Step 2: Account & Company Details Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xl space-y-6 text-xs">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-3">
          Account Credentials &amp; Verification Details
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Full Name:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Sunil Wickramasinghe"
              className="w-full px-3 py-2 border border-slate-300 rounded-xl text-slate-900 font-semibold focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Email Address:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. sunil@demolitions.lk"
              className="w-full px-3 py-2 border border-slate-300 rounded-xl text-slate-900 font-semibold focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Create Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              className="w-full px-3 py-2 border border-slate-300 rounded-xl text-slate-900 font-semibold focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Phone Number:</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+94 77 123 4567"
              className="w-full px-3 py-2 border border-slate-300 rounded-xl text-slate-900 font-semibold"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block font-bold text-slate-700 mb-1">Profile Photo (Optional):</label>
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={(e) => setAvatarFile(e.target.files?.[0] || null)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl text-slate-900 font-semibold"
            />
            <p className="text-[10px] text-slate-500 mt-1">PNG, JPG, or WebP up to 2 MB. Leave blank to use your initials.</p>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Company / Organization Name:</label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="e.g. Green Demolitions Ltd"
              className="w-full px-3 py-2 border border-slate-300 rounded-xl text-slate-900 font-semibold"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Industry Type:</label>
            <select
              value={companyType}
              onChange={(e) => setCompanyType(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white text-slate-900 font-semibold"
            >
              <option value="DEMOLITION">Demolition &amp; Salvage</option>
              <option value="CONTRACTOR">General Civil Contractor</option>
              <option value="ARCHITECTURE">Architecture &amp; Design</option>
              <option value="ENGINEERING">Structural Engineering</option>
              <option value="RECYCLER">Material Recycling</option>
            </select>
          </div>
        </div>

        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-500">
          <ShieldCheck className="w-4 h-4 text-emerald-600 inline mr-1" />
          By registering, you confirm participation in the Sri Lanka Circular Construction framework. Professional
          accounts undergo credential auditing for high-grade structural listings.
        </div>

        <div className="pt-2 flex items-center justify-between">
          <Link href="/auth/login" className="text-slate-600 hover:text-slate-900 font-bold">
            Already have an account? Sign In &rarr;
          </Link>

          <button
            type="submit"
            disabled={loading}
            className="py-3 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md transition-colors flex items-center gap-2"
          >
            <span>{loading ? 'Registering...' : `Register as ${role}`}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
