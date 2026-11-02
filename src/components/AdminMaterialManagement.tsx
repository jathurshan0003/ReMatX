'use client';

import React, { useState } from 'react';
import { Layers, Trash2 } from 'lucide-react';

type AdminMaterial = {
  id: string;
  materialId: string;
  name: string;
  status: string;
  quantity: number;
  unit: string;
  category: { name: string };
};

export function AdminMaterialManagement({ initialMaterials }: { initialMaterials: AdminMaterial[] }) {
  const [materials, setMaterials] = useState(initialMaterials);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const removeMaterial = async (material: AdminMaterial) => {
    if (!window.confirm(`Remove ${material.name} and all related listings, offers, and orders?`)) return;
    setError(null);
    setDeletingId(material.id);

    try {
      const response = await fetch('/api/admin/materials', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ materialId: material.id }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Could not remove material.');
      setMaterials((current) => current.filter((item) => item.id !== material.id));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
      <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
        <Layers className="w-5 h-5 text-emerald-600" />
        <h2 className="text-lg font-bold text-slate-900">Material Management</h2>
        <span className="ml-auto text-xs font-bold text-slate-500">{materials.length} Lots</span>
      </div>

      {error && <p className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold">{error}</p>}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-xs">
          <thead><tr className="bg-slate-50 text-slate-700 text-left font-bold"><th className="py-2.5 px-3">Lot</th><th className="py-2.5 px-3">Material</th><th className="py-2.5 px-3">Category</th><th className="py-2.5 px-3">Quantity</th><th className="py-2.5 px-3">Status</th><th className="py-2.5 px-3 text-right">Action</th></tr></thead>
          <tbody className="divide-y divide-slate-100">
            {materials.map((material) => <tr key={material.id} className="hover:bg-slate-50/60">
              <td className="py-2.5 px-3 font-mono font-bold text-slate-700">{material.materialId}</td>
              <td className="py-2.5 px-3 font-bold text-slate-900">{material.name}</td>
              <td className="py-2.5 px-3 text-slate-600">{material.category.name}</td>
              <td className="py-2.5 px-3 text-slate-600">{material.quantity.toLocaleString()} {material.unit}</td>
              <td className="py-2.5 px-3"><span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-800">{material.status}</span></td>
              <td className="py-2.5 px-3 text-right"><button disabled={deletingId === material.id} onClick={() => removeMaterial(material)} className="inline-flex items-center gap-1 text-rose-700 hover:text-rose-900 font-bold disabled:opacity-50"><Trash2 className="w-3.5 h-3.5" /> {deletingId === material.id ? 'Removing...' : 'Remove'}</button></td>
            </tr>)}
          </tbody>
        </table>
      </div>
    </div>
  );
}