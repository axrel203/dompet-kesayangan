import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useStore } from './store/useStore';
import TopBar from './components/TopBar';
import BottomNav from './components/BottomNav';
import Dashboard from './pages/Dashboard';
import History from './pages/History';
import AddTransaction from './pages/AddTransaction';
import Insights from './pages/Insights';
import Login from './pages/Login';
import Register from './pages/Register';
import Settings from './pages/Settings';
import Admin from './pages/Admin';
import Savings from './pages/Savings';
import Landing from './pages/Landing';

function App() {
  const { isAuthenticated, initializeStore } = useStore();

  useEffect(() => {
    initializeStore();
  }, [initializeStore]);

  if (!isAuthenticated) {
    return (
      <div className="app-container">
        <div className="content-area" style={{ paddingBottom: '20px' }}>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <div className="content-area">
        <Routes>
          <Route path="/" element={<><TopBar /><Dashboard /></>} />
          <Route path="/history" element={<><TopBar /><History /></>} />
          <Route path="/add" element={<AddTransaction />} />
          <Route path="/insights" element={<><TopBar /><Insights /></>} />
          <Route path="/savings" element={<><TopBar /><Savings /></>} />
          <Route path="/settings" element={<><TopBar /><Settings /></>} />
          <Route path="/admin" element={<><TopBar /><Admin /></>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
      <BottomNav />
    </div>
  );
}

export default App;
