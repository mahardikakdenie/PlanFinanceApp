/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useFinanceStore } from './store/useFinanceStore';
import { Dashboard } from './components/Dashboard';
import { AddExpenseModal } from './components/AddExpenseModal';
import { SmartAdvisor } from './components/SmartAdvisor';
import { PlannerView } from './components/PlannerView';
import { HistoryView } from './components/HistoryView';
import { InsightsView } from './components/InsightsView';
import { Plus, Wallet, History, Sparkles, Settings, CreditCard, LayoutDashboard, CalendarRange } from 'lucide-react';
import { formatCurrency } from './utils/formatters';
import { motion, AnimatePresence } from 'motion/react';

type ActiveView = 'home' | 'planner' | 'history' | 'insights';

export default function App() {
  const { income, setIncome, expenses } = useFinanceStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeView, setActiveView] = useState<ActiveView>('home');
  const [tempIncome, setTempIncome] = useState('');

  const handleSalarySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempIncome && !isNaN(parseFloat(tempIncome))) {
      setIncome(parseFloat(tempIncome));
    }
  };

  const renderView = () => {
    switch (activeView) {
      case 'home':
        return (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <Dashboard />
            <SmartAdvisor />
            <div className="space-y-4 pb-4">
              <div className="flex items-center justify-between px-1">
                <h3 className="text-lg font-serif italic text-natural-primary">Frictionless Tracker</h3>
                <span className="text-[10px] uppercase tracking-widest text-natural-secondary font-bold">Recent</span>
              </div>
              <div className="space-y-3">
                {expenses.length === 0 ? (
                  <div className="bg-white p-12 rounded-[32px] border border-dashed border-natural-border text-center">
                    <p className="text-sm font-medium text-natural-muted italic">Belum ada pengeluaran hari ini.</p>
                    <p className="text-[10px] mt-2 text-natural-secondary uppercase tracking-widest font-bold">Tekan + untuk mencatat</p>
                  </div>
                ) : (
                  expenses.slice(0, 3).map((expense) => (
                    <div key={expense.id} className="bg-white p-4 rounded-2xl flex items-center justify-between border border-natural-border shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${
                          expense.category === 'Needs' ? 'bg-natural-light text-natural-primary' :
                          expense.category === 'Wants' ? 'bg-natural-accent/10 text-natural-accent' : 
                          'bg-natural-sage/10 text-natural-sage'
                        }`}>
                          {expense.category === 'Needs' ? '🏠' : expense.category === 'Wants' ? '☕' : '💰'}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-natural-dark">{expense.note || expense.category}</p>
                          <p className="text-[10px] text-natural-secondary font-bold uppercase tracking-wider">
                            {new Date(expense.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm font-bold text-natural-accent">-{formatCurrency(expense.amount)}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </motion.div>
        );
      case 'planner':
        return <PlannerView />;
      case 'history':
        return <HistoryView />;
      case 'insights':
        return <InsightsView />;
      default:
        return null;
    }
  };

  // Welcome / Setup Screen
  if (income === 0) {
    return (
      <div className="min-h-screen bg-natural-bg flex flex-col items-center justify-center p-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-sm space-y-8"
        >
          <div className="text-center space-y-3">
            <div className="inline-flex h-16 w-16 bg-natural-primary rounded-3xl items-center justify-center text-natural-bg shadow-xl mb-4">
              <Wallet size={32} />
            </div>
            <h1 className="text-4xl font-serif italic text-natural-primary tracking-tight">SmartWallet</h1>
            <p className="text-natural-muted font-medium text-sm">Financial clarity for a better tomorrow.</p>
          </div>

          <form onSubmit={handleSalarySubmit} className="space-y-6">
            <div className="bg-white rounded-3xl p-8 border border-natural-border focus-within:ring-2 focus-within:ring-natural-primary/20 transition-all shadow-sm">
              <label className="block text-[10px] font-bold text-natural-secondary uppercase tracking-[0.2em] mb-4">Pemasukan Bulanan</label>
              <div className="flex items-center gap-3">
                <span className="text-2xl font-bold text-natural-light">Rp</span>
                <input
                  type="number"
                  value={tempIncome}
                  onChange={(e) => setTempIncome(e.target.value)}
                  placeholder="0"
                  className="w-full bg-transparent border-none p-0 text-4xl font-bold text-natural-dark focus:ring-0 placeholder:text-natural-light"
                />
              </div>
            </div>
            <div className="px-2">
              <p className="text-[10px] text-natural-muted text-center font-medium leading-relaxed italic">
                Kami akan membagi otomatis menggunakan aturan <span className="font-bold">50/30/20</span>.<br/>Tenang, kamu bisa mengubahnya nanti.
              </p>
            </div>
            <button
              type="submit"
              className="w-full bg-natural-dark text-natural-bg py-5 rounded-3xl font-bold text-lg shadow-lg hover:opacity-90 transition-all active:scale-[0.98]"
            >
              Mulai Perencanaan
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  const NavItem = ({ id, icon, label }: { id: ActiveView, icon: React.ReactNode, label: string }) => {
    const isActive = activeView === id;
    return (
      <button 
        onClick={() => setActiveView(id)}
        className={`flex flex-col items-center gap-1 transition-all ${isActive ? 'text-natural-primary' : 'text-natural-secondary opacity-40 hover:opacity-100'}`}
      >
        <div className={`w-1.5 h-1.5 rounded-full transition-all ${isActive ? 'bg-natural-primary scale-100' : 'bg-transparent scale-0'}`}></div>
        {isActive ? icon : React.cloneElement(icon as React.ReactElement, { size: 24 })}
        <span className="text-[10px] font-bold uppercase tracking-widest">{label}</span>
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-natural-bg pb-32">
      <header className="p-8 flex justify-between items-center max-w-md mx-auto">
        <div>
          <h1 className="text-2xl font-serif italic text-natural-primary leading-none">SmartWallet</h1>
          <p className="text-[10px] uppercase tracking-widest text-natural-secondary font-bold mt-1">
            {activeView === 'home' ? "Today's Overview" : activeView}
          </p>
        </div>
        <button 
          onClick={() => setIncome(0)} 
          className="w-12 h-12 rounded-full bg-natural-light flex items-center justify-center border-2 border-natural-border text-natural-primary hover:opacity-80 transition-opacity"
        >
          <Settings size={20} />
        </button>
      </header>

      <main className="max-w-md mx-auto px-6">
        <AnimatePresence mode="wait">
          {renderView()}
        </AnimatePresence>
      </main>

      <div className="fixed bottom-10 left-0 right-0 flex justify-center pointer-events-none">
        <button
          onClick={() => setIsModalOpen(true)}
          className="pointer-events-auto h-16 w-16 bg-natural-dark text-natural-bg rounded-full flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all z-40"
        >
          <Plus size={32} />
        </button>
      </div>

      <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-natural-border px-8 py-3 flex justify-between items-center max-w-md mx-auto shadow-lg z-30">
        <NavItem id="home" icon={<LayoutDashboard size={20} />} label="Home" />
        <NavItem id="planner" icon={<CalendarRange size={20} />} label="Planner" />
        <div className="w-12 h-12" />
        <NavItem id="history" icon={<History size={20} />} label="History" />
        <NavItem id="insights" icon={<Sparkles size={20} />} label="Insights" />
      </nav>

      <AddExpenseModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
