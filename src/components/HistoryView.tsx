import React, { useState } from 'react';
import { useFinanceStore, CategoryType } from '../store/useFinanceStore';
import { formatCurrency } from '../utils/formatters';
import { Calendar, Filter, Search, ArrowDownCircle } from 'lucide-react';
import { motion } from 'motion/react';

export const HistoryView = () => {
  const { expenses } = useFinanceStore();
  const [filter, setFilter] = useState<CategoryType | 'All'>('All');

  const filteredExpenses = filter === 'All' 
    ? expenses 
    : expenses.filter(e => e.category === filter);

  const categories: (CategoryType | 'All')[] = ['All', 'Needs', 'Wants', 'Savings'];

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-[32px] border border-natural-border shadow-sm space-y-4">
        <div className="flex justify-between items-center px-1">
          <h2 className="text-xl font-serif italic text-natural-primary">Transaction History</h2>
          <div className="h-8 w-8 bg-natural-bg rounded-full flex items-center justify-center text-natural-muted">
            <Search size={16} />
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest whitespace-nowrap transition-all border ${
                filter === cat
                  ? 'bg-natural-primary text-white border-natural-primary'
                  : 'bg-white text-natural-muted border-natural-border'
              }`}
            >
              {cat === 'All' ? 'Semua' : cat === 'Needs' ? 'Kebutuhan' : cat === 'Wants' ? 'Keinginan' : 'Tabungan'}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {filteredExpenses.length === 0 ? (
          <div className="bg-white p-20 rounded-[32px] border border-dashed border-natural-border text-center">
            <p className="text-sm font-medium text-natural-muted italic">Hmm, belum ada catatan di sini.</p>
          </div>
        ) : (
          filteredExpenses.map((expense, idx) => (
            <motion.div
              key={expense.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-white p-4 rounded-2xl flex items-center justify-between border border-natural-border shadow-sm group"
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${
                  expense.category === 'Needs' ? 'bg-natural-light text-natural-primary' :
                  expense.category === 'Wants' ? 'bg-natural-accent/10 text-natural-accent' : 
                  'bg-natural-sage/10 text-natural-sage'
                }`}>
                  <ArrowDownCircle size={18} />
                </div>
                <div>
                  <p className="text-sm font-bold text-natural-dark group-hover:text-natural-primary transition-colors">{expense.note || expense.category}</p>
                  <p className="text-[10px] text-natural-secondary font-bold uppercase tracking-wider">
                    {new Date(expense.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-black text-natural-accent">-{formatCurrency(expense.amount)}</p>
                <p className={`text-[8px] font-bold uppercase tracking-widest mt-0.5 ${
                  expense.category === 'Needs' ? 'text-natural-primary' :
                  expense.category === 'Wants' ? 'text-natural-accent' : 
                  'text-natural-sage'
                }`}>
                  {expense.category}
                </p>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};
