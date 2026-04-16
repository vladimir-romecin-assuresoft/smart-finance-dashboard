'use client';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { Expense, ExpenseInput, CATEGORIES, CATEGORY_LABELS, CATEGORY_EMOJIS } from '@/lib/types';

interface ExpenseFormProps {
  editing: Expense | null;
  onClose: () => void;
  onSave: (data: ExpenseInput, id?: string) => Promise<void>;
}

const today = new Date().toISOString().slice(0, 10);

export default function ExpenseForm({ editing, onClose, onSave }: ExpenseFormProps) {
  const [form, setForm] = useState<ExpenseInput>({
    amount: 0,
    category: 'food',
    description: '',
    date: today,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (editing) {
      setForm({
        amount: editing.amount,
        category: editing.category,
        description: editing.description,
        date: editing.date,
      });
    }
  }, [editing]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!form.amount || form.amount <= 0) {
      setError('Please enter a valid amount.');
      return;
    }
    if (!form.description.trim()) {
      setError('Please enter a description.');
      return;
    }

    setLoading(true);
    try {
      await onSave(form, editing?.id);
      onClose();
    } catch {
      setError('Failed to save expense. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative glass-card w-full max-w-md p-6 animate-slide-up shadow-2xl shadow-black/50">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-white font-semibold text-lg">
            {editing ? 'Edit Expense' : 'Add Expense'}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-white transition-colors rounded-lg p-1 hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Amount */}
          <div>
            <label className="block text-slate-400 text-xs font-medium mb-1.5">Amount ($)</label>
            <input
              type="number"
              min="0.01"
              step="0.01"
              value={form.amount || ''}
              onChange={(e) => setForm({ ...form, amount: parseFloat(e.target.value) || 0 })}
              placeholder="0.00"
              className="glass-input w-full px-4 py-2.5 text-sm"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-slate-400 text-xs font-medium mb-1.5">Description</label>
            <input
              type="text"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="e.g. Weekly groceries"
              className="glass-input w-full px-4 py-2.5 text-sm"
              required
              maxLength={120}
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-slate-400 text-xs font-medium mb-1.5">Category</label>
            <div className="grid grid-cols-3 gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setForm({ ...form, category: cat })}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium border transition-all duration-150 ${
                    form.category === cat
                      ? 'bg-violet-600/30 border-violet-500/60 text-white'
                      : 'bg-slate-900/40 border-slate-700/40 text-slate-400 hover:text-white hover:border-slate-600/60'
                  }`}
                >
                  <span>{CATEGORY_EMOJIS[cat]}</span>
                  <span className="truncate">{CATEGORY_LABELS[cat].split(' ')[0]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Date */}
          <div>
            <label className="block text-slate-400 text-xs font-medium mb-1.5">Date</label>
            <input
              type="date"
              value={form.date}
              max={today}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="glass-input w-full px-4 py-2.5 text-sm [color-scheme:dark]"
              required
            />
          </div>

          {error && (
            <p className="text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-ghost flex-1 px-4 py-2.5 text-sm">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn-primary flex-1 px-4 py-2.5 text-sm">
              {loading ? 'Saving…' : editing ? 'Save Changes' : 'Add Expense'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
