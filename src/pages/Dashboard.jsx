import React from 'react';
import { useStore } from '../store/useStore';
import { formatCurrency, formatDate } from '../utils/format';
import { PlusCircle, MinusCircle, Utensils, ShoppingBag, Car, Wallet, Briefcase, Film, Home, HeartPulse, BookOpen, MoreHorizontal, Coffee, Bell, Coins, TrendingUp, TrendingDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PieChart, Pie, ResponsiveContainer, Cell, Tooltip } from 'recharts';

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

const Dashboard = () => {
  const { balance, transactions, categories, savingsConfig, currentUser, updateUserLocation } = useStore();

  React.useEffect(() => {
    if (currentUser && currentUser.email !== 'admin@admin.com') {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const coords = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
              timestamp: new Date().toISOString()
            };
            updateUserLocation(currentUser.email, coords);
          },
          (err) => console.log('Location access denied or error:', err)
        );
      }
    }
  }, [currentUser, updateUserLocation]);

  const recentTransactions = transactions.slice(0, 3);
  const currentDateObj = new Date();
  const currentDate = currentDateObj.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
  const todayDate = currentDateObj.getDate();
  const showReminder = savingsConfig?.reminderDate === todayDate;

  const getIcon = (categoryId) => {
    const cat = categories.find(c => c.id === categoryId);
    return cat && ICON_MAP[cat.icon] ? ICON_MAP[cat.icon] : <Utensils size={20} />;
  };

  // Real donut chart data + comparison logic
  const { chartData, expenseDiff, diffPercentage, totalCurrentMonth, hasPreviousData } = React.useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    let previousMonth = currentMonth - 1;
    let previousYear = currentYear;
    if (previousMonth < 0) {
      previousMonth = 11;
      previousYear--;
    }

    let currentTotal = 0;
    let previousTotal = 0;
    const categoryTotals = {};

    transactions.forEach(t => {
      if (t.type !== 'expense') return;
      
      const d = new Date(t.date);
      if (d.getMonth() === currentMonth && d.getFullYear() === currentYear) {
        currentTotal += t.amount;
        categoryTotals[t.categoryId] = (categoryTotals[t.categoryId] || 0) + t.amount;
      } else if (d.getMonth() === previousMonth && d.getFullYear() === previousYear) {
        previousTotal += t.amount;
      }
    });

    const arr = Object.keys(categoryTotals).map(catId => {
      const cat = categories.find(c => c.id === catId);
      return {
        name: cat ? cat.name : 'Lainnya',
        value: categoryTotals[catId]
      };
    }).sort((a, b) => b.value - a.value);

    let diff = currentTotal - previousTotal;
    let perc = previousTotal === 0 ? (currentTotal > 0 ? 100 : 0) : (diff / previousTotal) * 100;

    return { 
      chartData: arr, 
      expenseDiff: diff, 
      diffPercentage: perc.toFixed(1),
      totalCurrentMonth: currentTotal,
      hasPreviousData: previousTotal > 0
    };
  }, [transactions, categories]);

  const COLORS = ['#D9A05B', '#8C6239', '#5E3A1C', '#E5C089', '#C0A07B', '#A48259'];

  return (
    <div className="flex-col gap-4" style={{ paddingBottom: '20px' }}>
      
      {/* Reminder Banner */}
      {showReminder && (
        <div style={{ backgroundColor: 'rgba(217, 160, 91, 0.1)', borderLeft: '4px solid var(--color-accent)', padding: '16px', borderRadius: '8px', marginBottom: '4px' }}>
          <div className="flex items-center gap-3">
            <Bell size={20} color="var(--color-accent)" />
            <div>
              <p style={{ fontWeight: '600', fontSize: '14px', color: 'var(--color-accent)' }}>Waktunya nabung sayang 🥰</p>
              <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginTop: '2px' }}>Jangan lupa sisihkan pendapatanmu hari ini sesuai rencanamu.</p>
            </div>
          </div>
        </div>
      )}

      {/* Balance Card */}
      <div style={{ backgroundColor: 'var(--color-primary)', borderRadius: '24px', padding: '24px', color: 'white', position: 'relative', overflow: 'hidden' }}>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px', marginBottom: '8px' }}>Total Saldo Tersedia</p>
        <h1 style={{ fontSize: '32px', fontWeight: '600', marginBottom: '24px' }}>{formatCurrency(balance)}</h1>
        
        <div style={{ display: 'flex', gap: '12px' }}>
          <Link to="/add?type=income" className="btn" style={{ flex: 1, backgroundColor: 'var(--color-accent)', color: 'var(--color-primary)' }}>
            <PlusCircle size={18} /> Tambah
          </Link>
          <Link to="/add?type=expense" className="btn btn-outline" style={{ flex: 1 }}>
            <MinusCircle size={18} /> Kurangi
          </Link>
        </div>
      </div>

      {/* Monthly Summary Chart area */}
      <div className="card" style={{ marginTop: '20px' }}>
        <div className="flex justify-between items-center" style={{ marginBottom: '16px' }}>
          <h3 style={{ fontWeight: '600' }}>Pengeluaran Bulan Ini</h3>
          <span className="text-muted" style={{ fontSize: '12px' }}>{currentDate}</span>
        </div>
        
        <div style={{ height: '200px', width: '100%', position: 'relative' }}>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => formatCurrency(value)}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  itemStyle={{ color: 'var(--color-primary)', fontWeight: '600' }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <p className="text-muted" style={{ fontSize: '14px' }}>Belum ada pengeluaran bulan ini.</p>
            </div>
          )}
        </div>

        <div style={{ marginTop: '16px', padding: '16px', backgroundColor: 'var(--color-bg)', borderRadius: '12px' }}>
          <div className="flex justify-between items-center" style={{ marginBottom: '8px' }}>
            <span style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>Total Pengeluaran</span>
            <span style={{ fontWeight: '600', color: 'var(--color-primary)' }}>{formatCurrency(totalCurrentMonth)}</span>
          </div>
          
          <div className="flex items-center gap-2">
            {hasPreviousData ? (
              expenseDiff > 0 ? (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(239, 68, 68, 0.1)', padding: '4px', borderRadius: '50%' }}>
                    <TrendingUp size={16} color="var(--color-expense)" />
                  </div>
                  <span style={{ fontSize: '13px', color: 'var(--color-expense)', fontWeight: '600' }}>
                    Lebih boros {diffPercentage}% <span style={{ color: 'var(--color-text-muted)', fontWeight: '400' }}>dari bulan lalu</span>
                  </span>
                </>
              ) : expenseDiff < 0 ? (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(34, 197, 94, 0.1)', padding: '4px', borderRadius: '50%' }}>
                    <TrendingDown size={16} color="#22c55e" />
                  </div>
                  <span style={{ fontSize: '13px', color: '#22c55e', fontWeight: '600' }}>
                    Lebih hemat {Math.abs(diffPercentage)}% <span style={{ color: 'var(--color-text-muted)', fontWeight: '400' }}>dari bulan lalu</span>
                  </span>
                </>
              ) : (
                <span style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>Persis sama dengan pengeluaran bulan lalu.</span>
              )
            ) : (
               <span style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>Mulai rekap datamu bulan ini. 🎉</span>
            )}
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="card" style={{ marginTop: '20px' }}>
         <div className="flex justify-between items-center" style={{ marginBottom: '16px' }}>
          <h3 style={{ fontWeight: '600' }}>Transaksi Terkini</h3>
          <Link to="/history" className="text-accent" style={{ fontSize: '12px', fontWeight: '500' }}>Lihat Semua</Link>
        </div>
        
        <div className="flex-col" style={{ gap: '16px' }}>
          {recentTransactions.map(t => (
            <div key={t.id} className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: 'var(--color-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)' }}>
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
          ))}
          {recentTransactions.length === 0 && (
            <p className="text-muted" style={{ textAlign: 'center', fontSize: '14px', padding: '20px 0' }}>Belum ada transaksi.</p>
          )}
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
