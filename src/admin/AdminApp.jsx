import React, { useState } from 'react';
import { getToken } from './adminApi';
import AdminLogin from './AdminLogin';
import AdminDashboard from './AdminDashboard';
import '../styles/admin.css';

export default function AdminApp() {
  const [authenticated, setAuthenticated] = useState(!!getToken());

  if (!authenticated) {
    return <AdminLogin onLogin={() => setAuthenticated(true)} />;
  }

  return <AdminDashboard />;
}
