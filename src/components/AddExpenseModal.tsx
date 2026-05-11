
import React, { useState } from 'react';
import { useFinanceStore, CategoryType } from '../store/useFinanceStore';
import { X, Plus, PhilippinePeso, Tag, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const AddExpenseModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<CategoryType>('Wants');
  const [note, setNote] = useState('');
  
  const addExpense = useFinanceStore((state) => state.addExpense);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || isNaN(parseFloat(amount))) return;

    addExpense({
      amount: parseFloat(amount),
      category,
      note,
    });
    
    // Reset and Close
    setAmount('');
    setNote('');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            className="relative w-full max-w-md bg-natural-bg rounded-t-[32px] sm:rounded-[32px] p-8 shadow-2xl overflow-hidden border border-natural-border"
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-2xl font-serif italic text-natural-dark">Catat Pengeluaran</h3>
                <p className="text-xs text-natural-muted font-medium">Berapa yang kamu belanjakan?</p>
              </div>
              <button 
                onClick={onClose}
                className="w-10 h-10 bg-natural-light rounded-full flex items-center justify-center text-natural-primary hover:bg-natural-light/80 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Amount Input */}
              <div className="relative">
                <p className="text-[10px] uppercase font-bold text-natural-secondary mb-1 ml-1 tracking-widest">Amount (Rp)</p>
                <div className="flex items-center gap-3 bg-white rounded-2xl p-4 border border-natural-border focus-within:ring-1 focus-within:ring-natural-primary transition-all">
                  <span className="font-bold text-natural-muted">Rp</span>
                  <input
                    autoFocus
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0"
                    className="flex-1 bg-transparent border-none p-0 text-2xl font-bold text-natural-dark focus:ring-0"
                  />
                </div>
              </div>

              {/* Category Selection */}
              <div>
                <p className="text-[10px] uppercase font-bold text-natural-secondary mb-2 ml-1 tracking-widest">Pilih Kategori</p>
                <div className="flex gap-2">
                  {(['Needs', 'Wants', 'Savings'] as CategoryType[]).map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategory(cat)}
                      className={`flex-1 py-3 px-1 rounded-2xl text-[10px] font-bold uppercase tracking-wider transition-all border ${
                        category === cat
                          ? 'bg-natural-primary text-white border-natural-primary'
                          : 'bg-white border-natural-border text-natural-muted hover:border-natural-secondary'
                      }`}
                    >
                      {cat === 'Needs' ? 'Kebutuhan' : cat === 'Wants' ? 'Keinginan' : 'Tabungan'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Note Input */}
              <div>
                <p className="text-[10px] uppercase font-bold text-natural-secondary mb-1 ml-1 tracking-widest">Catatan</p>
                <div className="flex items-center gap-3 bg-white rounded-2xl p-4 border border-natural-border focus-within:ring-1 focus-within:ring-natural-primary">
                  <FileText size={18} className="text-natural-muted" />
                  <input
                    type="text"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Kopi, bensin, dll..."
                    className="flex-1 bg-transparent border-none p-0 text-sm font-medium text-natural-dark focus:ring-0"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-natural-dark text-natural-bg py-4 rounded-2xl font-medium text-lg hover:opacity-90 transition-all active:scale-[0.98] mt-4 shadow-lg"
              >
                Simpan Transaksi
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
