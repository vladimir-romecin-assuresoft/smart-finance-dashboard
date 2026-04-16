'use client';

import { useState } from 'react';
import { Pencil, Trash2, Plus, Search } from 'lucide-react';
import { Expense, CATEGORY_COLORS, CATEGORY_LABELS, CATEGORY_EMOJIS } from '@/lib/types';

interface ExpenseListProps {
  expenses: Expense[];
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
}

export default function ExpenseList({ expenses, onEdit, onDelete, onAdd }: ExpenseListProps) {
  const [search, setSearch] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [filterCat, setFilterCat] = useState('all');

  const sorted = [...expenses].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const filtered = sorted.filter((e) => {
    const matchSearch =
      e.description.toLowerCase().includes(search.toLowerCase()) ||
      CATEGORY_LABELS[e.category].toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCat === 'all' || e.category === filterCat;
    return matchSearch && matchCat;
  });

  const uniqueCategories = [...new Set(expenses.map((e) => e.category))];

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    await onDelete(id);
    setDeletingId(null);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search expenses…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="glass-input w-full pl-9 pr-4 py-2.5 text-sm"
          />
        </div>
        <select
          value={filterCat}
          onChange={(e) => setFilterCat(e.target.value)}
          className="glass-input px-4 py-2.5 text-sm text-slate-300 cursor-pointer"
        >
          <option value="all">All Categories</option>
          {uniqueCategories.map((cat) => (
            <option key={cat} value={cat}>
              {CATEGORY_EMOJIS[cat]} {CATEGORY_LABELS[cat]}
            </option>
          ))}
        </select>
        <button onClick={onAdd} className="btn-primary px-4 py-2.5 text-sm flex items-center gap-2 whitespace-nowrap">
          <Plus className="w-4 h-4" />
          Add Expense
        </button>
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <p className="text-slate-500 text-sm">
            {expenses.length === 0 ? 'No expenses yet. Add your first one!' : 'No results match your search.'}
          </p>
          {expenses.length === 0 && (
            <button onClick={onAdd} className="btn-primary mt-4 px-5 py-2.5 text-sm inline-flex items-center gap-2">
              <Plus className="w-4 h-4" /> Add Expense
            </button>
          )}
        </div>
      ) : (
        <div className="glass-card overflow-hidden">
          {/* Desktop table */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700/50">
                  <th className="text-left text-slate-500 font-medium px-5 py-3 text-xs uppercase tracking-wider">Date</th>
                  <th className="text-left text-slate-500 font-medium px-5 py-3 text-xs uppercase tracking-wider">Description</th>
                  <th className="text-left text-slate-500 font-medium px-5 py-3 text-xs uppercase tracking-wider">Category</th>
                  <th className="text-right text-slate-500 font-medium px-5 py-3 text-xs uppercase tracking-wider">Amount</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filtered.map((expense) => {
                  const color = CATEGORY_COLORS[expense.category] ?? '#94a3b8';
                  return (
                    <tr key={expense.id} className="hover:bg-white/3 transition-colors group">
                      <td className="px-5 py-3.5 text-slate-400 text-xs whitespace-nowrap">
                        {formatDate(expense.date)}
                      </td>
                      <td className="px-5 py-3.5 text-white font-medium">{expense.description}</td>
                      <td className="px-5 py-3.5">
                        <span
                          className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium border"
                          style={{
                            backgroundColor: color + '22',
                            borderColor: color + '44',
                            color: color,
                          }}
                        >
                          {CATEGORY_EMOJIS[expense.category]}
                          {CATEGORY_LABELS[expense.category]}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right text-white font-semibold">
                        ${expense.amount.toFixed(2)}
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => onEdit(expense)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-blue-400 hover:bg-blue-400/10 transition-colors"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(expense.id)}
                            disabled={deletingId === expense.id}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-400/10 transition-colors disabled:opacity-40"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="sm:hidden divide-y divide-slate-800/60">
            {filtered.map((expense) => {
              const color = CATEGORY_COLORS[expense.category] ?? '#94a3b8';
              return (
                <div key={expense.id} className="px-4 py-4 flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-base flex-shrink-0"
                    style={{ backgroundColor: color + '22' }}
                  >
                    {CATEGORY_EMOJIS[expense.category]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">{expense.description}</p>
                    <p className="text-slate-500 text-xs">{formatDate(expense.date)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="text-white font-semibold text-sm">${expense.amount.toFixed(2)}</p>
                    <button onClick={() => onEdit(expense)} className="p-1.5 text-slate-500 hover:text-blue-400 transition-colors">
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(expense.id)}
                      disabled={deletingId === expense.id}
                      className="p-1.5 text-slate-500 hover:text-red-400 transition-colors disabled:opacity-40"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <p className="text-slate-600 text-xs text-right">
        {filtered.length} of {expenses.length} expenses
      </p>
    </div>
  );
}
