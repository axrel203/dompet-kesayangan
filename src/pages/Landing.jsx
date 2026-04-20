import React from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import { Heart } from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column', 
      justifyContent: 'center', 
      alignItems: 'center', 
      padding: '40px 24px',
      backgroundColor: 'var(--color-bg)',
      color: 'var(--color-primary)',
      textAlign: 'center',
      margin: '-20px' // Adjust for app-container padding
    }}>
      {/* Background Decor */}
      <div style={{
        position: 'absolute',
        top: '-100px',
        right: '-100px',
        width: '300px',
        height: '300px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(217,160,91,0.1) 0%, transparent 70%)',
        zIndex: 0
      }} />

      <div style={{ zIndex: 1, width: '100%', maxWidth: '400px' }}>
        <div style={{ marginBottom: '40px', animation: 'bounce 2s infinite' }}>
           <Logo size={120} iconSize={60} />
        </div>

        <div style={{ marginBottom: '48px' }}>
          <h1 style={{ 
            fontSize: '36px', 
            fontWeight: '700', 
            lineHeight: '1.2',
            marginBottom: '16px',
            background: 'linear-gradient(to bottom, var(--color-primary), var(--color-accent))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            halo sayangkuu😚
          </h1>
          <p style={{ 
            fontSize: '18px', 
            color: 'var(--color-text-muted)',
            fontWeight: '500'
          }}>
            semoga sukak yahhh
          </p>
        </div>

        <button 
          onClick={() => navigate('/login')}
          className="btn btn-primary"
          style={{ 
            width: '100%', 
            padding: '18px', 
            fontSize: '18px', 
            borderRadius: '20px',
            boxShadow: '0 10px 20px rgba(63, 45, 32, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px'
          }}
        >
          Masuk Sekarang <Heart size={20} fill="currentColor" />
        </button>

        <p style={{ 
          marginTop: '32px', 
          fontSize: '13px', 
          color: 'var(--color-text-muted)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px'
        }}>
          Terbuat dengan ❤️ oleh Ayangmu
        </p>
      </div>

      <style>
        {`
          @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
          }
        `}
      </style>
    </div>
  );
};

export default Landing;
