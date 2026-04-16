import { NextRequest, NextResponse } from 'next/server';
import { readExpenses, writeExpenses } from '@/lib/store';
import { ExpenseInput } from '@/lib/types';

export async function GET() {
  const expenses = readExpenses();
  return NextResponse.json(expenses);
}

export async function POST(request: NextRequest) {
  const body: ExpenseInput = await request.json();

  if (!body.amount || body.amount <= 0) {
    return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
  }
  if (!body.category) {
    return NextResponse.json({ error: 'Category is required' }, { status: 400 });
  }
  if (!body.description?.trim()) {
    return NextResponse.json({ error: 'Description is required' }, { status: 400 });
  }
  if (!body.date) {
    return NextResponse.json({ error: 'Date is required' }, { status: 400 });
  }

  const expenses = readExpenses();
  const newExpense = {
    id: crypto.randomUUID(),
    amount: Number(body.amount),
    category: body.category,
    description: body.description.trim(),
    date: body.date,
    createdAt: new Date().toISOString(),
  };

  expenses.push(newExpense);
  writeExpenses(expenses);

  return NextResponse.json(newExpense, { status: 201 });
}
