import { NextRequest, NextResponse } from 'next/server';
import { readExpenses, writeExpenses } from '@/lib/store';
import { ExpenseInput } from '@/lib/types';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const body: ExpenseInput = await request.json();
  const expenses = readExpenses();
  const index = expenses.findIndex((e) => e.id === params.id);

  if (index === -1) {
    return NextResponse.json({ error: 'Expense not found' }, { status: 404 });
  }

  if (!body.amount || body.amount <= 0) {
    return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
  }

  expenses[index] = {
    ...expenses[index],
    amount: Number(body.amount),
    category: body.category,
    description: body.description.trim(),
    date: body.date,
  };

  writeExpenses(expenses);
  return NextResponse.json(expenses[index]);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const expenses = readExpenses();
  const index = expenses.findIndex((e) => e.id === params.id);

  if (index === -1) {
    return NextResponse.json({ error: 'Expense not found' }, { status: 404 });
  }

  expenses.splice(index, 1);
  writeExpenses(expenses);
  return NextResponse.json({ success: true });
}
