'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Recycle,
  ShoppingBag,
  ShieldCheck,
  FileText,
  PlusCircle,
  Menu,
  X,
  LogIn,
  LogOut,
  User,
  LayoutDashboard,
  FileCheck,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, logout, getRoleDashboard } = useAuth();

  const navLinks = [
    { name: 'Marketplace', href: '/marketplace', icon: ShoppingBag },
    { name: 'Standards Engine', href: '/standards', icon: ShieldCheck },
    { name: 'How It Works', href: '/how-it-works', icon: FileText },
    { name: 'Orders & Escrow', href: '/orders', icon: ShoppingBag },
  ];

  const isActive = (href: string) => pathname === href || pathname?.startsWith(href + '/');

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200">
      {/* Top Banner: Circular Economy Status */}
      <div className="bg-slate-900 text-slate-200 px-4 py-1.5 text-xs font-medium flex items-center justify-between">
        <div className="flex items-center gap-2 max-w-7xl mx-auto w-full">
          <span className="flex h-2 w-2 rounded-full bg-emerald-400"></span>
          {/* <span className="text-emerald-400 font-bold tracking-wide uppercase text-[10px]">
            Circular Construction Framework
          </span> */}
          <span className="hidden md:inline text-slate-400">Group project :4</span>
          {/* <span className="hidden md:inline text-slate-300">
            SLSI &amp; ISO Technical Verification Standards Active (2026.1)
          </span> */}
          <span className="ml-auto flex items-center gap-3 text-slate-400">
            {/* <span className="text-emerald-400 font-semibold">10,480 kg CO₂e</span> Saved to Date */}
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-600/20 group-hover:bg-emerald-700 transition-colors">
              <Recycle className="w-5 h-5 transition-transform group-hover:rotate-90 duration-3000" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-black tracking-tight text-slate-900">
                  ReMat<span className="text-emerald-600">X</span>
                </span>
                {/* <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded border border-slate-200">
                  v1.0 MVP
                </span> */}
              </div>
              <p className="text-[10px] text-slate-500 font-medium tracking-tight -mt-0.5">
                Circular Materials Platform
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 text-sm font-semibold">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.href);
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors ${
                    active
                      ? 'bg-emerald-50 text-emerald-700 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-emerald-600' : 'text-slate-400'}`} />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Action and user controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Dynamic Role Action Button */}
            {user?.role === 'INSPECTOR' || user?.role === 'ENGINEER' ? (
              <Link
                href="/dashboard/inspector"
                className="hidden lg:flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 rounded-xl text-xs font-bold shadow-sm transition-colors"
              >
                <FileCheck className="w-4 h-4" />
                <span>Audit Desk</span>
              </Link>
            ) : user?.role === 'CONTRACTOR' || user?.role === 'SELLER' || user?.role === 'ADMIN' ? (
              <Link
                href="/dashboard/seller/new"
                className="hidden lg:flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 rounded-xl text-xs font-bold shadow-sm transition-colors"
              >
                <PlusCircle className="w-4 h-4" />
                <span>List Material</span>
              </Link>
            ) : (
              <Link
                href="/marketplace"
                className="hidden lg:flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white px-3.5 py-2 rounded-xl text-xs font-bold shadow-sm transition-colors"
              >
                <ShoppingBag className="w-4 h-4 text-emerald-400" />
                <span>Browse Materials</span>
              </Link>
            )}

            {/* Dashboard Link if Logged In */}
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black font-mono uppercase bg-emerald-100 text-emerald-800 border border-emerald-200">
                  {user?.role}
                </span>
                <Link
                  href={getRoleDashboard()}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs font-bold transition-colors"
                  title="Open My Role Dashboard"
                >
                  <LayoutDashboard className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="hidden sm:inline">Dashboard</span>
                </Link>

                <button
                  onClick={() => logout()}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/auth/login"
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 hover:text-emerald-700 hover:bg-slate-100 transition-colors"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </Link>
                <Link
                  href="/auth/register"
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white transition-colors"
                >
                  Register
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-4 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-100"
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
            {isAuthenticated ? (
              <Link
                href={getRoleDashboard()}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-1.5 bg-emerald-600 text-white py-2 rounded-xl text-xs font-bold"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>My Role Dashboard ({user?.role})</span>
              </Link>
            ) : (
              <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
                <Link
                  href="/auth/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center p-2 rounded-lg bg-slate-100 text-slate-700"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center p-2 rounded-lg bg-emerald-600 text-white"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
