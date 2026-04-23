import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import { Loader2 } from 'lucide-react';

const AdminRoute = () => {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const token = localStorage.getItem('auth_token');

  useEffect(() => {
    const verifyAdmin = async () => {
      if (!token) {
        setIsAdmin(false);
        return;
      }

      const localRole = localStorage.getItem('user_role');
      if (localRole !== 'admin') {
        setIsAdmin(false);
        return;
      }

      try {
        const response = await axios.get(`${API_BASE_URL}/modules/api/user.php?token=${token}`);
        
        if (response.data.status === 'success' && response.data.data.profile.role === 'admin') {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
          localStorage.removeItem('user_role');
        }
      } catch (err) {
        console.error('Error verifying admin status:', err);
        setIsAdmin(false);
      }
    };

    verifyAdmin();
  }, [token]);

  if (isAdmin === null) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
        <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Đang xác thực quyền truy cập...</p>
      </div>
    );
  }

  return isAdmin ? <Outlet /> : <Navigate to="/" replace />;
};

export default AdminRoute;
