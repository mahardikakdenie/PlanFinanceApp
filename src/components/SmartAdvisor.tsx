
import React, { useState } from 'react';
import { useFinanceStore, CategoryType } from '../store/useFinanceStore';
import { formatCurrency } from '../utils/formatters';
import { ShoppingBag, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const SmartAdvisor = () => {
  const [queryAmount, setQueryAmount] = useState('');
  const [queryCategory, setQueryCategory] = useState<CategoryType>('Wants');
  const [recommendation, setRecommendation] = useState<{
    status: 'KEEP' | 'GO';
    reason: string;
  } | null>(null);

  const { getRemainingByCategory, getBurnRate } = useFinanceStore();

  const handleAsk = () => {
    const amount = parseFloat(queryAmount);
    if (isNaN(amount) || amount <= 0) return;

    const remaining = getRemainingByCategory(queryCategory);
    const burnRate = getBurnRate();
    
    // Logic for recommendation
    if (amount > remaining) {
      setRecommendation({
        status: 'KEEP',
        reason: `Wah, budget ${queryCategory} kamu sudah mepet! Kalau beli ini, kamu bakal minus ${formatCurrency(amount - remaining)} di kategori ini.`,
      });
    } else if (queryCategory === 'Wants' && burnRate > 1.2) {
      setRecommendation({
        status: 'KEEP',
        reason: 'Pengeluaran kamu bulan ini lumayan kencang! Sebaiknya tunda dulu keinginan ini sampai cash flow kamu lebih stabil.',
      });
    } else {
      setRecommendation({
        status: 'GO',
        reason: 'Sikat! Budget kamu masih aman dan pengeluaran kamu masih terkendali. Enjoy!',
      });
    }
  };

  return (
    <div className="bg-white p-6 rounded-[32px] shadow-sm border border-natural-border flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <div className="p-2 bg-natural-light rounded-lg text-natural-primary">
          <ShoppingBag size={20} />
        </div>
        <h3 className="text-lg font-serif italic text-natural-primary">Should I Buy It?</h3>
      </div>

      <div className="space-y-3">
        <div className="flex flex-col gap-1">
          <label className="text-[10px] uppercase font-bold text-natural-secondary ml-1">Price (Rp)</label>
          <input
            type="number"
            value={queryAmount}
            onChange={(e) => setQueryAmount(e.target.value)}
            placeholder="150.000"
            className="w-full bg-natural-bg border border-natural-border rounded-xl px-4 py-2 text-sm outline-none focus:ring-1 focus:ring-natural-primary text-natural-dark"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[10px] uppercase font-bold text-natural-secondary ml-1">Kategori</label>
          <div className="flex gap-2">
            {(['Needs', 'Wants', 'Savings'] as CategoryType[]).map((cat) => (
              <button
                key={cat}
                onClick={() => setQueryCategory(cat)}
                className={`flex-1 py-2 px-1 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all border ${
                  queryCategory === cat
                    ? 'bg-natural-primary text-white border-natural-primary'
                    : 'bg-white text-natural-muted border-natural-border'
                }`}
              >
                {cat === 'Needs' ? 'Kebutuhan' : cat === 'Wants' ? 'Keinginan' : 'Tabungan'}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleAsk}
          className="w-full bg-natural-dark text-natural-bg py-3 rounded-xl font-medium shadow-md hover:opacity-90 transition-opacity mt-2"
        >
          Analyze Purchase
        </button>
      </div>

      <AnimatePresence>
        {recommendation && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`mt-4 p-4 rounded-2xl flex gap-3 ${
              recommendation.status === 'KEEP'
                ? 'bg-natural-accent/5 border border-natural-accent/20'
                : 'bg-natural-sage/5 border border-natural-sage/20'
            }`}
          >
            <div className={recommendation.status === 'KEEP' ? 'text-natural-accent' : 'text-natural-sage'}>
              {recommendation.status === 'KEEP' ? <AlertTriangle size={24} /> : <CheckCircle size={24} />}
            </div>
            <div>
              <p className={`text-sm font-serif italic ${recommendation.status === 'KEEP' ? 'text-natural-accent' : 'text-natural-sage'}`}>
                {recommendation.status === 'KEEP' ? '"KEEP (Tahan Dulu)"' : '"GO (Boleh Lanjut)"'}
              </p>
              <p className="text-xs text-natural-muted mt-1 leading-relaxed">
                {recommendation.reason}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
