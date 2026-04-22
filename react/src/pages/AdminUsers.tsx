import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Search, User, Shield, Trash2, Mail, Loader2, CheckCircle2, XCircle, MoreVertical
} from 'lucide-react';
import { API_BASE_URL } from '../config';

interface UserData {
  id: number;
  fullname: string;
  email: string;
  avatar: string | null;
  role: 'admin' | 'user';
  status: number;
  created_at: string;
}

const AdminUsers = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<'all' | 'admin' | 'user'>('all');
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const token = localStorage.getItem('auth_token');

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const host = window.location.hostname === 'localhost' ? API_BASE_URL.replace('/BE', '') : '';
        const response = await axios.get(`${host}/BE/modules/api/admin/admin_users.php?token=${token}`);
        if (response.data.status === 'success') {
          setUsers(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [token]);

  const handleDeleteUser = async (id: number) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa người dùng này?')) return;
    try {
      setUpdatingId(id);
      const host = window.location.hostname === 'localhost' ? API_BASE_URL.replace('/BE', '') : '';
      const response = await axios.post(`${host}/BE/modules/api/admin/admin_users.php`, { token, id, action: 'delete' });
      if (response.data.status === 'success') {
        setUsers(users.filter(u => u.id !== id));
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleUpdateStatus = async (id: number, currentStatus: number) => {
    try {
      setUpdatingId(id);
      const newStatus = currentStatus === 1 ? 0 : 1;
      const host = window.location.hostname === 'localhost' ? API_BASE_URL.replace('/BE', '') : '';
      const response = await axios.post(`${host}/BE/modules/api/admin/admin_users.php`, { token, id, action: 'update', status: newStatus });
      if (response.data.status === 'success') {
        setUsers(users.map(u => u.id === id ? { ...u, status: newStatus } : u));
      }
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleUpdateRole = async (id: number, currentRole: string) => {
    try {
      setUpdatingId(id);
      const newRole = currentRole === 'admin' ? 'user' : 'admin';
      const host = window.location.hostname === 'localhost' ? API_BASE_URL.replace('/BE', '') : '';
      const response = await axios.post(`${host}/BE/modules/api/admin/admin_users.php`, { token, id, action: 'update', role: newRole });
      if (response.data.status === 'success') {
        setUsers(users.map(u => u.id === id ? { ...u, role: newRole as any } : u));
      }
    } catch (error) {
      console.error('Error updating role:', error);
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.fullname.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="p-6 space-y-8 max-w-[1400px] mx-auto pb-10">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Thành viên hệ thống</h1>
          <p className="text-slate-500 text-sm mt-1">Quản lý và cập nhật quyền hạn người dùng iAI</p>
        </div>
        <div className="bg-white px-6 py-3 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="text-right">
            <p className="text-[10px] font-bold text-slate-400 uppercase">Cộng đồng</p>
            <p className="text-xl font-bold text-slate-900">{users.length.toLocaleString()}</p>
          </div>
          <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
            <User size={20} />
          </div>
        </div>
      </header>

      <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col lg:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Tìm kiếm theo tên hoặc email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-transparent rounded-lg pl-11 pr-4 py-2.5 text-sm focus:bg-white focus:border-blue-200 outline-none transition-all"
          />
        </div>

        <div className="flex items-center gap-2">
          {(['all', 'admin', 'user'] as const).map((role) => (
            <button
              key={role}
              onClick={() => setFilterRole(role)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold uppercase transition-all ${
                filterRole === role ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
              }`}
            >
              {role === 'all' ? 'Tất cả' : role === 'admin' ? 'Quản trị' : 'Thành viên'}
            </button>
          ))}
          <button onClick={() => window.location.reload()} className="p-2.5 bg-slate-100 text-slate-500 rounded-lg hover:bg-slate-200 transition-all">
            <Loader2 size={18} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-[10px] font-bold uppercase tracking-wider">
                <th className="px-6 py-4">Thành viên</th>
                <th className="px-6 py-4 text-center">Đặc quyền</th>
                <th className="px-6 py-4 text-center">Trạng thái</th>
                <th className="px-6 py-4 text-center">Ngày gia nhập</th>
                <th className="px-6 py-4 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <img 
                        src={user.avatar ? (user.avatar.startsWith('http') ? user.avatar : `${API_BASE_URL.replace('/BE', '')}/${user.avatar}`) : `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.fullname}`} 
                        alt={user.fullname} 
                        className="w-10 h-10 rounded-lg object-cover bg-slate-100 border border-slate-100"
                      />
                      <div>
                        <p className="text-sm font-bold text-slate-900">{user.fullname}</p>
                        <p className="text-[10px] text-slate-400 flex items-center gap-1"><Mail size={10} /> {user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button 
                      onClick={() => handleUpdateRole(user.id, user.role)}
                      disabled={updatingId === user.id}
                      className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase transition-all ${
                        user.role === 'admin' ? 'bg-amber-100 text-amber-600' : 'bg-blue-50 text-blue-600'
                      } disabled:opacity-50`}
                    >
                      {user.role === 'admin' ? 'Quản trị' : 'Thành viên'}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => handleUpdateStatus(user.id, user.status)}
                      disabled={updatingId === user.id}
                      className="inline-flex flex-col items-center disabled:opacity-50"
                    >
                      {user.status === 1 ? <CheckCircle2 size={18} className="text-emerald-500" /> : <XCircle size={18} className="text-slate-300" />}
                      <span className={`text-[8px] font-bold mt-0.5 ${user.status === 1 ? 'text-emerald-500' : 'text-slate-400'}`}>
                        {user.status === 1 ? 'ACTIVE' : 'LOCKED'}
                      </span>
                    </button>
                  </td>
                  <td className="px-6 py-4 text-center text-xs text-slate-500 font-medium">
                    {new Date(user.created_at).toLocaleDateString('vi-VN')}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                       <button 
                         onClick={() => handleDeleteUser(user.id)}
                         disabled={updatingId === user.id}
                         className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                       >
                         <Trash2 size={18} />
                       </button>
                       <button className="p-2 text-slate-300 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all">
                         <MoreVertical size={18} />
                       </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;


