import fs from 'fs';
import path from 'path';
import { Expense } from './types';

const DATA_FILE = path.join(process.cwd(), 'data', 'expenses.json');

export function readExpenses(): Expense[] {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
      fs.writeFileSync(DATA_FILE, JSON.stringify([]));
      return [];
    }
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(raw) as Expense[];
  } catch {
    return [];
  }
}

export function writeExpenses(expenses: Expense[]): void {
  fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify(expenses, null, 2));
}
