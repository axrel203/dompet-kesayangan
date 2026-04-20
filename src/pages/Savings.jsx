import React, { useState, useMemo } from 'react';
import { useStore } from '../store/useStore';
import { formatCurrency, formatDate } from '../utils/format';
import { Coins, PlusCircle, Target, Bell, TrendingUp, Calendar, Trash2 } from 'lucide-react';
import { BarChart, Bar, ResponsiveContainer, Cell, Tooltip, XAxis, Legend } from 'recharts';

const Savings = () => {
  const { 
    savingsGoals, 
    savingsRecords, 
    savingsConfig, 
    transactions,
    addSavingsGoal, 
    deleteSavingsGoal,
    addSavingsRecordToGoal,
    updateSavingsConfig
  } = useStore();
  
  const [activeTab, setActiveTab] = useState('goals'); // 'goals', 'stats', 'config'
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [goalForm, setGoalForm] = useState({ title: '', category: 'Jangka Pendek', targetAmount: '', autoSaveAmount: '' });
  
  const [showAddRecord, setShowAddRecord] = useState(null); // id of goal interacting
  const [recordForm, setRecordForm] = useState({ amount: '', title: '' });
  
  const CATEGORIES = ['Jangka Pendek', 'Jangka Panjang', 'Dana Darurat'];

  // Handle Goal form Calculate ETA
  const targetNum = Number(goalForm.targetAmount.replace(/[^0-9]/g, '')) || 0;
  const autoSaveNum = Number(goalForm.autoSaveAmount.replace(/[^0-9]/g, '')) || 0;
  const etaMonths = autoSaveNum > 0 ? Math.ceil(targetNum / autoSaveNum) : 0;

  const handleCreateGoal = (e) => {
    e.preventDefault();
    if (targetNum > 0 && goalForm.title) {
      addSavingsGoal({
        id: Date.now().toString(),
        title: goalForm.title,
        category: goalForm.category,
        targetAmount: targetNum,
        autoSaveAmount: autoSaveNum,
        estimatedMonths: etaMonths
      });
      setShowAddGoal(false);
      setGoalForm({ title: '', category: 'Jangka Pendek', targetAmount: '', autoSaveAmount: '' });
    }
  };

  const handleAddRecord = (e, goalId) => {
    e.preventDefault();
    const amount = Number(recordForm.amount.replace(/[^0-9]/g, ''));
    if (amount > 0 && recordForm.title) {
      addSavingsRecordToGoal({
        id: Date.now().toString(),
        goalId,
        amount,
        title: recordForm.title,
        type: 'manual',
        date: new Date().toISOString()
      });
      setShowAddRecord(null);
      setRecordForm({ amount: '', title: '' });
    }
  };

  const handleSaveConfig = (e) => {
    e.preventDefault();
    const rd = e.target.reminderDate.value;
    updateSavingsConfig({ reminderDate: Number(rd) });
    alert('Pengingat berhasil disimpan!');
  };

  const chartData = useMemo(() => {
    const data = [];
    const _now = new Date();
    for(let i=5; i>=0; i--) {
      const d = new Date(_now.getFullYear(), _now.getMonth() - i, 1);
      const mName = d.toLocaleDateString('id-ID', { month: 'short' });
      
      let savingsOut = 0;
      let otherOut = 0;
      transactions.forEach(t => {
        const txDate = new Date(t.date);
        if(txDate.getMonth() === d.getMonth() && txDate.getFullYear() === d.getFullYear()) {
          // Both are considered "outflows" from the main balance but we distinguish them
          if(t.type === 'expense') {
             otherOut += t.amount;
          } else if (t.type === 'transfer' && t.categoryId === 'savings_out') {
             savingsOut += t.amount;
          }
        }
      });
      data.push({ name: mName, Tabungan: savingsOut, 'Pengeluaran Lain': otherOut });
    }
    return data;
  }, [transactions]);

  const totalSavedAllTime = savingsGoals?.reduce((acc, curr) => acc + (curr.currentAmount || 0), 0) || 0;

  const modernInputStyle = {
    width: '100%',
    padding: '12px 0',
    border: 'none',
    borderBottom: '1px solid var(--color-border)',
    outline: 'none',
    backgroundColor: 'transparent',
    fontSize: '14px',
    color: 'var(--color-text)',
    transition: 'border-color 0.2s',
  };

  const modernLabelStyle = {
    fontSize: '12px',
    color: 'var(--color-text-muted)',
    marginBottom: '4px',
    display: 'block',
    fontWeight: '500'
  };

  return (
    <div className="flex-col gap-4" style={{ paddingBottom: '20px' }}>
      
      {/* Header Banner */}
      <div className="card" style={{ backgroundColor: 'var(--color-primary)', color: 'white', border: 'none' }}>
        <div className="flex items-center gap-3">
          <div style={{ backgroundColor: 'rgba(255,255,255,0.1)', padding: '10px', borderRadius: '12px' }}>
            <Coins size={24} color="var(--color-accent)" />
          </div>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: '600' }}>Tabungan Pintar</h2>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px' }}>Total Saldo: {formatCurrency(totalSavedAllTime)}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex" style={{ gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
        <button onClick={()=>setActiveTab('goals')} className={`btn ${activeTab==='goals'?'btn-primary':'btn-outline'}`} style={{ flex: 1, padding: '10px', fontSize: '13px' }}>
          <Target size={16} /> TargetKu
        </button>
        <button onClick={()=>setActiveTab('stats')} className={`btn ${activeTab==='stats'?'btn-primary':'btn-outline'}`} style={{ flex: 1, padding: '10px', fontSize: '13px' }}>
          <TrendingUp size={16} /> Statistik
        </button>
        <button onClick={()=>setActiveTab('config')} className={`btn ${activeTab==='config'?'btn-primary':'btn-outline'}`} style={{ flex: 1, padding: '10px', fontSize: '13px' }}>
          <Bell size={16} /> Pengingat
        </button>
      </div>

      {/* Tab: Goals */}
      {activeTab === 'goals' && (
        <div className="flex-col gap-4">
          <button onClick={() => setShowAddGoal(!showAddGoal)} className="btn btn-primary" style={{ width: '100%', border: '2px dashed var(--color-accent)', backgroundColor: 'transparent', color: 'var(--color-text)' }}>
            <PlusCircle size={18} /> {showAddGoal ? 'Batal Tambah' : 'Buat Target Baru'}
          </button>

          {showAddGoal && (
            <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '16px', border: '1px solid var(--color-border)', boxShadow: '0 8px 24px rgba(0,0,0,0.04)' }}>
              <h3 style={{ marginBottom: '24px', fontWeight: '600', fontSize: '18px', color: 'var(--color-primary)' }}>Rencana Target Baru</h3>
              
              <form onSubmit={handleCreateGoal} className="flex-col gap-4">
                <div className="flex gap-4">
                  <div style={{ flex: 1 }}>
                    <label style={modernLabelStyle}>Nama Target</label>
                    <input type="text" style={modernInputStyle} placeholder="Cth: Liburan ke Bali" value={goalForm.title} onChange={e => setGoalForm({...goalForm, title: e.target.value})} required />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={modernLabelStyle}>Kategori</label>
                    <select style={{...modernInputStyle, padding: '11px 0'}} value={goalForm.category} onChange={e => setGoalForm({...goalForm, category: e.target.value})}>
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label style={modernLabelStyle}>Target Nominal (Rp)</label>
                  <input type="text" style={modernInputStyle} placeholder="Cth: 5000000" value={goalForm.targetAmount} onChange={e => setGoalForm({...goalForm, targetAmount: e.target.value})} required />
                </div>
                
                <div style={{ backgroundColor: 'rgba(217, 160, 91, 0.05)', padding: '16px', borderRadius: '12px', marginTop: '8px' }}>
                  <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-primary)' }}>⚙️ Auto-Planning (Opsi)</label>
                  <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '12px' }}>Masukkan jumlah uang yang ingin ditabung tiap bulannya</p>
                  
                  <label style={modernLabelStyle}>Rencana Nabung (Rp)</label>
                  <input type="text" style={modernInputStyle} placeholder="Cth: 1000000" value={goalForm.autoSaveAmount} onChange={e => setGoalForm({...goalForm, autoSaveAmount: e.target.value})} />
                  
                  {etaMonths > 0 && (
                    <div style={{ marginTop: '16px', padding: '12px', backgroundColor: 'var(--color-primary)', borderRadius: '8px', fontSize: '13px', color: '#fff', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Target size={16} color="var(--color-accent)" />
                      Target tercapai dalam ± {etaMonths} bulan
                    </div>
                  )}
                </div>
                
                <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '8px', padding: '14px', borderRadius: '12px' }}>Simpan Target</button>
              </form>
            </div>
          )}

          {/* Goals List */}
          {(!savingsGoals || savingsGoals.length === 0) ? (
             <p className="text-muted" style={{ textAlign: 'center', padding: '20px 0', fontSize: '14px' }}>Belum ada target tabungan bulan ini.</p>
          ) : (
            savingsGoals.map(goal => {
              const progress = goal.targetAmount > 0 ? Math.min((goal.currentAmount / goal.targetAmount) * 100, 100) : 0;
              return (
                <div key={goal.id} className="card">
                  <div className="flex justify-between items-start" style={{ marginBottom: '16px' }}>
                    <div>
                      <div className="flex items-center gap-2" style={{ marginBottom: '8px' }}>
                        <span style={{ fontSize: '11px', backgroundColor: 'var(--color-bg)', padding: '4px 10px', borderRadius: '12px', fontWeight: '600', color: 'var(--color-text-muted)' }}>{goal.category}</span>
                        {goal.estimatedMonths && <span style={{ fontSize: '11px', backgroundColor: 'rgba(217, 160, 91, 0.1)', color: 'var(--color-accent)', padding: '4px 10px', borderRadius: '12px', fontWeight: '600' }}>Estimasi: {goal.estimatedMonths} Bln</span>}
                      </div>
                      <h3 style={{ fontWeight: '600', fontSize: '18px', color: 'var(--color-primary)' }}>{goal.title}</h3>
                    </div>
                    <button onClick={() => deleteSavingsGoal(goal.id)} style={{ color: 'var(--color-expense)', padding: '8px', backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }}>
                      <Trash2 size={18} />
                    </button>
                  </div>
                  
                  <div style={{ marginBottom: '16px' }}>
                    <div className="flex justify-between" style={{ fontSize: '13px', marginBottom: '8px' }}>
                      <span style={{ color: 'var(--color-text-muted)' }}>Terkumpul: <b>{formatCurrency(goal.currentAmount || 0)}</b></span>
                      <span style={{ fontWeight: '600', color: 'var(--color-primary)' }}>{formatCurrency(goal.targetAmount)}</span>
                    </div>
                    <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--color-bg)', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: `${progress}%`, height: '100%', backgroundColor: 'var(--color-accent)', borderRadius: '4px', transition: 'width 0.5s ease' }} />
                    </div>
                    <p style={{ textAlign: 'right', fontSize: '12px', marginTop: '8px', color: 'var(--color-accent)', fontWeight: '600' }}>
                      {progress.toFixed(1)}% Tercapai
                    </p>
                  </div>

                  {showAddRecord === goal.id ? (
                    <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '16px', marginTop: '16px', border: '1px solid var(--color-border)', boxShadow: '0 4px 16px rgba(0,0,0,0.04)' }}>
                      <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '20px', color: 'var(--color-primary)' }}>Transfer ke Tabungan</h4>
                      <form onSubmit={(e) => handleAddRecord(e, goal.id)} className="flex-col gap-4">
                        <div className="flex gap-4">
                          <div style={{ flex: 1 }}>
                            <label style={modernLabelStyle}>Nominal Transfer (Rp)</label>
                            <input type="text" style={modernInputStyle} placeholder="100000" value={recordForm.amount} onChange={e=>setRecordForm({...recordForm, amount: e.target.value})} required autoFocus />
                          </div>
                          <div style={{ flex: 1 }}>
                            <label style={modernLabelStyle}>Keterangan</label>
                            <input type="text" style={modernInputStyle} placeholder="Cth: Sisa dana" value={recordForm.title} onChange={e=>setRecordForm({...recordForm, title: e.target.value})} required />
                          </div>
                        </div>
                        <div className="flex gap-3" style={{ marginTop: '12px' }}>
                          <button type="button" onClick={() => setShowAddRecord(null)} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: 'none', backgroundColor: 'var(--color-bg)', color: 'var(--color-text-muted)', fontWeight: '600', cursor: 'pointer' }}>Batal</button>
                          <button type="submit" style={{ flex: 1, padding: '12px', borderRadius: '8px', border: 'none', backgroundColor: 'var(--color-primary)', color: '#fff', fontWeight: '600', cursor: 'pointer' }}>Simpan Dana</button>
                        </div>
                      </form>
                    </div>
                  ) : (
                    <button onClick={() => { setShowAddRecord(goal.id); setRecordForm({ amount: '', title: ''}); }} className="btn" style={{ width: '100%', fontSize: '14px', padding: '12px', borderRadius: '12px', backgroundColor: 'transparent', border: '1px solid var(--color-primary)', color: 'var(--color-primary)', fontWeight: '600', cursor: 'pointer' }}>
                      + Transfer ke Tabungan
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Tab: Stats */}
      {activeTab === 'stats' && (
        <div className="card">
          <h3 style={{ fontWeight: '600', marginBottom: '8px' }}>Tabungan vs Pengeluaran Lainnya</h3>
          <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginBottom: '24px', lineHeight: '1.5' }}>
            Perbandingan alokasi menabung dengan biaya konsumtif kamu tiap bulannya.
          </p>
          
          <div style={{ height: '300px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'var(--color-text-muted)' }} dy={10} />
                <Tooltip 
                  cursor={{ fill: 'transparent' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  formatter={(value) => formatCurrency(value)}
                  labelStyle={{ color: 'var(--color-text-muted)', marginBottom: '4px' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', marginTop: '10px' }} />
                <Bar dataKey="Tabungan" fill="var(--color-accent)" radius={[4, 4, 4, 4]} barSize={20} />
                <Bar dataKey="Pengeluaran Lain" fill="#e5e5e5" radius={[4, 4, 4, 4]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Tab: Config */}
      {activeTab === 'config' && (
        <div className="card">
          <div className="flex items-center gap-3" style={{ marginBottom: '24px' }}>
            <div style={{ backgroundColor: 'rgba(217, 160, 91, 0.1)', padding: '12px', borderRadius: '12px' }}>
              <Calendar size={24} color="var(--color-accent)" />
            </div>
            <div>
              <h3 style={{ fontWeight: '600', fontSize: '16px' }}>Pengingat Menabung</h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '13px' }}>Setel otomatis tanggal notifikasi</p>
            </div>
          </div>
          
          <form onSubmit={handleSaveConfig} className="flex-col gap-4">
            <div>
              <label style={modernLabelStyle}>Tanggal Pengingat (1-31)</label>
              <input 
                name="reminderDate"
                type="number" 
                min="1" max="31"
                style={modernInputStyle}
                defaultValue={savingsConfig?.reminderDate || 1}
                required
              />
            </div>
            <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', lineHeight: '1.5' }}>
              Kami akan menampilkan notifikasi romantis tiap bulan pada tanggal ini untuk mengingatkan kamu menyisihkan tabungan sayang 🥰.
            </p>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '8px', padding: '14px', borderRadius: '12px' }}>Simpan Pengaturan</button>
          </form>
        </div>
      )}

    </div>
  );
};

export default Savings;
