import React from 'react';
import { useStore } from '../store/useStore';
import { formatCurrency } from '../utils/format';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const Insights = () => {
  const { transactions, categories } = useStore();
  
  const expenses = transactions.filter(t => t.type === 'expense');
  const incomes = transactions.filter(t => t.type === 'income');
  
  const totalExpense = expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const totalIncome = incomes.reduce((acc, curr) => acc + curr.amount, 0);

  // Group by category (Expenses)
  const categoryData = expenses.reduce((acc, curr) => {
    const cat = categories.find(c => c.id === curr.categoryId);
    const labelName = cat ? cat.name : curr.categoryId;
    const existing = acc.find(item => item.name === labelName);
    if(existing) {
      existing.value += curr.amount;
    } else {
      acc.push({ name: labelName, value: curr.amount });
    }
    return acc;
  }, []);

  // Group by category (Incomes)
  const incomeCategoryData = incomes.reduce((acc, curr) => {
    const cat = categories.find(c => c.id === curr.categoryId);
    const labelName = cat ? cat.name : curr.categoryId;
    const existing = acc.find(item => item.name === labelName);
    if(existing) {
      existing.value += curr.amount;
    } else {
      acc.push({ name: labelName, value: curr.amount });
    }
    return acc;
  }, []);

  const COLORS = ['#3f2d20', '#d9a05b', '#e5e5e5', '#a8a29e'];
  const INCOME_COLORS = ['#d9a05b', '#3f2d20', '#a8a29e', '#e5e5e5'];
  const currentDate = new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });

  return (
    <div className="flex-col gap-4">
      <h2 style={{ fontSize: '24px', fontWeight: '600' }}>Wawasan Keuangan</h2>
      <p className="text-muted" style={{ fontSize: '14px', marginBottom: '16px' }}>Analisis pengeluaran dan pemasukan Anda.</p>
      
      {/* EXPESENSES CARD */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '32px 20px', marginBottom: '16px' }}>
        <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div>
            <p className="text-muted" style={{ fontSize: '13px', fontWeight: '600', textTransform: 'uppercase' }}>Total Pengeluaran</p>
          </div>
          <div style={{ textAlign: 'right' }}>
             <h3 style={{ fontSize: '20px', fontWeight: '600' }}>{formatCurrency(totalExpense)}</h3>
          </div>
        </div>

        <div style={{ width: '200px', height: '200px', position: 'relative' }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip 
                formatter={(value) => formatCurrency(value)} 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              />
              <Pie
                data={categoryData}
                innerRadius={70}
                outerRadius={90}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`expense-cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', pointerEvents: 'none' }}>
            <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--color-text-muted)' }}>{currentDate}</span>
          </div>
        </div>

        {/* Custom Legend */}
        <div style={{ width: '100%', marginTop: '32px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {categoryData.length > 0 ? categoryData.map((entry, index) => (
             <div key={entry.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                   <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: COLORS[index % COLORS.length] }} />
                   <span style={{ fontSize: '14px', fontWeight: '500' }}>{entry.name}</span>
                </div>
                <span style={{ fontSize: '14px', fontWeight: '600' }}>{formatCurrency(entry.value)}</span>
             </div>
          )) : (
            <p className="text-muted" style={{ textAlign: 'center', fontSize: '14px' }}>Belum ada data pengeluaran.</p>
          )}
        </div>
      </div>

      {/* INCOME CARD */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '32px 20px', marginBottom: '24px' }}>
        <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div>
            <p className="text-muted" style={{ fontSize: '13px', fontWeight: '600', textTransform: 'uppercase' }}>Total Pemasukan</p>
          </div>
          <div style={{ textAlign: 'right' }}>
             <h3 style={{ fontSize: '20px', fontWeight: '600' }}>{formatCurrency(totalIncome)}</h3>
          </div>
        </div>

        <div style={{ width: '200px', height: '200px', position: 'relative' }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip 
                formatter={(value) => formatCurrency(value)} 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              />
              <Pie
                data={incomeCategoryData}
                innerRadius={70}
                outerRadius={90}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {incomeCategoryData.map((entry, index) => (
                  <Cell key={`income-cell-${index}`} fill={INCOME_COLORS[index % INCOME_COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', pointerEvents: 'none' }}>
            <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--color-text-muted)' }}>{currentDate}</span>
          </div>
        </div>

        {/* Custom Legend */}
        <div style={{ width: '100%', marginTop: '32px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {incomeCategoryData.length > 0 ? incomeCategoryData.map((entry, index) => (
             <div key={entry.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                   <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: INCOME_COLORS[index % INCOME_COLORS.length] }} />
                   <span style={{ fontSize: '14px', fontWeight: '500' }}>{entry.name}</span>
                </div>
                <span style={{ fontSize: '14px', fontWeight: '600' }}>{formatCurrency(entry.value)}</span>
             </div>
          )) : (
            <p className="text-muted" style={{ textAlign: 'center', fontSize: '14px' }}>Belum ada data pemasukan.</p>
          )}
        </div>
      </div>

    </div>
  );
};

export default Insights;
