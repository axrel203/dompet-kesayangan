import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { Wallet } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const loginUser = useStore(state => state.loginUser);
  const users = useStore(state => state.users);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      loginUser(email, password);
      navigate('/');
    } else {
      setError('Email atau password salah!');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', padding: '24px', backgroundColor: 'var(--color-bg)', margin: '-20px' }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ width: '80px', height: '80px', backgroundColor: 'var(--color-primary)', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', color: 'var(--color-accent)' }}>
            <Wallet size={40} />
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '8px' }}>Lounge Capital</h1>
          <p className="text-muted">Aplikasi Keuangan Pribadi</p>
        </div>

        <div className="card">
          <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '24px', textAlign: 'center' }}>Masuk Akun</h2>
          
          {error && <div style={{ backgroundColor: '#fee2e2', color: '#ef4444', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px', textAlign: 'center' }}>{error}</div>}

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
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
                placeholder="Masukkan password"
              />
            </div>
            
            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '14px', fontSize: '16px', marginTop: '8px' }}>
              Masuk Sekarang
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px' }}>
            Belum punya akun? <Link to="/register" style={{ color: 'var(--color-accent)', fontWeight: '600' }}>Daftar di sini</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
