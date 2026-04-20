import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { formatCurrency, formatDate } from '../utils/format';
import { Utensils, ShoppingBag, Car, Wallet, Briefcase, Film, Home, HeartPulse, BookOpen, MoreHorizontal, Coffee, Coins } from 'lucide-react';

const ICON_MAP = {
  Utensils: <Utensils size={20} />,
  Coffee: <Coffee size={20} />,
  ShoppingBag: <ShoppingBag size={20} />,
  Car: <Car size={20} />,
  Wallet: <Wallet size={20} />,
  Briefcase: <Briefcase size={20} />,
  Film: <Film size={20} />,
  Home: <Home size={20} />,
  HeartPulse: <HeartPulse size={20} />,
  BookOpen: <BookOpen size={20} />,
  MoreHorizontal: <MoreHorizontal size={20} />,
  Coins: <Coins size={20} />,
};

const History = () => {
  const { transactions, categories } = useStore();
  const [filter, setFilter] = useState('Semua');

  const getIcon = (categoryId) => {
    const cat = categories.find(c => c.id === categoryId);
    return cat && ICON_MAP[cat.icon] ? ICON_MAP[cat.icon] : <Utensils size={20} />;
  };

  return (
    <div className="flex-col gap-4">
      <h2 style={{ fontSize: '24px', fontWeight: '600' }}>Riwayat</h2>
      
      <div style={{ backgroundColor: 'var(--color-surface)', borderRadius: '12px', padding: '8px 12px', display: 'flex', alignItems: 'center', boxShadow: 'var(--shadow-sm)' }}>
        <input 
          type="text" 
          placeholder="Cari transaksi..." 
          style={{ border: 'none', outline: 'none', width: '100%', fontSize: '14px', backgroundColor: 'transparent' }} 
        />
      </div>

      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px', WebkitOverflowScrolling: 'touch' }}>
        {['Semua', 'Pengeluaran', 'Pemasukan', 'Tabungan'].map(f => (
          <button 
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: '8px 16px',
              borderRadius: '20px',
              backgroundColor: filter === f ? 'var(--color-primary)' : 'var(--color-bg)',
              color: filter === f ? 'white' : 'var(--color-text-muted)',
              fontSize: '14px',
              fontWeight: filter === f ? '600' : '500',
              border: filter === f ? 'none' : '1px solid var(--color-border)',
              whiteSpace: 'nowrap'
            }}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="flex-col" style={{ gap: '16px', marginTop: '16px' }}>
        {transactions
          .filter(t => {
            if (filter === 'Semua') return true;
            if (filter === 'Pemasukan') return t.type === 'income';
            if (filter === 'Tabungan') return t.categoryId === 'savings_out';
            if (filter === 'Pengeluaran') return t.type === 'expense' && t.categoryId !== 'savings_out';
            return false;
          })
          .map(t => {
            const isTabungan = t.categoryId === 'savings_out';
            return (
              <div key={t.id} className="card flex justify-between items-center" style={{ padding: '16px', borderLeft: isTabungan ? '4px solid var(--color-accent)' : 'none' }}>
                <div className="flex items-center gap-3">
                  <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: isTabungan ? 'rgba(217, 160, 91, 0.1)' : 'var(--color-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: isTabungan ? 'var(--color-accent)' : 'var(--color-primary)' }}>
                    {getIcon(t.categoryId)}
                  </div>
                  <div>
                    <p style={{ fontWeight: '600', fontSize: '14px' }}>{t.title}</p>
                    <p className="text-muted" style={{ fontSize: '12px' }}>{formatDate(t.date)} • {t.subtitle}</p>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontWeight: '600', fontSize: '14px', color: t.type === 'income' ? 'var(--color-income)' : (t.type === 'transfer' ? 'var(--color-text)' : 'var(--color-expense)') }}>
                    {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                  </p>
                </div>
              </div>
            );
        })}
      </div>
    </div>
  );
};

export default History;
