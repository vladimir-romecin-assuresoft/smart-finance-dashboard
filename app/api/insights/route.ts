import { NextResponse } from 'next/server';
import { readExpenses } from '@/lib/store';
import { Expense, Insight } from '@/lib/types';

function generateInsights(expenses: Expense[]): Insight[] {
  const insights: Insight[] = [];
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const thisMonthExpenses = expenses.filter((e) => {
    const d = new Date(e.date);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });

  const lastMonthDate = new Date(currentYear, currentMonth - 1);
  const lastMonthExpenses = expenses.filter((e) => {
    const d = new Date(e.date);
    return d.getMonth() === lastMonthDate.getMonth() && d.getFullYear() === lastMonthDate.getFullYear();
  });

  const totalThisMonth = thisMonthExpenses.reduce((s, e) => s + e.amount, 0);
  const totalLastMonth = lastMonthExpenses.reduce((s, e) => s + e.amount, 0);

  // Month-over-month trend
  if (totalLastMonth > 0) {
    const change = ((totalThisMonth - totalLastMonth) / totalLastMonth) * 100;
    if (change > 15) {
      insights.push({
        type: 'warning',
        title: 'Spending Spike Detected',
        description: `Your spending is up ${change.toFixed(1)}% vs last month ($${totalLastMonth.toFixed(0)} → $${totalThisMonth.toFixed(0)}). Consider reviewing discretionary expenses.`,
      });
    } else if (change < -10) {
      insights.push({
        type: 'positive',
        title: 'Great Progress!',
        description: `You've cut spending by ${Math.abs(change).toFixed(1)}% vs last month, saving $${(totalLastMonth - totalThisMonth).toFixed(0)}. Keep it up!`,
      });
    }
  }

  // Category breakdown
  const categoryTotals: Record<string, number> = {};
  thisMonthExpenses.forEach((e) => {
    categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amount;
  });

  const sortedCats = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]);

  if (sortedCats.length > 0 && totalThisMonth > 0) {
    const [topCat, topAmt] = sortedCats[0];
    const pct = (topAmt / totalThisMonth) * 100;

    if (topCat !== 'rent' && pct > 28) {
      const catTips: Record<string, string> = {
        food: 'Meal-prepping and cooking at home can cut food costs by up to 50%.',
        entertainment: 'Try free alternatives — parks, libraries, and community events.',
        shopping: 'Apply a 24-hour pause before any non-essential purchase.',
        transport: 'Carpooling or public transit could significantly lower transport costs.',
        health: 'Check if your insurance covers more services or look for community clinics.',
        utilities: 'Unplugging idle devices and using LED bulbs can reduce utility bills by 10–20%.',
        education: 'Many courses are free on platforms like Coursera and edX.',
      };

      insights.push({
        type: 'tip',
        title: `${topCat.charAt(0).toUpperCase() + topCat.slice(1)} is Your Top Expense`,
        description: `${topCat.charAt(0).toUpperCase() + topCat.slice(1)} accounts for ${pct.toFixed(0)}% of spending this month ($${topAmt.toFixed(0)}). ${catTips[topCat] ?? 'Review this category for savings opportunities.'}`,
      });
    }

    // Rent ratio warning
    if (categoryTotals['rent'] && totalThisMonth > 0) {
      const rentPct = (categoryTotals['rent'] / totalThisMonth) * 100;
      if (rentPct > 50) {
        insights.push({
          type: 'warning',
          title: 'Housing Costs Are High',
          description: `Rent is ${rentPct.toFixed(0)}% of your tracked expenses. Financial experts recommend keeping housing below 30% of income.`,
        });
      }
    }
  }

  // Savings opportunity
  const nonEssential = (categoryTotals['entertainment'] || 0) + (categoryTotals['shopping'] || 0);
  if (nonEssential > 50) {
    const potential = nonEssential * 0.3;
    insights.push({
      type: 'tip',
      title: 'Savings Opportunity Found',
      description: `Trimming entertainment & shopping by 30% could free up $${potential.toFixed(0)} this month — perfect for building your emergency fund.`,
    });
  }

  // Positive reinforcement when all looks good
  if (insights.length === 0) {
    insights.push({
      type: 'positive',
      title: 'Finances Look Balanced',
      description: 'Your spending this month appears well-distributed. Keep tracking to maintain momentum!',
    });
  }

  // Always add the 50/30/20 tip
  insights.push({
    type: 'tip',
    title: 'The 50/30/20 Rule',
    description: 'Allocate 50% of income to needs, 30% to wants, and 20% to savings & investments. This simple framework builds long-term wealth.',
  });

  // Streak/habit tip
  insights.push({
    type: 'positive',
    title: 'Keep Tracking — It Pays Off',
    description: 'People who track expenses consistently save on average 20% more per year. You\'re building a powerful financial habit.',
  });

  return insights;
}

export async function GET() {
  const expenses = readExpenses();
  const insights = generateInsights(expenses);
  return NextResponse.json(insights);
}
