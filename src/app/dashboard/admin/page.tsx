import React from 'react';
import { prisma } from '@/lib/prisma';
import { AdminDashboardWrapper } from '@/components/AdminDashboardWrapper';
import { AdminUserManagement } from '@/components/AdminUserManagement';
import { AdminMaterialManagement } from '@/components/AdminMaterialManagement';
import Link from 'next/link';
import {
  ShieldAlert,
  Users,
  Building2,
  Layers,
  Scale,
  DollarSign,
  TrendingUp,
  FileCheck,
  CheckCircle2,
  AlertTriangle,
  QrCode,
  Sparkles,
} from 'lucide-react';

import { cookies } from 'next/headers';
import { getUserFromToken } from '@/lib/auth';

export const revalidate = 0;

export default async function AdminDashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('rematx_token')?.value;
  const authUser = await getUserFromToken(token);

  const users = await prisma.user.findMany({
    include: { company: true },
    orderBy: { createdAt: 'desc' },
  });

  const companies = await prisma.company.findMany({
    include: { users: true },
  });

  const materials = await prisma.material.findMany({
    include: { category: true, passport: true },
  });

  const standards = await prisma.standard.findMany({
    include: { category: true },
  });

  const orders = await prisma.order.findMany();
  const passports = await prisma.materialPassport.findMany();

  const totalCarbonKg = passports.reduce((sum, p) => sum + p.embodiedCarbonSavedKg, 0);
  const totalWasteKg = passports.reduce((sum, p) => sum + p.wasteDivertedKg, 0);
  const totalGMV = orders.reduce((sum, o) => sum + o.totalAmount, 0);

  return (
    <AdminDashboardWrapper>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Admin Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-10 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-400 font-mono text-[11px] font-bold">
              Platform Governance &amp; Administration
            </span>
            <span className="text-slate-400 text-xs">•</span>
            <span className="text-slate-400 text-xs">ReMatX Foundation Lead</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">{authUser?.name || 'Administrator'}, Platform Lead</h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
            Monitor circularity accounting, manage user roles and company verifications, oversee standards versioning,
            and inspect escrow settlements.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-xs text-slate-400 block">Total Escrow GMV</span>
            <span className="text-2xl font-black text-emerald-400 font-mono">
              LKR {(totalGMV / 1000).toFixed(1)}k
            </span>
          </div>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs text-slate-500 font-semibold block">Total Diverted Landfill</span>
          <p className="text-2xl font-black text-slate-900 mt-1">
            {(totalWasteKg / 1000).toFixed(1)}{' '}
            <span className="text-xs font-semibold text-slate-500">Tonnes</span>
          </p>
          <span className="text-[10px] text-emerald-600 font-bold">Documented mass</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs text-slate-500 font-semibold block">Avoided Embodied Carbon</span>
          <p className="text-2xl font-black text-emerald-600 mt-1">
            {totalCarbonKg.toLocaleString()}{' '}
            <span className="text-xs font-semibold text-slate-500">kg CO₂e</span>
          </p>
          <span className="text-[10px] text-emerald-600 font-bold">CIBSE / ICE aligned</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs text-slate-500 font-semibold block">Registered Users</span>
          <p className="text-2xl font-black text-slate-900 mt-1">{users.length}</p>
          <span className="text-[10px] text-slate-500">8 Roles active</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs text-slate-500 font-semibold block">Active Standards</span>
          <p className="text-2xl font-black text-slate-900 mt-1">{standards.length}</p>
          <span className="text-[10px] text-slate-500">SLSI / ISO specifications</span>
        </div>
      </div>

      <AdminUserManagement initialUsers={users} />
      <AdminMaterialManagement initialMaterials={materials} />

      {/* Companies & Business Verifications */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-bold text-slate-900">Registered Professional Companies</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {companies.map((comp) => (
            <div key={comp.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">{comp.name}</span>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                  {comp.verifiedStatus}
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Reg: <span className="font-mono">{comp.businessRegNumber}</span> • Type:{' '}
                <span className="font-semibold">{comp.companyType}</span>
              </p>
              <p className="text-[11px] text-slate-600 truncate">{comp.address}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Standards Governance */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-bold text-slate-900">Standards Registry Maintenance</h2>
          </div>
          <Link href="/standards" className="text-xs font-bold text-emerald-700 hover:text-emerald-800">
            View Public Standards &rarr;
          </Link>
        </div>

        <div className="divide-y divide-slate-100 text-xs">
          {standards.map((s) => (
            <div key={s.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="font-mono font-bold text-emerald-700">{s.code}</span>
                <span className="font-bold text-slate-900 ml-2">{s.title}</span>
                <span className="text-slate-500 text-[11px] block">{s.organization}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono text-slate-600">v{s.version}</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  {s.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
    </AdminDashboardWrapper>
  );
}
