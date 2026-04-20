import React from 'react';
import { LogOut } from 'lucide-react';
import { useStore } from '../store/useStore';

const TopBar = () => {
  const user = useStore(state => state.currentUser);
  const logout = useStore(state => state.logout);

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ 
          width: '40px', 
          height: '40px', 
          borderRadius: '50%', 
          backgroundColor: '#3f2d20',
          backgroundImage: `url("https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=d9a05b&color=3f2d20")`,
          backgroundSize: 'cover'
        }} />
        <span style={{ fontWeight: '600', fontSize: '18px' }}>{user?.name || 'User'}</span>
      </div>
      <button onClick={logout} style={{ color: 'inherit', padding: '8px' }}>
        <LogOut size={20} />
      </button>
    </div>
  );
};

export default TopBar;
