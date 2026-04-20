import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { Wallet } from 'lucide-react';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const registerUser = useStore(state => state.registerUser);
  const users = useStore(state => state.users);
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleRegister = (e) => {
    e.preventDefault();
    if (users.find(u => u.email === email)) {
      setError('Email sudah terdaftar!');
      return;
    }
    registerUser(name, email, password);
    navigate('/');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', padding: '24px', backgroundColor: 'var(--color-bg)', margin: '-20px' }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        
        <div className="card">
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div style={{ width: '64px', height: '64px', backgroundColor: 'var(--color-primary)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: 'var(--color-accent)' }}>
              <Wallet size={32} />
            </div>
            <h2 style={{ fontSize: '20px', fontWeight: '600' }}>Buat Akun Baru</h2>
          </div>

          {error && <div style={{ backgroundColor: '#fee2e2', color: '#ef4444', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px', textAlign: 'center' }}>{error}</div>}

          <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '14px', fontWeight: '500', marginBottom: '8px', display: 'block' }}>Nama Lengkap</label>
              <input 
                type="text" 
                value={name}
                onChange={e => setName(e.target.value)}
                required
                style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--color-border)', fontSize: '16px', outline: 'none' }}
                placeholder="Cth: Tono Setiawan"
              />
            </div>
            <div>
              <label style={{ fontSize: '14px', fontWeight: '500', marginBottom: '8px', display: 'block' }}>Email</label>
              <input 
                type="email" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--color-border)', fontSize: '16px', outline: 'none' }}
                placeholder="email@anda.com"
              />
            </div>
            <div>
              <label style={{ fontSize: '14px', fontWeight: '500', marginBottom: '8px', display: 'block' }}>Password</label>
              <input 
                type="password" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--color-border)', fontSize: '16px', outline: 'none' }}
                placeholder="Buat password yang kuat"
              />
            </div>
            
            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '14px', fontSize: '16px', marginTop: '8px' }}>
              Daftar Sekarang
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px' }}>
            Sudah punya akun? <Link to="/login" style={{ color: 'var(--color-accent)', fontWeight: '600' }}>Masuk di sini</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
