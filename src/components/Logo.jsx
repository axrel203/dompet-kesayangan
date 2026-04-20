import React from 'react';
import { Wallet } from 'lucide-react';

/**
 * Komponen Logo Sentral
 * 
 * Tutorial Ganti Logo:
 * 1. Kalau mau ganti icon: Ganti <Wallet /> dengan icon lain dari Lucide (misal: <Heart />, <Coins />, dll)
 * 2. Kalau mau pakai Gambar/Foto: 
 *    - Hapus kode di dalam return
 *    - Ganti dengan: <img src="/logo-kamu.png" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
 */
const Logo = ({ size = 40, iconSize = 24 }) => {
  return (
    <div style={{ 
      width: `${size}px`, 
      height: `${size}px`, 
      backgroundColor: 'var(--color-primary)', 
      borderRadius: size / 4, 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      margin: '0 auto', 
      color: 'var(--color-accent)',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
    }}>
      <Wallet size={iconSize} />
    </div>
  );
};

export default Logo;
