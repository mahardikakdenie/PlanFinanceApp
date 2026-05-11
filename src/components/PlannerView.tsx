import React from 'react';
import { useFinanceStore } from '../store/useFinanceStore';
import { formatCurrency } from '../utils/formatters';
import { motion } from 'motion/react';
import { Calculator, ShieldCheck, Target, Heart } from 'lucide-react';

export const PlannerView = () => {
  const { income, budget } = useFinanceStore();

  const cards = [
    {
      title: 'Kebutuhan (50%)',
      amount: budget.Needs,
      icon: <Target className="text-natural-primary" />,
      desc: 'Sewa, listrik, groceries, cicilan, dan transportasi wajib.',
      color: 'bg-natural-light'
    },
    {
      title: 'Keinginan (30%)',
      amount: budget.Wants,
      icon: <Heart className="text-natural-accent" />,
      desc: 'Hobi, jalan-jalan, kopi, Netflix, dan hiburan lainnya.',
      color: 'bg-natural-accent/10'
    },
    {
      title: 'Tabungan (20%)',
      amount: budget.Savings,
      icon: <ShieldCheck className="text-natural-sage" />,
      desc: 'Dana darurat, investasi, dan tabungan hari tua.',
      color: 'bg-natural-sage/10'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white p-8 rounded-[32px] border border-natural-border shadow-sm">
        <h2 className="text-2xl font-serif italic text-natural-primary mb-2">Budget Planner</h2>
        <p className="text-xs text-natural-muted font-medium leading-relaxed">
          Berdasarkan pemasukan <span className="font-bold text-natural-dark">{formatCurrency(income)}</span>, 
          berikut adalah rencana alokasi otomatis kamu menggunakan standar 50/30/20.
        </p>
      </div>

      <div className="space-y-4">
        {cards.map((card, idx) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white p-6 rounded-[32px] border border-natural-border shadow-sm flex items-start gap-4"
          >
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${card.color}`}>
              {card.icon}
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-baseline mb-1">
                <h3 className="font-bold text-natural-dark">{card.title}</h3>
                <p className="text-sm font-black text-natural-primary">{formatCurrency(card.amount)}</p>
              </div>
              <p className="text-[10px] text-natural-muted font-medium italic leading-relaxed">
                {card.desc}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      <button className="w-full py-4 bg-natural-dark text-natural-bg rounded-2xl font-bold hover:opacity-90 transition-opacity">
        Ubah Pemasukan
      </button>
    </div>
  );
};
