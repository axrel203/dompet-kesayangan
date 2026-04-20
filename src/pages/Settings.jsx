import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { User, Mail, Shield, LogOut } from 'lucide-react';

const Settings = () => {
  const { currentUser, updateProfile, logout } = useStore();
  
  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState('');

  const handleSave = (e) => {
    e.preventDefault();
    updateProfile(name, email);
    setIsEditing(false);
    setMessage('Profil berhasil diperbarui!');
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="flex-col gap-4">
      <h2 style={{ fontSize: '24px', fontWeight: '600' }}>Pengaturan</h2>
      
      {message && <div style={{ backgroundColor: '#dcfce7', color: '#16a34a', padding: '12px', borderRadius: '8px', fontSize: '14px', textAlign: 'center' }}>{message}</div>}

      <div className="card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
          <div style={{ 
            width: '64px', height: '64px', borderRadius: '50%', 
            backgroundColor: 'var(--color-primary)', 
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-accent)',
            backgroundImage: `url("https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser?.name || 'User')}&background=d9a05b&color=3f2d20")`, 
            backgroundSize: 'cover'
          }} />
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: '600' }}>{currentUser?.name || 'User'}</h3>
            <p className="text-muted" style={{ fontSize: '14px' }}>{currentUser?.email}</p>
          </div>
        </div>

        {isEditing ? (
          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>Nama Lengkap</label>
              <input 
                type="text" value={name} onChange={e => setName(e.target.value)}
                style={{ width: '100%', padding: '12px', marginTop: '4px', borderRadius: '8px', border: '1px solid var(--color-border)', outline: 'none' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>Email</label>
              <input 
                type="email" value={email} onChange={e => setEmail(e.target.value)}
                style={{ width: '100%', padding: '12px', marginTop: '4px', borderRadius: '8px', border: '1px solid var(--color-border)', outline: 'none' }}
              />
            </div>
            <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
              <button type="button" onClick={() => setIsEditing(false)} className="btn btn-outline" style={{ flex: 1, color: 'var(--color-text-main)', borderColor: 'var(--color-border)' }}>Batal</button>
              <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Simpan</button>
            </div>
          </form>
        ) : (
          <button onClick={() => setIsEditing(true)} className="btn btn-outline" style={{ width: '100%', color: 'var(--color-primary)', borderColor: 'var(--color-primary)', display: 'block' }}>
            Edit Profil
          </button>
        )}
      </div>

      <div className="card" style={{ padding: '8px 16px' }}>
        <button style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 0', borderBottom: '1px solid var(--color-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--color-text-main)' }}>
            <Shield size={20} className="text-muted" />
            <span style={{ fontSize: '15px', fontWeight: '500' }}>Keamanan Akun</span>
          </div>
          <span className="text-muted">›</span>
        </button>
        <button style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 0', borderBottom: '1px solid var(--color-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--color-text-main)' }}>
            <Mail size={20} className="text-muted" />
            <span style={{ fontSize: '15px', fontWeight: '500' }}>Pusat Bantuan</span>
          </div>
          <span className="text-muted">›</span>
        </button>
        <button onClick={logout} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 0', borderBottom: 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--color-expense)' }}>
            <LogOut size={20} />
            <span style={{ fontSize: '15px', fontWeight: '500' }}>Keluar Akun</span>
          </div>
          <span className="text-muted">›</span>
        </button>
      </div>
    </div>
  );
};

export default Settings;
