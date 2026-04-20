import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Clock, PlusCircle, PieChart, Settings, Users, Coins } from 'lucide-react';
import { useStore } from '../store/useStore';
import './BottomNav.css';

const BottomNav = () => {
  const currentUser = useStore(state => state.currentUser);
  const isAdmin = currentUser?.email === 'admin@admin.com';

  return (
    <div className="bottom-nav">
      <NavLink to="/" className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>
        <Home size={24} />
        <span>Beranda</span>
      </NavLink>
      
      {!isAdmin && (
        <NavLink to="/history" className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>
          <Clock size={24} />
          <span>Riwayat</span>
        </NavLink>
      )}

      {!isAdmin && (
        <NavLink to="/add" className="nav-item nav-add">
          <div className="nav-add-btn">
            <PlusCircle size={28} />
          </div>
          <span>Tambah</span>
        </NavLink>
      )}

      {isAdmin && (
        <NavLink to="/admin" className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>
          <Users size={24} />
          <span>Admin</span>
        </NavLink>
      )}

      {!isAdmin && (
        <NavLink to="/insights" className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>
          <PieChart size={24} />
          <span>Wawasan</span>
        </NavLink>
      )}

      {!isAdmin && (
        <NavLink to="/savings" className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>
          <Coins size={24} />
          <span>Tabungan</span>
        </NavLink>
      )}

      <NavLink to="/settings" className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>
        <Settings size={24} />
        <span>Pengaturan</span>
      </NavLink>
    </div>
  );
};

export default BottomNav;
