'use client';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  type ChartOptions,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Expense } from '@/lib/types';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

interface SpendingLineChartProps {
  expenses: Expense[];
}

export default function SpendingLineChart({ expenses }: SpendingLineChartProps) {
  // Build last-90-days daily buckets
  const today = new Date();
  const days: string[] = [];
  for (let i = 89; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    days.push(d.toISOString().slice(0, 10));
  }

  const dailyTotals: Record<string, number> = {};
  days.forEach((d) => (dailyTotals[d] = 0));
  expenses.forEach((e) => {
    if (dailyTotals[e.date] !== undefined) {
      dailyTotals[e.date] += e.amount;
    }
  });

  // Group by week for cleaner chart
  const weeklyLabels: string[] = [];
  const weeklyValues: number[] = [];

  for (let w = 0; w < 13; w++) {
    const weekDays = days.slice(w * 7, w * 7 + 7);
    if (weekDays.length === 0) continue;
    const weekTotal = weekDays.reduce((s, d) => s + (dailyTotals[d] || 0), 0);
    const label = new Date(weekDays[0]).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    weeklyLabels.push(label);
    weeklyValues.push(weekTotal);
  }

  const data = {
    labels: weeklyLabels,
    datasets: [
      {
        label: 'Weekly Spending',
        data: weeklyValues,
        fill: true,
        tension: 0.4,
        borderColor: '#8b5cf6',
        borderWidth: 2.5,
        pointBackgroundColor: '#8b5cf6',
        pointBorderColor: '#1e1b4b',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        backgroundColor: (ctx: { chart: ChartJS }) => {
          const chart = ctx.chart;
          const { ctx: canvasCtx, chartArea } = chart;
          if (!chartArea) return 'transparent';
          const gradient = canvasCtx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
          gradient.addColorStop(0, 'rgba(139, 92, 246, 0.3)');
          gradient.addColorStop(1, 'rgba(139, 92, 246, 0.0)');
          return gradient;
        },
      },
    ],
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    scales: {
      x: {
        grid: { color: 'rgba(255,255,255,0.04)' },
        ticks: { color: '#64748b', font: { size: 11 }, maxTicksLimit: 7 },
        border: { display: false },
      },
      y: {
        grid: { color: 'rgba(255,255,255,0.04)' },
        ticks: {
          color: '#64748b',
          font: { size: 11 },
          callback: (v) => `$${v}`,
        },
        border: { display: false },
        beginAtZero: true,
      },
    },
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
          label: (ctx) => ` $${(ctx.parsed.y as number).toFixed(2)}`,
        },
      },
    },
  };

  const hasData = weeklyValues.some((v) => v > 0);

  if (!hasData) {
    return (
      <div className="flex items-center justify-center h-full text-slate-500 text-sm">
        No recent spending data
      </div>
    );
  }

  return <Line data={data} options={options} />;
}
