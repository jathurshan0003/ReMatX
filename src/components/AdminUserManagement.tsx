'use client';

import React, { useState } from 'react';
import { CheckCircle2, Trash2, UserPlus, Users } from 'lucide-react';

type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  isVerified: boolean;
  company?: { name: string } | null;
  avatarUrl?: string | null;
};

const roles = ['BUYER', 'SELLER', 'CONTRACTOR', 'CONSTRUCTION_COMPANY', 'ARCHITECT', 'ENGINEER', 'INSPECTOR', 'ADMIN'];

export function AdminUserManagement({ initialUsers }: { initialUsers: AdminUser[] }) {
  const [users, setUsers] = useState(initialUsers);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'BUYER' });
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const addUser = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setSaving(true);
    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Could not create user.');
      setUsers((current) => [data.user, ...current]);
      setForm({ name: '', email: '', password: '', role: 'BUYER' });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const removeUser = async (user: AdminUser) => {
    if (!window.confirm(`Remove ${user.name} and their platform records?`)) return;
    setError(null);
    const response = await fetch('/api/admin/users', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user.id }),
    });
    const data = await response.json();
    if (!response.ok) {
      setError(data.error || 'Could not remove user.');
      return;
    }
    setUsers((current) => current.filter((item) => item.id !== user.id));
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
      <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
        <Users className="w-5 h-5 text-emerald-600" />
        <h2 className="text-lg font-bold text-slate-900">User Access Management</h2>
        <span className="ml-auto text-xs font-bold text-slate-500">{users.length} Users</span>
      </div>

      <form onSubmit={addUser} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
        <input required placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="px-3 py-2 border border-slate-300 rounded-xl text-slate-900" />
        <input required type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="px-3 py-2 border border-slate-300 rounded-xl text-slate-900" />
        <input required minLength={12} type="password" placeholder="Password (12+ chars)" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="px-3 py-2 border border-slate-300 rounded-xl text-slate-900" />
        <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="px-3 py-2 border border-slate-300 rounded-xl bg-white text-slate-900">
          {roles.map((role) => <option key={role} value={role}>{role}</option>)}
        </select>
        <button disabled={saving} className="inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold disabled:opacity-50">
          <UserPlus className="w-4 h-4" /> {saving ? 'Adding...' : 'Add User'}
        </button>
      </form>

      {error && <p className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold">{error}</p>}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-xs">
          <thead><tr className="bg-slate-50 text-slate-700 text-left font-bold"><th className="py-2.5 px-3">Name</th><th className="py-2.5 px-3">Email</th><th className="py-2.5 px-3">Role</th><th className="py-2.5 px-3">Company</th><th className="py-2.5 px-3 text-center">Action</th></tr></thead>
          <tbody className="divide-y divide-slate-100">
            {users.map((user) => <tr key={user.id} className="hover:bg-slate-50/60">
              <td className="py-2.5 px-3 font-bold text-slate-900">{user.name}</td>
              <td className="py-2.5 px-3 font-mono text-slate-600">{user.email}</td>
              <td className="py-2.5 px-3"><span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-800">{user.role}</span></td>
              <td className="py-2.5 px-3 text-slate-600">{user.company?.name || 'Independent / Individual'}</td>
              <td className="py-2.5 px-3 text-center"><button onClick={() => removeUser(user)} className="inline-flex items-center gap-1 text-rose-700 hover:text-rose-900 font-bold"><Trash2 className="w-3.5 h-3.5" /> Remove</button></td>
            </tr>)}
          </tbody>
        </table>
      </div>
    </div>
  );
}