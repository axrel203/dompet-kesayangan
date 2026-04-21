import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { X, Utensils, ShoppingBag, Car, Film, Home, HeartPulse, BookOpen, MoreHorizontal, Wallet, Coffee, Coins } from 'lucide-react';
import { formatCurrency } from '../utils/format';

const ICON_MAP = {
  Utensils: <Utensils size={24} />,
  Coffee: <Coffee size={24} />,
  ShoppingBag: <ShoppingBag size={24} />,
  Car: <Car size={24} />,
  Film: <Film size={24} />,
  Home: <Home size={24} />,
  HeartPulse: <HeartPulse size={24} />,
  BookOpen: <BookOpen size={24} />,
  MoreHorizontal: <MoreHorizontal size={24} />,
  Wallet: <Wallet size={24} />,
  Coins: <Coins size={24} />
};

const AddTransaction = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialType = searchParams.get('type') === 'income' ? 'income' : 'expense';
  
  const { categories, addTransaction } = useStore();
  const [type, setType] = useState(initialType);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(() => {
    return categories.find(c => c.type === initialType && c.id !== 'savings_out')?.id || categories[0].id;
  });
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSave = () => {
    if (!amount) return;
    const cat = categories.find(c => c.id === selectedCategory);
    addTransaction({
      id: Date.now().toString(),
      type,
      title: cat.name,
      subtitle: description || ('Kategori: ' + cat.name),
      amount: parseInt(amount.replace(/\D/g, '') || '0', 10),
      date: new Date(date).toISOString(),
      categoryId: selectedCategory
    });
    navigate(-1);
  };

  const handleAmountChange = (e) => {
    const val = e.target.value.replace(/\D/g, '');
    setAmount(val);
  };

  return (
    <div className="flex-col" style={{ minHeight: '100vh', backgroundColor: 'var(--color-surface)', margin: '-20px', padding: '20px' }}>
      <div className="flex items-center justify-between" style={{ marginBottom: '32px' }}>
        <button onClick={() => navigate(-1)} style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--color-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <X size={20} />
        </button>
        <h2 style={{ fontSize: '18px', fontWeight: '600' }}>Tambah Transaksi</h2>
        <div style={{ width: '40px' }} />
      </div>

      <div style={{ display: 'flex', backgroundColor: 'var(--color-bg)', borderRadius: '24px', padding: '4px', marginBottom: '32px' }}>
        <button 
          onClick={() => {
            setType('expense');
            setSelectedCategory(categories.find(c => c.type === 'expense' && c.id !== 'savings_out')?.id);
          }}
          style={{ flex: 1, padding: '12px', borderRadius: '20px', fontWeight: '600', backgroundColor: type === 'expense' ? 'var(--color-primary)' : 'transparent', color: type === 'expense' ? 'white' : 'var(--color-text-muted)' }}
        >
          Pengeluaran
        </button>
        <button 
          onClick={() => {
            setType('income');
            setSelectedCategory(categories.find(c => c.type === 'income')?.id);
          }}
          style={{ flex: 1, padding: '12px', borderRadius: '20px', fontWeight: '600', backgroundColor: type === 'income' ? 'var(--color-primary)' : 'transparent', color: type === 'income' ? 'white' : 'var(--color-text-muted)' }}
        >
          Pemasukan
        </button>
      </div>

      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <p className="text-muted" style={{ fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>Jumlah Nominal</p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '16px' }}>
          <span style={{ fontSize: '24px', fontWeight: '500' }}>Rp</span>
          <input 
            type="text" 
            value={amount ? parseInt(amount, 10).toLocaleString('id-ID') : '0'}
            onChange={handleAmountChange}
            style={{ fontSize: '44px', fontWeight: '600', width: '320px', textAlign: 'center', border: 'none', outline: 'none', backgroundColor: 'transparent', color: amount ? 'var(--color-text-main)' : 'var(--color-border)' }}
          />
        </div>
      </div>

      <p className="text-muted" style={{ fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>Kategori</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px' }}>
        {categories.filter(c => c.type === type && c.id !== 'savings_out').map(c => (
          <div 
            key={c.id} 
            onClick={() => setSelectedCategory(c.id)}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
          >
            <div style={{ 
              width: '56px', height: '56px', borderRadius: '16px', 
              backgroundColor: selectedCategory === c.id ? 'var(--color-primary)' : 'var(--color-bg)', 
              color: selectedCategory === c.id ? 'white' : 'var(--color-text-main)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: selectedCategory === c.id ? '0 4px 12px rgba(0,0,0,0.1)' : 'none',
              transition: 'all 0.2s'
            }}>
              {ICON_MAP[c.icon]}
            </div>
            <span style={{ fontSize: '12px', fontWeight: '500', color: selectedCategory === c.id ? 'var(--color-text-main)' : 'var(--color-text-muted)' }}>{c.name}</span>
          </div>
        ))}
      </div>

      <div style={{ marginBottom: '24px' }}>
        <p className="text-muted" style={{ fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>Deskripsi (Opsional)</p>
        <input 
          type="text" 
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Tambahkan catatan..."
          style={{ width: '100%', padding: '16px', borderRadius: '16px', border: '1px solid var(--color-border)', fontSize: '16px', outline: 'none', backgroundColor: 'transparent' }}
        />
      </div>

      <div style={{ marginBottom: '32px' }}>
        <input 
          type="date" 
          value={date}
          onChange={(e) => setDate(e.target.value)}
          style={{ width: '100%', padding: '16px', borderRadius: '16px', border: '1px solid var(--color-border)', fontSize: '16px', outline: 'none' }}
        />
      </div>

      <button onClick={handleSave} className="btn btn-primary" style={{ width: '100%', padding: '16px', fontSize: '16px' }}>
        Simpan Transaksi
      </button>
    </div>
  );
};

export default AddTransaction;
