'use client';

import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  trend?: { value: number; label: string };
  icon: React.ReactNode;
  accentClass: string;
}

export default function StatCard({ title, value, subtitle, trend, icon, accentClass }: StatCardProps) {
  const trendPositive = trend && trend.value > 0;
  const trendNeutral = trend && trend.value === 0;

  return (
    <div className="glass-card p-6 flex flex-col gap-4 animate-slide-up hover:border-slate-600/50 transition-colors">
      <div className="flex items-start justify-between">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${accentClass}`}>
          {icon}
        </div>
        {trend && (
          <div
            className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${
              trendNeutral
                ? 'bg-slate-700/60 text-slate-400'
                : trendPositive
                ? 'bg-red-500/15 text-red-400'
                : 'bg-emerald-500/15 text-emerald-400'
            }`}
          >
            {trendNeutral ? (
              <Minus className="w-3 h-3" />
            ) : trendPositive ? (
              <TrendingUp className="w-3 h-3" />
            ) : (
              <TrendingDown className="w-3 h-3" />
            )}
            {Math.abs(trend.value).toFixed(1)}%
          </div>
        )}
      </div>

      <div>
        <p className="text-slate-400 text-sm font-medium mb-1">{title}</p>
        <p className="text-2xl font-bold text-white tracking-tight">{value}</p>
        {subtitle && <p className="text-slate-500 text-xs mt-1">{subtitle}</p>}
        {trend && (
          <p className="text-slate-500 text-xs mt-1">{trend.label}</p>
        )}
      </div>
    </div>
  );
}
