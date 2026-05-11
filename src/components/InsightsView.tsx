import React from 'react';
import { useFinanceStore } from '../store/useFinanceStore';
import { formatCurrency } from '../utils/formatters';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { motion } from 'motion/react';
import { PieChart as PieIcon, TrendingUp, AlertCircle, Sparkles } from 'lucide-react';

export const InsightsView = () => {
  const { income, budget, getSpentByCategory, getBurnRate } = useFinanceStore();

  const data = [
    { name: 'Kebutuhan', value: getSpentByCategory('Needs'), color: '#5A5A40', total: budget.Needs },
    { name: 'Keinginan', value: getSpentByCategory('Wants'), color: '#D97706', total: budget.Wants },
    { name: 'Tabungan', value: getSpentByCategory('Savings'), color: '#8A9A5B', total: budget.Savings },
  ].filter(d => d.value > 0);

  const burnRate = getBurnRate();
  const isOverBurning = burnRate > 1.2;

  return (
    <div className="space-y-6">
      {/* Visual Analytics */}
      <div className="bg-white p-8 rounded-[32px] border border-natural-border shadow-sm space-y-6">
        <div className="flex items-center gap-2 px-1">
          <div className="p-2 bg-natural-light rounded-lg text-natural-primary">
            <PieIcon size={18} />
          </div>
          <h2 className="text-xl font-serif italic text-natural-primary">Category Breakdown</h2>
        </div>

        {data.length > 0 ? (
          <div className="h-64 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={8}
                  dataKey="value"
                  animationDuration={1000}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '16px', 
                    border: 'none', 
                    boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                    fontSize: '12px',
                    fontWeight: '600'
                  }}
                  formatter={(val: number) => formatCurrency(val)}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[10px] text-natural-muted font-bold uppercase tracking-widest">Total Spent</span>
              <span className="text-xl font-black text-natural-dark">
                {formatCurrency(data.reduce((acc, curr) => acc + curr.value, 0))}
              </span>
            </div>
          </div>
        ) : (
          <div className="h-48 flex items-center justify-center border-2 border-dashed border-natural-border rounded-3xl text-natural-muted italic text-sm">
            Belum ada data untuk dianalisis.
          </div>
        )}
      </div>

      {/* Burn Rate Insight */}
      <div className={`p-6 rounded-[32px] border ${
        isOverBurning 
          ? 'bg-natural-accent/5 border-natural-accent/20' 
          : 'bg-natural-sage/5 border-natural-sage/20'
      } space-y-4`}>
        <div className="flex items-center gap-2">
          {isOverBurning ? <AlertCircle className="text-natural-accent" size={20} /> : <TrendingUp className="text-natural-sage" size={20} />}
          <h3 className="font-serif italic text-natural-dark">Burn Rate Analysis</h3>
        </div>
        <p className="text-sm text-natural-muted leading-relaxed">
          {isOverBurning 
            ? 'Dompet kamu mulai "kepanasan"! Kecepatan belanja kamu lebih cepat daripada progress hari di bulan ini. Coba tunda pengeluaran di kategori Keinginan.'
            : 'Mantap! Pengeluaran kamu terjaga dengan sangat baik. Kecepatan belanja kamu masih di bawah target bulanan.'}
        </p>
      </div>

      {/* Smart Tip */}
      <div className="bg-natural-dark p-8 rounded-[32px] text-natural-bg relative overflow-hidden">
        <Sparkles className="absolute top-4 right-4 text-white/10" size={64} />
        <div className="relative z-10 space-y-2">
          <p className="text-[10px] uppercase font-bold tracking-widest text-white/50">Smart Tip</p>
          <p className="text-lg font-serif italic italic leading-relaxed">
            "Prioritaskan menabung di awal bulan agar target 20% kamu tidak terpakai untuk pengeluaran dadakan."
          </p>
        </div>
      </div>
    </div>
  );
};
