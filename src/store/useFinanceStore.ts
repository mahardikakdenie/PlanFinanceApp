
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type CategoryType = 'Needs' | 'Wants' | 'Savings';

export interface Expense {
  id: string;
  amount: number;
  category: CategoryType;
  note: string;
  date: number;
}

export interface BudgetAllocation {
  Needs: number;
  Wants: number;
  Savings: number;
}

interface FinanceState {
  income: number;
  expenses: Expense[];
  budget: BudgetAllocation;
  
  // Actions
  setIncome: (amount: number) => void;
  addExpense: (expense: Omit<Expense, 'id' | 'date'>) => void;
  getSpentByCategory: (category: CategoryType) => number;
  getRemainingByCategory: (category: CategoryType) => number;
  getBurnRate: () => number; // Percentage of month passed vs percentage spent
}

export const useFinanceStore = create<FinanceState>()(
  persist(
    (set, get) => ({
      income: 0,
      expenses: [],
      budget: {
        Needs: 0,
        Wants: 0,
        Savings: 0,
      },

      setIncome: (income: number) => {
        set({
          income,
          budget: {
            Needs: income * 0.5,
            Wants: income * 0.3,
            Savings: income * 0.2,
          },
        });
      },

      addExpense: (expenseData) => {
        const newExpense: Expense = {
          ...expenseData,
          id: Math.random().toString(36).substr(2, 9),
          date: Date.now(),
        };
        set((state) => ({
          expenses: [newExpense, ...state.expenses],
        }));
      },

      getSpentByCategory: (category: CategoryType) => {
        return get().expenses
          .filter((e) => e.category === category)
          .reduce((acc, curr) => acc + curr.amount, 0);
      },

      getRemainingByCategory: (category: CategoryType) => {
        const spent = get().getSpentByCategory(category);
        const limit = get().budget[category];
        return Math.max(0, limit - spent);
      },

      getBurnRate: () => {
        const now = new Date();
        const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
        const currentDay = now.getDate();
        const monthProgress = currentDay / daysInMonth;

        const totalSpent = get().expenses.reduce((acc, curr) => acc + curr.amount, 0);
        const totalBudget = get().income || 1; // avoid divide by zero
        const spendingProgress = totalSpent / totalBudget;

        return spendingProgress / monthProgress;
      },
    }),
    {
      name: 'smart-wallet-storage',
    }
  )
);
