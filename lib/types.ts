export type Category =
  | 'food'
  | 'rent'
  | 'transport'
  | 'entertainment'
  | 'health'
  | 'shopping'
  | 'utilities'
  | 'education'
  | 'other';

export interface Expense {
  id: string;
  amount: number;
  category: Category;
  description: string;
  date: string; // YYYY-MM-DD
  createdAt: string; // ISO string
}

export interface ExpenseInput {
  amount: number;
  category: Category;
  description: string;
  date: string;
}

export interface Insight {
  type: 'warning' | 'tip' | 'positive';
  title: string;
  description: string;
}

export const CATEGORIES: Category[] = [
  'food', 'rent', 'transport', 'entertainment',
  'health', 'shopping', 'utilities', 'education', 'other',
];

export const CATEGORY_LABELS: Record<Category, string> = {
  food: 'Food & Dining',
  rent: 'Rent & Housing',
  transport: 'Transport',
  entertainment: 'Entertainment',
  health: 'Health & Fitness',
  shopping: 'Shopping',
  utilities: 'Utilities',
  education: 'Education',
  other: 'Other',
};

export const CATEGORY_COLORS: Record<Category, string> = {
  food: '#f59e0b',
  rent: '#8b5cf6',
  transport: '#3b82f6',
  entertainment: '#ec4899',
  health: '#10b981',
  shopping: '#f97316',
  utilities: '#6366f1',
  education: '#14b8a6',
  other: '#94a3b8',
};

export const CATEGORY_EMOJIS: Record<Category, string> = {
  food: '🍔',
  rent: '🏠',
  transport: '🚗',
  entertainment: '🎮',
  health: '💊',
  shopping: '🛍️',
  utilities: '⚡',
  education: '📚',
  other: '📦',
};
