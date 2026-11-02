import React from 'react';
import { Recycle, ShieldCheck, Scale, Leaf, Building2, Layers, Award, HeartHandshake } from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3.5 py-1 rounded-full border border-emerald-200">
          Platform Mission &amp; Governance
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900">
          About the ReMatX Circular Infrastructure
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          ReMatX is a specialized circular construction marketplace engineering the transition from extractive linear
          demolition to verifiable, standards-based component reuse.
        </p>
      </div>

      {/* Problems We Solve Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold">
            <Layers className="w-5 h-5 text-emerald-400" />
          </div>
          <h3 className="font-bold text-slate-900 text-base">Material Discovery &amp; Comparability</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Construction components are scattered across demolition sites with zero structured data. ReMatX
            centralizes reclaimed inventories with geometric dimensions, age, and source building provenance.
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
          </div>
          <h3 className="font-bold text-slate-900 text-base">Trustworthy Condition &amp; SLSI Audits</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Buyers fear latent damage or weakness. ReMatX introduces non-destructive testing (ultrasonic, compressive,
            and moisture) against official SLSI/ISO standards to establish reliable condition grades.
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold">
            <Leaf className="w-5 h-5 text-emerald-400" />
          </div>
          <h3 className="font-bold text-slate-900 text-base">Verifiable Carbon Accounting</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Every transaction quantifies embodied greenhouse gas emissions avoided ($CO_2e$) and demolition mass
            diverted from landfills, directly crediting LEED and GreenSL sustainable certification frameworks.
          </p>
        </div>
      </div>

      {/* Business Model Section (Section 21) */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-10 border border-slate-800 space-y-6">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-bold">
            Section 21: Circular Economic Model
          </span>
          <h2 className="text-2xl font-black text-white mt-1">Platform Business Model</h2>
          <p className="text-xs text-slate-400 mt-1">
            Built to sustain long-term operations while aligning financial incentives with landfill diversion.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700">
            <span className="font-bold text-emerald-400 block text-sm">Escrow Transaction Fee</span>
            <p className="text-slate-400 mt-1">
              Low percentage fee on completed marketplace trades to cover escrow banking and dispute protection.
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700">
            <span className="font-bold text-emerald-400 block text-sm">Audit &amp; Inspection Fees</span>
            <p className="text-slate-400 mt-1">
              Accredited inspection and laboratory testing charges for testing core structural lots and issuing
              passports.
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700">
            <span className="font-bold text-emerald-400 block text-sm">Logistics Commission</span>
            <p className="text-slate-400 mt-1">
              Shared commission with local haulage fleets offering crane offloading to jobsites.
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700">
            <span className="font-bold text-emerald-400 block text-sm">Enterprise BIM / ERP API</span>
            <p className="text-slate-400 mt-1">
              Direct API integrations for large architectural studios to import material passport BIM objects.
            </p>
          </div>
        </div>
      </div>

      {/* Technical and Statutory Notice (Section 22) */}
      <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 flex items-start gap-4">
        <Scale className="w-8 h-8 text-amber-600 shrink-0 mt-1" />
        <div className="space-y-2 text-xs text-slate-600 leading-relaxed">
          <h3 className="font-bold text-slate-900 text-sm">
            Section 22: Statutory &amp; Engineering Regulatory Compliance Notice
          </h3>
          <p>
            The platform-level grading scheme (Grade A, B, C, D, R) helps commercial buyers compare materials, but is
            never a substitute for formal engineering analysis. Structural reuse decisions in load-bearing
            installations must comply with Sri Lanka building regulations (UDA, ICTAD/CIDA) and require individual
            project structural engineering review.
          </p>
          <p>
            All standard specifications stored in the ReMatX Standards Engine reference recognized national and
            international standards organizations (SLSI, ISO, CEN) and preserve historical versioning.
          </p>
        </div>
      </div>
    </div>
  );
}
