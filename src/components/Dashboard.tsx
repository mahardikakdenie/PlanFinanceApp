
import React from 'react';
import { useFinanceStore, CategoryType } from '../store/useFinanceStore';
import { formatCurrency } from '../utils/formatters';
import { PieChart, Pie, Cell, ResponsiveContainer, Label } from 'recharts';
import { motion } from 'motion/react';
import { Wallet, TrendingUp, CreditCard } from 'lucide-react';

const COLORS = ['#6366f1', '#f43f5e', '#10b981'];

export const Dashboard = () => {
  const { income, budget, getSpentByCategory } = useFinanceStore();

  const needsSpent = getSpentByCategory('Needs');
  const wantsSpent = getSpentByCategory('Wants');
  const savingsSpent = getSpentByCategory('Savings');

  const chartData = [
    { name: 'Kebutuhan', value: budget.Needs, spent: needsSpent },
    { name: 'Keinginan', value: budget.Wants, spent: wantsSpent },
    { name: 'Tabungan', value: budget.Savings, spent: savingsSpent },
  ];

  const totalSpent = needsSpent + wantsSpent + savingsSpent;
  const balance = income - totalSpent;

  const ProgressBar = ({ label, spent, limit, color }: { label: string, spent: number, limit: number, color: string }) => {
    const percentage = Math.min(100, (spent / limit) * 100);
    return (
      <div className="space-y-1">
        <div className="flex justify-between text-xs font-semibold">
          <span className="text-natural-muted font-medium uppercase tracking-wider">{label}</span>
          <span className={percentage > 90 ? 'text-natural-accent' : 'text-natural-dark'}>
            {formatCurrency(spent)} / {formatCurrency(limit)}
          </span>
        </div>
        <div className="h-3 w-full bg-natural-light/50 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            className={`h-full ${color} rounded-full`}
          />
        </div>
      </div>
    );
  };

  if (income === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Wallet Balance Card */}
      <div className="relative overflow-hidden bg-natural-dark rounded-[32px] p-8 text-natural-bg shadow-xl">
        <div className="relative z-10 space-y-1">
          <p className="text-natural-secondary/60 text-xs font-semibold uppercase tracking-[0.2em]">Total Sisa Saldo</p>
          <h2 className="text-4xl font-serif italic">{formatCurrency(balance)}</h2>
        </div>
        
        <div className="relative z-10 flex gap-4 mt-8">
          <div className="flex-1 bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10">
            <p className="text-[10px] text-white/40 font-bold uppercase tracking-wider">Pemasukan</p>
            <p className="font-bold text-sm text-white/90">{formatCurrency(income)}</p>
          </div>
          <div className="flex-1 bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10">
            <p className="text-[10px] text-white/40 font-bold uppercase tracking-wider">Pengeluaran</p>
            <p className="font-bold text-sm text-white/90">{formatCurrency(totalSpent)}</p>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-natural-primary/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-natural-accent/10 rounded-full blur-2xl" />
      </div>

      {/* Budget Breakdown */}
      <div className="bg-white p-6 rounded-[32px] shadow-sm border border-natural-border space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-serif italic text-natural-primary">Monthly Budget</h3>
          <div className="h-8 w-8 bg-natural-bg rounded-xl flex items-center justify-center text-natural-secondary">
            <TrendingUp size={16} />
          </div>
        </div>

        <div className="space-y-5">
          <ProgressBar 
            label="Kebutuhan (50%)" 
            spent={needsSpent} 
            limit={budget.Needs} 
            color="bg-natural-primary" 
          />
          <ProgressBar 
            label="Keinginan (30%)" 
            spent={wantsSpent} 
            limit={budget.Wants} 
            color="bg-natural-accent" 
          />
          <ProgressBar 
            label="Tabungan (20%)" 
            spent={savingsSpent} 
            limit={budget.Savings} 
            color="bg-natural-sage" 
          />
        </div>
      </div>
    </div>
  );
};
