'use client';

import { AlertTriangle, Lightbulb, CheckCircle2, Sparkles } from 'lucide-react';
import { Insight } from '@/lib/types';

interface AIInsightsProps {
  insights: Insight[];
  loading: boolean;
}

const CONFIG = {
  warning: {
    bg: 'bg-amber-500/10 border-amber-500/30',
    icon: <AlertTriangle className="w-5 h-5 text-amber-400" />,
    badge: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    badgeText: 'Alert',
    title: 'text-amber-300',
  },
  tip: {
    bg: 'bg-blue-500/10 border-blue-500/30',
    icon: <Lightbulb className="w-5 h-5 text-blue-400" />,
    badge: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    badgeText: 'Tip',
    title: 'text-blue-300',
  },
  positive: {
    bg: 'bg-emerald-500/10 border-emerald-500/30',
    icon: <CheckCircle2 className="w-5 h-5 text-emerald-400" />,
    badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    badgeText: 'Good',
    title: 'text-emerald-300',
  },
};

export default function AIInsights({ insights, loading }: AIInsightsProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="glass-card p-5 animate-pulse">
            <div className="h-4 bg-slate-700 rounded w-1/3 mb-3" />
            <div className="h-3 bg-slate-800 rounded w-full mb-2" />
            <div className="h-3 bg-slate-800 rounded w-4/5" />
          </div>
        ))}
      </div>
    );
  }

  if (insights.length === 0) {
    return (
      <div className="glass-card p-8 text-center text-slate-500">
        No insights available yet. Add some expenses to get started.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600/30 to-blue-600/30 border border-violet-500/30 flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-violet-400" />
        </div>
        <div>
          <h3 className="text-white font-semibold">AI Insights</h3>
          <p className="text-slate-500 text-xs">Personalized recommendations based on your spending</p>
        </div>
      </div>

      {/* Insight cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {insights.map((insight, i) => {
          const config = CONFIG[insight.type];
          return (
            <div
              key={i}
              className={`rounded-2xl border p-5 ${config.bg} backdrop-blur-sm animate-slide-up`}
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">{config.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${config.badge}`}
                    >
                      {config.badgeText}
                    </span>
                  </div>
                  <h4 className={`font-semibold text-sm mb-1.5 ${config.title}`}>{insight.title}</h4>
                  <p className="text-slate-400 text-xs leading-relaxed">{insight.description}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
