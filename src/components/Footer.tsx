import React from 'react';
import Link from 'next/link';
import { Recycle, ShieldCheck, MapPin, Scale, HeartHandshake } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Column 1: Brand & Circular Mission */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white">
                <Recycle className="w-5 h-5" />
              </div>
              <span className="text-xl font-black text-white tracking-tight">
                ReMat<span className="text-emerald-500">X</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              The digital infrastructure for the circular construction economy. Connecting demolition salvagers,
              contractors, architects, and inspectors to recover, verify, trade, and reuse building materials with
              verifiable Digital Material Passports.
            </p>
            <div className="flex items-center gap-3 text-xs text-slate-400">
              <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold">
                <ShieldCheck className="w-4 h-4" /> Traceability Engine
              </span>
              <span>•</span>
              <span className="inline-flex items-center gap-1">
                <MapPin className="w-4 h-4 text-slate-400" /> Sri Lanka Regional Hub
              </span>
            </div>
          </div>

          {/* Column 2: Material Categories */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-4">Material Streams</h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li><Link href="/marketplace?category=bricks" className="hover:text-emerald-400 transition-colors">Reclaimed Bricks &amp; Masonry</Link></li>
              <li><Link href="/marketplace?category=structural-steel" className="hover:text-emerald-400 transition-colors">Structural Steel Sections</Link></li>
              <li><Link href="/marketplace?category=timber" className="hover:text-emerald-400 transition-colors">Salvaged Hardwood &amp; Teak</Link></li>
              <li><Link href="/marketplace?category=concrete-blocks" className="hover:text-emerald-400 transition-colors">Concrete Blocks &amp; Precast</Link></li>
              <li><Link href="/marketplace?category=doors-windows" className="hover:text-emerald-400 transition-colors">Architectural Doors &amp; Windows</Link></li>
              <li><Link href="/marketplace?category=tiles-ceramics" className="hover:text-emerald-400 transition-colors">Terracotta &amp; Ceramic Tiles</Link></li>
            </ul>
          </div>

          {/* Column 3: Platform & Verification */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-4">Verification &amp; Passports</h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li><Link href="/standards" className="hover:text-emerald-400 transition-colors">SLSI / ISO Standards Registry</Link></li>
              <li><Link href="/passports/RM-2026-000145" className="hover:text-emerald-400 transition-colors">Sample Digital Material Passport</Link></li>
              <li><Link href="/how-it-works" className="hover:text-emerald-400 transition-colors">Inspection &amp; Testing Flow</Link></li>
              <li><Link href="/dashboard/inspector" className="hover:text-emerald-400 transition-colors">Auditor &amp; Inspector Hub</Link></li>
              <li><Link href="/about" className="hover:text-emerald-400 transition-colors">Circularity &amp; Carbon Accounting</Link></li>
            </ul>
          </div>

          {/* Column 4: Role Dashboards */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-4">Portals</h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li><Link href="/dashboard/seller" className="hover:text-emerald-400 transition-colors">Demolition Contractor Hub</Link></li>
              <li><Link href="/dashboard/buyer" className="hover:text-emerald-400 transition-colors">Buyer &amp; Architect Portal</Link></li>
              <li><Link href="/dashboard/inspector" className="hover:text-emerald-400 transition-colors">Inspection Desk</Link></li>
              <li><Link href="/dashboard/admin" className="hover:text-emerald-400 transition-colors">Admin Governance</Link></li>
              <li><Link href="/orders" className="hover:text-emerald-400 transition-colors">Escrow &amp; Logistics Tracking</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 rounded-2xl bg-slate-950/60 border border-slate-800 px-6 py-7 text-center">
          <Scale className="w-6 h-6 text-amber-500 mx-auto mb-3" />
          <span className="text-slate-100 font-bold text-xs sm:text-sm block">
            GROUP PROJECT :4 — Sri Lanka Circular Construction Framework (ReMatX)
          </span>
          <p className="text-slate-400 text-xs mt-2">Members are</p>
          <div className="max-w-2xl mx-auto mt-4 grid grid-cols-1 sm:grid-cols-3 gap-x-8 gap-y-3 text-[11px] font-mono text-slate-300">
            <span>2022/ASB/45</span>
            <span>2022/ASB/50</span>
            <span>2022/ASB/29</span>
            <span>2022/ASB/22</span>
            <span>2022/ASB/66</span>
            <span>2022/ASB/65</span>
            <span>2022/ASB/20</span>
            <span>2022/ASB/15</span>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>&copy; {new Date().getFullYear()} ReMatX — Reusable Construction Materials Platform. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-slate-400">Privacy &amp; Data Protection</Link>
            <Link href="/terms" className="hover:text-slate-400">Terms of Marketplace</Link>
            <Link href="/standards" className="hover:text-slate-400">Standards Compliance</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
