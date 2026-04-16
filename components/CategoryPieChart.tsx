'use client';

import { useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  type ChartOptions,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { Expense, CATEGORY_COLORS, CATEGORY_LABELS } from '@/lib/types';

ChartJS.register(ArcElement, Tooltip, Legend);

interface CategoryPieChartProps {
  expenses: Expense[];
}

export default function CategoryPieChart({ expenses }: CategoryPieChartProps) {
  const categoryTotals: Record<string, number> = {};

  expenses.forEach((e) => {
    categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amount;
  });

  const sorted = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]);
  const labels = sorted.map(([cat]) => CATEGORY_LABELS[cat as keyof typeof CATEGORY_LABELS] ?? cat);
  const values = sorted.map(([, amt]) => amt);
  const colors = sorted.map(([cat]) => CATEGORY_COLORS[cat as keyof typeof CATEGORY_COLORS] ?? '#94a3b8');

  const total = values.reduce((s, v) => s + v, 0);

  const data = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: colors.map((c) => c + '99'),
        borderColor: colors,
        borderWidth: 2,
        hoverBackgroundColor: colors.map((c) => c + 'cc'),
        hoverBorderWidth: 3,
      },
    ],
  };

  const options: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '68%',
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        borderColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
        titleColor: '#f8fafc',
        bodyColor: '#94a3b8',
        padding: 12,
        callbacks: {
          label: (ctx) => {
            const pct = total > 0 ? ((ctx.parsed / total) * 100).toFixed(1) : '0';
            return ` $${ctx.parsed.toFixed(2)} (${pct}%)`;
          },
        },
      },
    },
  };

  if (sorted.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-slate-500 text-sm">
        No expense data yet
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full">
      {/* Chart */}
      <div className="relative flex-shrink-0 mx-auto" style={{ width: 200, height: 200 }}>
        <Doughnut data={data} options={options} />
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <p className="text-white font-bold text-lg">${total.toFixed(0)}</p>
          <p className="text-slate-500 text-xs">total</p>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-col gap-2 flex-1 justify-center">
        {sorted.map(([cat, amt]) => {
          const color = CATEGORY_COLORS[cat as keyof typeof CATEGORY_COLORS] ?? '#94a3b8';
          const label = CATEGORY_LABELS[cat as keyof typeof CATEGORY_LABELS] ?? cat;
          const pct = total > 0 ? ((amt / total) * 100).toFixed(1) : '0';
          return (
            <div key={cat} className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
              <span className="text-slate-400 text-xs flex-1 truncate">{label}</span>
              <span className="text-white text-xs font-semibold">${amt.toFixed(0)}</span>
              <span className="text-slate-500 text-xs w-10 text-right">{pct}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
