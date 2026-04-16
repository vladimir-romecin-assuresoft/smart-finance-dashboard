'use client';

import {
  LayoutDashboard,
  Receipt,
  Lightbulb,
  Wallet,
  Menu,
  X,
} from 'lucide-react';
import { useState } from 'react';

export type NavTab = 'dashboard' | 'expenses' | 'insights';

interface SidebarProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
}

const navItems: { id: NavTab; label: string; icon: React.ReactNode }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
  { id: 'expenses', label: 'Expenses', icon: <Receipt className="w-5 h-5" /> },
  { id: 'insights', label: 'AI Insights', icon: <Lightbulb className="w-5 h-5" /> },
];

export default function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const NavContent = () => (
    <>
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-2 mb-8">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center shadow-lg shadow-violet-500/30">
          <Wallet className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="text-white font-bold text-sm leading-tight">Smart Finance</p>
          <p className="text-slate-500 text-xs">Dashboard</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-1">
        <p className="text-slate-600 text-[10px] font-semibold uppercase tracking-widest px-4 mb-2">
          Navigation
        </p>
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => { onTabChange(item.id); setMobileOpen(false); }}
            className={`nav-item w-full text-left ${activeTab === item.id ? 'nav-item-active' : ''}`}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div className="mt-auto pt-6 border-t border-slate-800">
        <div className="flex items-center gap-3 px-4 py-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-xs font-bold text-white">
            U
          </div>
          <div>
            <p className="text-white text-sm font-medium">My Account</p>
            <p className="text-slate-500 text-xs">Personal Budget</p>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 bottom-0 w-60 flex-col p-4 z-20 border-r border-slate-800/60 bg-slate-950/60 backdrop-blur-xl">
        <NavContent />
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-30 flex items-center justify-between px-4 py-3 border-b border-slate-800/60 bg-slate-950/80 backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center">
            <Wallet className="w-4 h-4 text-white" />
          </div>
          <span className="text-white font-bold text-sm">Smart Finance</span>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="text-slate-400 hover:text-white transition-colors"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-20">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-64 flex flex-col p-4 pt-16 bg-slate-950/95 backdrop-blur-xl border-r border-slate-800/60 animate-slide-up">
            <NavContent />
          </aside>
        </div>
      )}
    </>
  );
}
