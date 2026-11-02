'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  PlusCircle,
  ShieldCheck,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  Building2,
  AlertTriangle,
  Upload,
  Image as ImageIcon,
  X,
  Camera,
  Link2,
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { SRI_LANKA_DISTRICTS } from '@/lib/constants';

export default function NewMaterialPage() {
  const router = useRouter();
  const { user, role } = useAuth();
  const [submitting, setSubmitting] = useState(false);

  const [images, setImages] = useState<string[]>([]);
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);

  const [form, setForm] = useState({
    name: '',
    categorySlug: 'bricks',
    description: '',
    dimensions: '225 × 105 × 65 mm',
    quantity: 1000,
    unit: 'units',
    weightKg: 3.1,
    originBuilding: 'Commercial Plaza Demolition, Colombo 03',
    ageYears: 12,
    previousUse: 'Interior partition masonry',
    conditionGrade: 'GRADE_A',
    conditionNotes: 'All mortar cleaned, sorted onto pallets',
    pricePerUnit: 65,
    locationAddress: 'Peliyagoda Depot Bay 6',
    locationCity: 'Colombo',
  });

  const canSell = role === 'CONTRACTOR' || role === 'SELLER' || role === 'CONSTRUCTION_COMPANY' || role === 'ADMIN';

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      if (!file.type.startsWith('image/')) {
        alert('Please upload image files only (PNG, JPG, WebP).');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert(`File ${file.name} exceeds 5MB limit.`);
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImages((prev) => [...prev, event.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });

    // Reset input
    e.target.value = '';
  };

  const handleAddImageUrl = () => {
    if (!imageUrlInput.trim()) return;
    try {
      new URL(imageUrlInput.trim());
      setImages((prev) => [...prev, imageUrlInput.trim()]);
      setImageUrlInput('');
      setShowUrlInput(false);
    } catch (e) {
      alert('Please enter a valid image URL (e.g. https://images.unsplash.com/...)');
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSell) {
      alert(`Role restriction: Your account role (${role}) cannot list materials for sale. Please register as a Demolition Contractor or Salvager.`);
      return;
    }

    if (images.length === 0) {
      alert('Please upload at least one picture of the material. Accredited inspectors require photos to verify and audit the lot.');
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch('/api/materials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          images,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        alert('Material lot uploaded successfully! It has been submitted for inspector verification. Material ID: ' + data.materialId);
        router.push('/dashboard/seller');
      } else {
        alert(data.error || 'Failed to list material.');
      }
    } catch (err) {
      console.error(err);
      alert('Error listing material.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Role Restriction Banner if Not Seller */}
      {!canSell && (
        <div className="p-6 rounded-3xl bg-amber-50 border border-amber-300 shadow-md space-y-3">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-amber-900 text-sm">
                Role Permission Notice: Selling Restricted
              </h3>
              <p className="text-xs text-amber-800 mt-1 leading-relaxed">
                You are currently signed in as <strong>{user?.name || 'Guest'}</strong> with role{' '}
                <span className="font-mono font-bold bg-amber-200/80 px-1.5 py-0.5 rounded text-[11px]">
                  {role || 'GUEST'}
                </span>
                . In the circular platform workflow, listing salvaged stockpiles is restricted to{' '}
                <strong>Demolition Contractors</strong>, <strong>Material Salvagers</strong>, and{' '}
                <strong>Administrators</strong>.
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <Link
                  href="/auth/register"
                  className="px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white rounded-xl text-xs font-bold transition-colors"
                >
                  Register a Contractor Account
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Top Nav */}
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard/seller"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-emerald-700 bg-white px-3 py-1.5 rounded-xl border border-slate-200 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Contractor Hub</span>
        </Link>
        <span className="text-xs font-mono font-bold text-slate-400">Step 1 of 1: Lot Declaration &amp; Photo Audit</span>
      </div>

      {/* Header */}
      <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">
          Selective Salvage Intake
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
          Upload Recovered Construction Material
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Provide provenance details, geometric dimensions, and upload clear material photos. Uploaded materials
          are submitted directly to accredited inspectors for SLSI verification before marketplace purchase.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-8 text-xs">
        {/* Section 1: Pictures Upload (CRITICAL REQUIREMENT) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <Camera className="w-4 h-4 text-emerald-600" />
                <span>1. Material Photos (Required for Inspector Verification)</span>
              </h2>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Upload clear photos of the salvaged stockpile, edge details, and mortar removal. Auditors inspect these photos to award condition grades.
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              {images.length} {images.length === 1 ? 'Photo' : 'Photos'} Added
            </span>
          </div>

          {/* Upload Drop Zone & Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="border-2 border-dashed border-slate-300 hover:border-emerald-500 bg-slate-50 hover:bg-emerald-50/40 rounded-2xl p-6 text-center cursor-pointer transition-colors flex flex-col items-center justify-center gap-2 group">
              <input
                type="file"
                multiple
                accept="image/png, image/jpeg, image/webp"
                onChange={handleFileUpload}
                className="hidden"
              />
              <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-slate-600 group-hover:text-emerald-600 group-hover:scale-105 transition-all">
                <Upload className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-slate-800 text-xs block">Choose Photos from Device</span>
                <span className="text-[10px] text-slate-500">Supports PNG, JPG, WebP (Max 5MB per file)</span>
              </div>
            </label>

            <div className="border border-slate-200 rounded-2xl p-5 bg-white flex flex-col justify-between space-y-3">
              <div>
                <span className="font-bold text-slate-800 text-xs block">Or Add Image by URL</span>
                <p className="text-[10px] text-slate-500 mt-0.5">Paste a direct web link or Unsplash photo URL</p>
              </div>

              {showUrlInput ? (
                <div className="space-y-2">
                  <input
                    type="url"
                    value={imageUrlInput}
                    onChange={(e) => setImageUrlInput(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-xl text-xs"
                  />
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleAddImageUrl}
                      className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-[11px]"
                    >
                      Add Photo
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowUrlInput(false)}
                      className="px-3 py-1 border border-slate-300 text-slate-600 rounded-lg text-[11px]"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowUrlInput(true)}
                  className="w-full py-2.5 px-3 border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Link2 className="w-4 h-4 text-slate-500" />
                  <span>Enter Image URL</span>
                </button>
              )}
            </div>
          </div>

          {/* Uploaded Photos Thumbnails Preview */}
          {images.length > 0 && (
            <div className="space-y-2 pt-2">
              <span className="font-bold text-slate-700 text-xs block">Uploaded Lot Photos ({images.length}):</span>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                {images.map((img, idx) => (
                  <div
                    key={idx}
                    className="relative group rounded-xl overflow-hidden border-2 border-slate-200 bg-slate-100 aspect-square shadow-sm"
                  >
                    <img src={img} alt={`Upload ${idx + 1}`} className="w-full h-full object-cover" />
                    {idx === 0 && (
                      <span className="absolute top-1.5 left-1.5 bg-emerald-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow">
                        Primary
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-slate-900/80 hover:bg-rose-600 text-white flex items-center justify-center transition-colors shadow"
                      title="Remove image"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Section 2: Basic Information */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-2">
            2. Material Classification &amp; Identity
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 mb-1">Material Name / Title:</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Reclaimed Wire-Cut Clay Bricks (Palletized)"
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-emerald-500 font-semibold"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Category Stream:</label>
              <select
                value={form.categorySlug}
                onChange={(e) => setForm({ ...form, categorySlug: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white text-slate-900 font-semibold"
              >
                <option value="bricks">Bricks &amp; Masonry</option>
                <option value="structural-steel">Structural Steel Sections</option>
                <option value="timber">Timber &amp; Hardwood</option>
                <option value="concrete-blocks">Concrete Blocks &amp; Precast</option>
                <option value="doors-windows">Doors &amp; Windows</option>
                <option value="tiles-ceramics">Tiles &amp; Ceramics</option>
                <option value="roofing">Roofing Materials</option>
                <option value="sanitary-fixtures">Sanitary Fixtures</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Declared Salvage Grade (Subject to Audit):</label>
              <select
                value={form.conditionGrade}
                onChange={(e) => setForm({ ...form, conditionGrade: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white text-slate-900 font-semibold"
              >
                <option value="GRADE_A">Grade A (Direct Structural Reuse)</option>
                <option value="GRADE_B">Grade B (Reusable with Minor Prep)</option>
                <option value="GRADE_C">Grade C (Non-Structural / Secondary)</option>
                <option value="GRADE_D">Grade D (Recycling / Reprocessing)</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 mb-1">Technical Description:</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Describe extraction method, surface state, mortar cleaning, pallet storage..."
                rows={3}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-slate-900"
                required
              />
            </div>
          </div>
        </div>

        {/* Section 3: Quantities & Dimensions */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-2">
            3. Dimensions &amp; Stockpile Quantities
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Dimensions (L x W x H):</label>
              <input
                type="text"
                value={form.dimensions}
                onChange={(e) => setForm({ ...form, dimensions: e.target.value })}
                placeholder="e.g. 225 x 105 x 65 mm"
                className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Available Quantity:</label>
              <input
                type="number"
                min={1}
                value={form.quantity}
                onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl font-bold"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Unit of Measurement:</label>
              <select
                value={form.unit}
                onChange={(e) => setForm({ ...form, unit: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white"
              >
                <option value="units">Units / Pieces</option>
                <option value="beams">Beams</option>
                <option value="blocks">Blocks</option>
                <option value="sets">Sets</option>
                <option value="m²">Square Meters (m²)</option>
                <option value="tonnes">Metric Tonnes</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 4: Provenance & Deconstruction Site */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-2">
            4. Origin Provenance &amp; Current Depot
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Source Building / Demolition Site:</label>
              <input
                type="text"
                value={form.originBuilding}
                onChange={(e) => setForm({ ...form, originBuilding: e.target.value })}
                placeholder="e.g. York Street Mercantile Bank, Colombo 01"
                className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Estimated Age (Years):</label>
              <input
                type="number"
                value={form.ageYears}
                onChange={(e) => setForm({ ...form, ageYears: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Current Depot Storage Address:</label>
              <input
                type="text"
                value={form.locationAddress}
                onChange={(e) => setForm({ ...form, locationAddress: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">District:</label>
              <select
                value={form.locationCity}
                onChange={(e) => setForm({ ...form, locationCity: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white"
              >
                {SRI_LANKA_DISTRICTS.map((district) => (
                  <option key={district} value={district}>{district}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Section 5: Commercial Pricing */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-2">
            5. Commercial Pricing
          </h2>

          <div className="max-w-xs">
            <label className="block font-bold text-slate-700 mb-1">Unit Price (LKR per {form.unit}):</label>
            <div className="relative">
              <input
                type="number"
                min={1}
                value={form.pricePerUnit}
                onChange={(e) => setForm({ ...form, pricePerUnit: Number(e.target.value) })}
                className="w-full pl-8 pr-3 py-2 border border-slate-300 rounded-xl font-black text-slate-900 text-sm"
                required
              />
              <span className="absolute left-3 top-2.5 font-bold text-slate-400">Rs</span>
            </div>
          </div>
        </div>

        {/* Verification Guarantee Notice */}
        <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-300 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-bold text-slate-900 text-xs">
              Automated Submission to National Materials Inspector Queue
            </h4>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Upon publication, this lot and its uploaded photos will enter the inspection queue. An accredited materials
              auditor will evaluate the lot against SLSI/ISO standards and verify geometric tolerance. Buyers will be able
              to purchase once the material batch is verified; passport records are handled separately when applicable.
            </p>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
          <Link
            href="/dashboard/seller"
            className="px-5 py-2.5 border border-slate-300 text-slate-700 rounded-xl font-bold hover:bg-slate-50 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-md transition-colors flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            <span>{submitting ? 'Uploading Photos & Lot...' : 'Upload Material for Verification'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
