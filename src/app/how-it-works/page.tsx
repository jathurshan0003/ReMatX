import React from 'react';
import {
  Building2,
  FileCheck,
  ShieldCheck,
  QrCode,
  ShoppingBag,
  Truck,
  Building,
  RotateCcw,
  Scale,
  CheckCircle2,
  ArrowDown,
  Layers,
} from 'lucide-react';
import Link from 'next/link';

export default function HowItWorksPage() {
  const steps = [
    {
      num: '01',
      title: 'Building Audit & Selective Salvage',
      actor: 'Demolition Contractor / Asset Owner',
      desc: 'Before structural demolition, qualified contractors audit recoverable architectural and structural elements. Components are dismantled without hydraulic shearing or torch-cutting.',
      icon: Building2,
      tag: 'Deconstruction',
    },
    {
      num: '02',
      title: 'Technical Inspection & Lab / Field Testing',
      actor: 'Accredited Materials Auditor / Engineer',
      desc: 'Visual examination and non-destructive testing (ultrasonic thickness, moisture resistance, compressive cores) are conducted according to category-specific SLSI/ISO standards.',
      icon: FileCheck,
      tag: 'Verification',
    },
    {
      num: '03',
      title: 'Grading & Batch Verification',
      actor: 'ReMatX Automated Engine',
      desc: 'The material batch is assigned a standardized marketplace condition grade (Grade A–D or R) and its inspection results are recorded. Passport records are handled separately when applicable.',
      icon: QrCode,
      tag: 'Traceability',
    },
    {
      num: '04',
      title: 'Marketplace Publication & Discovery',
      actor: 'Buyers, Contractors, Architects & Specifiers',
      desc: 'Listings are published with full dimensions, test sheets, and a selected Sri Lankan district. Buyers can Buy Now, submit formal offers, or request project-specific quotations.',
      icon: ShoppingBag,
      tag: 'Commerce',
    },
    {
      num: '05',
      title: 'Escrow Payment & Circular Haulage',
      actor: 'ReMatX Escrow & Logistics Providers',
      desc: 'Buyer funds are locked safely in escrow. Logistics haulage is dispatched with crane offloading to the new construction site. Funds release only after onsite delivery verification.',
      icon: Truck,
      tag: 'Fulfillment',
    },
    {
      num: '06',
      title: 'Incorporation into New Building & Future Traceability',
      actor: 'Project Architect & Structural Engineer',
      desc: 'The passport record is updated with the new building coordinates and owner custody, ensuring the component can be traced and reclaimed again at the end of the next building cycle.',
      icon: RotateCcw,
      tag: 'Circular Future',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3.5 py-1 rounded-full border border-emerald-200">
          Operational Architecture
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900">
          How ReMatX Enables Circular Construction
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          From deconstruction site audit to the next building facade: a transparent 6-step lifecycle
          connecting salvagers, auditors, architects, and buyers.
        </p>
      </div>

      {/* Step by Step Timeline Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <div
              key={idx}
              className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm flex flex-col justify-between hover:border-emerald-300 hover:shadow-lg transition-all"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-2xl font-black text-emerald-600">{step.num}</span>
                  <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
                    {step.tag}
                  </span>
                </div>

                <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center">
                  <Icon className="w-6 h-6 text-emerald-400" />
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-900">{step.title}</h3>
                  <p className="text-xs font-semibold text-emerald-700 mt-1">Lead: {step.actor}</p>
                  <p className="text-xs text-slate-600 mt-2.5 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Material Lifecycle State Machine (Section 13) */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-10 border border-slate-800 space-y-6">
        <div className="max-w-2xl">
          <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-bold">
            Section 13: Material State Machine
          </span>
          <h2 className="text-2xl font-black text-white mt-1">Immutable Lifecycle States</h2>
          <p className="text-xs text-slate-400 mt-1">
            Every material record advances through strictly verified transitions to ensure legal and
            structural traceability.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 text-center text-xs">
          {[
            { label: 'DRAFT', desc: 'Listing created' },
            { label: 'SUBMITTED', desc: 'Audit requested' },
            { label: 'UNDER_REVIEW', desc: 'Testing in progress' },
            { label: 'VERIFIED', desc: 'Batch approved' },
            { label: 'AVAILABLE', desc: 'Live on market' },
            { label: 'RESERVED', desc: 'Offer / Escrow locked' },
            { label: 'SOLD', desc: 'Payment completed' },
            { label: 'REUSED', desc: 'Installed in new bldg' },
          ].map((st, i) => (
            <div key={i} className="p-3 bg-slate-800/80 rounded-xl border border-slate-700 flex flex-col justify-between">
              <span className="font-mono font-bold text-emerald-400 text-[11px]">{st.label}</span>
              <span className="text-[10px] text-slate-400 mt-1">{st.desc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Box */}
      <div className="bg-emerald-600 text-white rounded-3xl p-8 sm:p-12 text-center space-y-4">
        <h2 className="text-2xl sm:text-3xl font-black">Ready to Participate in Circular Construction?</h2>
        <p className="text-xs sm:text-sm text-emerald-100 max-w-xl mx-auto">
          Start sourcing high-grade recovered materials or list materials from your upcoming deconstruction project.
        </p>
        <div className="flex flex-wrap justify-center gap-4 pt-2">
          <Link
            href="/marketplace"
            className="px-6 py-3 rounded-2xl bg-slate-950 hover:bg-slate-900 text-white font-bold text-xs transition-colors"
          >
            Explore Materials Catalog
          </Link>
          <Link
            href="/dashboard/seller/new"
            className="px-6 py-3 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs transition-colors"
          >
            Submit Material for Audit
          </Link>
        </div>
      </div>
    </div>
  );
}
