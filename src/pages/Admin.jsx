import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { formatCurrency, formatDate } from '../utils/format';
import { Users, ChevronDown, ChevronUp, MapPin } from 'lucide-react';

const Admin = () => {
  const { users, currentUser } = useStore();
  const [expandedUser, setExpandedUser] = useState(null);
  
  if (currentUser?.email !== 'admin@admin.com') {
    return <div style={{ padding: '20px', textAlign: 'center' }}>Akses Ditolak</div>;
  }

  // Cukup tampilkan user biasa di list admin
  const standardUsers = users.filter(u => u.email !== 'admin@admin.com');

  const toggleUser = (email) => {
    if (expandedUser === email) setExpandedUser(null);
    else setExpandedUser(email);
  };

  return (
    <div className="flex-col gap-4" style={{ paddingBottom: '32px' }}>
      <h2 style={{ fontSize: '24px', fontWeight: '600' }}>Panel Admin</h2>
      <p className="text-muted" style={{ fontSize: '14px', marginBottom: '16px' }}>Pantau transaksi lengkap, pemasukan, pengeluaran & rincian.</p>

      <div className="flex-col" style={{ gap: '16px' }}>
        {standardUsers.map(u => {
          const totalExpense = u.transactions
            .filter(t => t.type === 'expense')
            .reduce((acc, curr) => acc + curr.amount, 0);

          const totalIncome = u.transactions
            .filter(t => t.type === 'income')
            .reduce((acc, curr) => acc + curr.amount, 0);

          const totalSavings = u.savingsGoals?.reduce((acc, curr) => acc + (curr.currentAmount || 0), 0) || 0;

          const isExpanded = expandedUser === u.email;

          return (
            <div key={u.email} className="card" style={{ padding: '0', overflow: 'hidden' }}>
              <div 
                onClick={() => toggleUser(u.email)}
                style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
              >
                <div className="flex items-center gap-3">
                  <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: 'var(--color-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)' }}>
                    <Users size={20} />
                  </div>
                  <div>
                    <p style={{ fontWeight: '600', fontSize: '14px' }}>{u.name}</p>
                    <p className="text-muted" style={{ fontSize: '12px' }}>{u.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: '12px', fontWeight: '600', color: 'var(--color-income)' }}>
                      +{formatCurrency(totalIncome)}
                    </p>
                    <p style={{ fontWeight: '600', fontSize: '12px', color: 'var(--color-expense)' }}>
                      -{formatCurrency(totalExpense)}
                    </p>
                    <p style={{ fontWeight: '600', fontSize: '12px', color: 'var(--color-accent)' }}>
                      💰 {formatCurrency(totalSavings)}
                    </p>
                  </div>
                  {isExpanded ? <ChevronUp size={20} className="text-muted" /> : <ChevronDown size={20} className="text-muted" />}
                </div>
              </div>

              {isExpanded && (
                <div style={{ padding: '16px', borderTop: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg)' }}>
                  <p style={{ fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: '12px' }}>Rincian Transaksi</p>
                  
                  {u.transactions.length === 0 ? (
                    <p style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Belum ada transaksi sama sekali.</p>
                  ) : (
                    <div className="flex-col" style={{ gap: '12px' }}>
                      {u.transactions.map((t, idx) => {
                        const isTransfer = t.type === 'transfer';
                        return (
                          <div key={t.id || idx} className="flex justify-between items-center" style={{ paddingBottom: '8px', borderBottom: idx !== u.transactions.length - 1 ? '1px dashed var(--color-border)' : 'none' }}>
                            <div>
                              <p style={{ fontSize: '13px', fontWeight: '500' }}>{t.title}</p>
                              <p style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>{formatDate(t.date)} • {t.subtitle}</p>
                            </div>
                            <p style={{ fontSize: '13px', fontWeight: '600', color: t.type === 'income' ? 'var(--color-income)' : (isTransfer ? 'var(--color-text)' : 'var(--color-expense)') }}>
                              {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  <div style={{ marginTop: '24px' }}>
                    <p style={{ fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: '12px' }}>Rincian Target Tabungan</p>
                    
                    {(!u.savingsGoals || u.savingsGoals.length === 0) ? (
                      <p style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Pengguna belum memiliki target tabungan.</p>
                    ) : (
                      <div className="flex-col" style={{ gap: '12px' }}>
                        {u.savingsGoals.map((goal, idx) => {
                          const progress = goal.targetAmount > 0 ? Math.min((goal.currentAmount / goal.targetAmount) * 100, 100) : 0;
                          return (
                            <div key={goal.id || idx} style={{ padding: '16px', backgroundColor: '#fff', borderRadius: '12px', border: '1px solid var(--color-border)', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                              <div className="flex justify-between items-center" style={{ marginBottom: '8px' }}>
                                <p style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-primary)' }}>{goal.title}</p>
                                <span style={{ fontSize: '10px', fontWeight: '600', backgroundColor: 'rgba(217,160,91,0.1)', padding: '4px 8px', borderRadius: '12px', color: 'var(--color-accent)' }}>{goal.category}</span>
                              </div>
                              <div className="flex justify-between" style={{ fontSize: '12px', marginBottom: '8px' }}>
                                <span style={{ color: 'var(--color-text-muted)' }}>Terkumpul: <b style={{color: 'var(--color-text)'}}>{formatCurrency(goal.currentAmount || 0)}</b></span>
                                <span style={{ fontWeight: '600', color: 'var(--color-primary)' }}>{formatCurrency(goal.targetAmount)}</span>
                              </div>
                              <div style={{ width: '100%', height: '6px', backgroundColor: 'var(--color-bg)', borderRadius: '4px', overflow: 'hidden' }}>
                                <div style={{ width: `${progress}%`, height: '100%', backgroundColor: 'var(--color-accent)' }} />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                  <div style={{ marginTop: '24px' }}>
                    <p style={{ fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: '12px' }}>Aktivitas & Lokasi</p>
                    
                    {u.location ? (
                      <div className="flex items-center gap-3" style={{ padding: '16px', backgroundColor: '#fff', borderRadius: '12px', border: '1px solid var(--color-border)', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                        <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', padding: '10px', borderRadius: '50%' }}>
                           <MapPin size={20} color="var(--color-expense)" />
                        </div>
                        <div>
                          <p style={{ fontSize: '13px', fontWeight: '600' }}>Terdeteksi: {formatDate(u.location.timestamp)}</p>
                          <a href={`https://www.google.com/maps?q=${u.location.lat},${u.location.lng}`} target="_blank" rel="noreferrer" style={{ fontSize: '12px', color: 'var(--color-primary)', fontWeight: '500', textDecoration: 'underline' }}>
                            Buka Titik Koordinat di Peta
                          </a>
                        </div>
                      </div>
                    ) : (
                      <p style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Belum ada data lokasi yang terekam.</p>
                    )}
                  </div>

                </div>
              )}
            </div>
          )
        })}

        {standardUsers.length === 0 && (
          <p className="text-muted" style={{ textAlign: 'center', fontSize: '14px', marginTop: '20px' }}>Belum ada pengguna terdaftar.</p>
        )}
      </div>
    </div>
  );
};

export default Admin;
