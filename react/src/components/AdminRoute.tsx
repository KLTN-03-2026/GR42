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

      // First check local storage for quick feedback
      const localRole = localStorage.getItem('user_role');
      if (localRole !== 'admin') {
        setIsAdmin(false);
        return;
      }

      try {
        // Double check with server for security
        const host = window.location.hostname === 'localhost' ? API_BASE_URL.replace('/BE', '') : '';
        const response = await axios.get(`${host}/BE/modules/api/user_get_profile.php?token=${token}`);
        
        if (response.data.status === 'success' && response.data.data.role === 'admin') {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
          // If server says not admin, clear local role for consistency
          localStorage.removeItem('user_role');
        }
      } catch (err) {
        console.error('Error verifying admin status:', err);
        // On error, we trust local storage but ideally we should be stricter
        // For UX, if local storage says admin we let them through if server is down,
        // or we can redirect to login. Let's redirect to be safe.
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
