'use client';

import { useCallback, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import {
  DollarSign,
  Receipt,
  TrendingUp,
  Calendar,
  Plus,
  RefreshCw,
} from 'lucide-react';

import Sidebar, { NavTab } from './Sidebar';
import StatCard from './StatCard';
import ExpenseForm from './ExpenseForm';
import ExpenseList from './ExpenseList';
import AIInsights from './AIInsights';
import { Expense, ExpenseInput, Insight } from '@/lib/types';

const CategoryPieChart = dynamic(() => import('./CategoryPieChart'), { ssr: false });
const SpendingLineChart = dynamic(() => import('./SpendingLineChart'), { ssr: false });

export default function Dashboard() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loadingExpenses, setLoadingExpenses] = useState(true);
  const [loadingInsights, setLoadingInsights] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');

  const fetchExpenses = useCallback(async () => {
    setLoadingExpenses(true);
    try {
      const res = await fetch('/api/expenses');
      const data: Expense[] = await res.json();
      setExpenses(data);
    } finally {
      setLoadingExpenses(false);
    }
  }, []);

  const fetchInsights = useCallback(async () => {
    setLoadingInsights(true);
    try {
      const res = await fetch('/api/insights');
      const data: Insight[] = await res.json();
      setInsights(data);
    } finally {
      setLoadingInsights(false);
    }
  }, []);

  useEffect(() => {
    fetchExpenses();
    fetchInsights();
  }, [fetchExpenses, fetchInsights]);

  const handleSave = async (data: ExpenseInput, id?: string) => {
    if (id) {
      await fetch(`/api/expenses/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
    } else {
      await fetch('/api/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
    }
    await fetchExpenses();
    await fetchInsights();
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/expenses/${id}`, { method: 'DELETE' });
    setExpenses((prev) => prev.filter((e) => e.id !== id));
    fetchInsights();
  };

  const openAdd = () => { setEditingExpense(null); setShowForm(true); };
  const openEdit = (expense: Expense) => { setEditingExpense(expense); setShowForm(true); };

  // ── Derived stats ─────────────────────────────────────────────
  const now = new Date();
  const thisMonth = (e: Expense) => {
    const d = new Date(e.date);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  };
  const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1);
  const lastMonth = (e: Expense) => {
    const d = new Date(e.date);
    return d.getMonth() === lastMonthDate.getMonth() && d.getFullYear() === lastMonthDate.getFullYear();
  };

  const thisMonthExpenses = expenses.filter(thisMonth);
  const lastMonthExpenses = expenses.filter(lastMonth);

  const totalThisMonth = thisMonthExpenses.reduce((s, e) => s + e.amount, 0);
  const totalLastMonth = lastMonthExpenses.reduce((s, e) => s + e.amount, 0);
  const monthTrend = totalLastMonth > 0
    ? ((totalThisMonth - totalLastMonth) / totalLastMonth) * 100
    : 0;

  const txCount = thisMonthExpenses.length;
  const daysThisMonth = now.getDate();
  const avgDaily = daysThisMonth > 0 ? totalThisMonth / daysThisMonth : 0;

  const categoryTotals: Record<string, number> = {};
  thisMonthExpenses.forEach((e) => {
    categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amount;
  });
  const topCat = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0];

  const monthLabel = now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div className="relative z-10 flex min-h-screen">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main content */}
      <main className="flex-1 md:ml-60 flex flex-col min-h-screen">
        <div className="flex-1 p-4 md:p-8 pt-16 md:pt-8 max-w-7xl w-full mx-auto">

          {/* Page header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-white">
                {activeTab === 'dashboard' && 'Overview'}
                {activeTab === 'expenses' && 'Expenses'}
                {activeTab === 'insights' && 'AI Insights'}
              </h1>
              <p className="text-slate-500 text-sm mt-0.5">{monthLabel}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => { fetchExpenses(); fetchInsights(); }}
                className="btn-ghost p-2.5"
                title="Refresh"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <button onClick={openAdd} className="btn-primary px-4 py-2.5 text-sm flex items-center gap-2">
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Add Expense</span>
              </button>
            </div>
          </div>

          {/* ── DASHBOARD ───────────────────────────────────────── */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6 animate-fade-in">
              {/* Stat cards */}
              {loadingExpenses ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="glass-card p-6 animate-pulse h-36">
                      <div className="w-12 h-12 rounded-xl bg-slate-700 mb-4" />
                      <div className="h-3 bg-slate-700 rounded w-1/2 mb-2" />
                      <div className="h-6 bg-slate-800 rounded w-3/4" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                  <StatCard
                    title="Total This Month"
                    value={`$${totalThisMonth.toFixed(2)}`}
                    trend={{ value: monthTrend, label: 'vs last month' }}
                    icon={<DollarSign className="w-6 h-6 text-violet-300" />}
                    accentClass="bg-violet-600/20 border border-violet-500/30"
                  />
                  <StatCard
                    title="Transactions"
                    value={String(txCount)}
                    subtitle={`${lastMonthExpenses.length} last month`}
                    icon={<Receipt className="w-6 h-6 text-blue-300" />}
                    accentClass="bg-blue-600/20 border border-blue-500/30"
                  />
                  <StatCard
                    title="Avg Daily Spend"
                    value={`$${avgDaily.toFixed(2)}`}
                    subtitle={`Over ${daysThisMonth} days`}
                    icon={<Calendar className="w-6 h-6 text-emerald-300" />}
                    accentClass="bg-emerald-600/20 border border-emerald-500/30"
                  />
                  <StatCard
                    title="Top Category"
                    value={topCat ? `$${topCat[1].toFixed(0)}` : '—'}
                    subtitle={topCat ? topCat[0].charAt(0).toUpperCase() + topCat[0].slice(1) : 'No data'}
                    icon={<TrendingUp className="w-6 h-6 text-amber-300" />}
                    accentClass="bg-amber-600/20 border border-amber-500/30"
                  />
                </div>
              )}

              {/* Charts row */}
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* Pie chart */}
                <div className="glass-card p-6 lg:col-span-2">
                  <h3 className="text-white font-semibold mb-1 text-sm">Spending by Category</h3>
                  <p className="text-slate-500 text-xs mb-5">This month</p>
                  <div className="h-56">
                    {!loadingExpenses && (
                      <CategoryPieChart expenses={thisMonthExpenses} />
                    )}
                  </div>
                </div>

                {/* Line chart */}
                <div className="glass-card p-6 lg:col-span-3">
                  <h3 className="text-white font-semibold mb-1 text-sm">Spending Over Time</h3>
                  <p className="text-slate-500 text-xs mb-5">Last 90 days · weekly</p>
                  <div className="h-56">
                    {!loadingExpenses && (
                      <SpendingLineChart expenses={expenses} />
                    )}
                  </div>
                </div>
              </div>

              {/* Recent expenses preview */}
              <div className="glass-card p-6">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h3 className="text-white font-semibold text-sm">Recent Expenses</h3>
                    <p className="text-slate-500 text-xs mt-0.5">Your last 5 transactions</p>
                  </div>
                  <button
                    onClick={() => setActiveTab('expenses')}
                    className="text-violet-400 hover:text-violet-300 text-xs font-medium transition-colors"
                  >
                    View all →
                  </button>
                </div>
                <ExpenseList
                  expenses={expenses.slice().sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5)}
                  onEdit={openEdit}
                  onDelete={handleDelete}
                  onAdd={openAdd}
                />
              </div>
            </div>
          )}

          {/* ── EXPENSES ────────────────────────────────────────── */}
          {activeTab === 'expenses' && (
            <div className="animate-fade-in">
              {loadingExpenses ? (
                <div className="glass-card p-12 text-center text-slate-500 text-sm animate-pulse">
                  Loading expenses…
                </div>
              ) : (
                <ExpenseList
                  expenses={expenses}
                  onEdit={openEdit}
                  onDelete={handleDelete}
                  onAdd={openAdd}
                />
              )}
            </div>
          )}

          {/* ── INSIGHTS ────────────────────────────────────────── */}
          {activeTab === 'insights' && (
            <div className="animate-fade-in">
              <AIInsights insights={insights} loading={loadingInsights} />
            </div>
          )}
        </div>
      </main>

      {/* Expense form modal */}
      {showForm && (
        <ExpenseForm
          editing={editingExpense}
          onClose={() => setShowForm(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
