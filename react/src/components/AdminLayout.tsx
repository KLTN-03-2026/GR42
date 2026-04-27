import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Newspaper, 
  User, 
  Settings, 
  LayoutDashboard, 
  MessageSquare, 
  Users, 
  Heart, 
  LogOut, 
  Search,
  Bell,
  Menu,
  X,
  ShieldCheck
} from 'lucide-react';

import Chatbot from './Chatbot';
import VAvatar from './VAvatar';
import VModal from './VModal';

interface SidebarItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}

const SidebarItem = ({ to, icon, label, active }: SidebarItemProps) => (
  <Link
    to={to}
    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
      active 
        ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' 
        : 'text-slate-500 hover:bg-blue-50 hover:text-blue-600'
    }`}
  >
    <span className={`${active ? 'text-white' : 'text-slate-400 group-hover:text-blue-600'}`}>
      {icon}
    </span>
    <span className="font-medium">{label}</span>
  </Link>
);

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const menuItems = [
    { to: '/', icon: <Home size={20} />, label: 'Trang chủ' },
    { to: '/admin/favorites', icon: <Heart size={20} />, label: 'Tin yêu thích' },
    { to: '/admin/profile', icon: <User size={20} />, label: 'Tài khoản' },
  ];

  const adminItems = [
    { to: '/admin', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { to: '/admin/news', icon: <Newspaper size={20} />, label: 'Quản lý bài báo' },
    { to: '/admin/users', icon: <Users size={20} />, label: 'Quản lý người dùng' },
    { to: '/admin/comments', icon: <MessageSquare size={20} />, label: 'Quản lý bình luận' },
    { to: '/admin/reports', icon: <Bell size={20} />, label: 'Quản lý báo cáo' },
  ];

  const userName = localStorage.getItem('user_name') || 'Admin';
  const userAvatar = localStorage.getItem('user_avatar');
  const userInitial = userName.charAt(0).toUpperCase();

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_name');
    localStorage.removeItem('user_email');
    localStorage.removeItem('user_avatar');
    localStorage.removeItem('user_role');
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-background flex">
      <button 
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <aside className={`fixed inset-y-0 left-0 z-40 w-[280px] bg-surface border-r border-slate-100 p-6 flex flex-col transition-transform duration-300 transform lg:translate-x-0 ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <Link to="/admin" className="mb-10 flex items-center gap-3 px-4 group">
          <img src="/logo_vertex.png" alt="Vertex" className="h-12 w-auto object-contain transition-transform group-hover:scale-105" />
        </Link>

        <nav className="flex-1 space-y-1">
          {menuItems.map((item) => (
            <SidebarItem 
              key={item.to} 
              {...item} 
              active={location.pathname === item.to} 
            />
          ))}

          <div className="pt-6 pb-2 px-4 uppercase text-[10px] font-bold text-slate-400 tracking-wider">
            Quản trị
          </div>
          {adminItems.map((item) => (
            <SidebarItem 
              key={item.to} 
              {...item} 
              active={item.to === '/admin' ? location.pathname === '/admin' : location.pathname.startsWith(item.to)} 
            />
          ))}
        </nav>

        <div className="pt-6 border-t border-slate-100">
          <button 
            onClick={() => setShowLogoutConfirm(true)}
            className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-red-500 w-full transition-colors rounded-xl"
          >
            <LogOut size={20} />
            <span className="font-medium">Đăng xuất</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 lg:ml-[280px] min-w-0 flex flex-col min-h-screen">
        <div className="p-4 flex-1 flex flex-col">
          <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 flex-1 flex flex-col overflow-hidden">
            <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-50 flex items-center justify-between px-8 sticky top-0 z-30">
              <div className="flex-1 max-w-md">
                <div className="relative group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                  <input 
                    type="text" 
                    placeholder="Tìm kiếm bài báo..."
                    className="w-full bg-slate-50 border-none rounded-2xl pl-12 pr-4 py-3 focus:ring-2 focus:ring-blue-100 transition-all text-sm font-medium"
                  />
                </div>
              </div>

              <div className="flex items-center gap-6">
                <button className="p-3 text-slate-500 hover:bg-slate-50 rounded-2xl transition-colors relative">
                  <Bell size={20} />
                  <span className="absolute top-3 right-3 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                </button>
                <div className="h-10 w-px bg-slate-100 mx-1"></div>
                <Link to="/admin/profile" className="flex items-center gap-3 group pl-2 transition-colors">
                  <VAvatar src={userAvatar} name={userName} size="md" className="ring-2 ring-transparent group-hover:ring-blue-100 transition-all active:scale-95" />
                  <div className="hidden sm:block text-left">
                    <p className="text-xs font-bold text-slate-900 leading-none mb-1">{userName}</p>
                  </div>
                </Link>

                <div className="flex items-center gap-2 px-4 py-2.5 bg-amber-50 text-amber-600 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-amber-100 shrink-0">
                    <ShieldCheck size={14} />
                    Quản lý
                </div>
              </div>
            </header>

            <div className="p-8 flex-1 overflow-auto bg-slate-50/30">
              {children}
            </div>
          </div>
        </div>

        <Chatbot />
      </main>

      <VModal
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={handleLogout}
        type="danger"
        title="Xác nhận đăng xuất"
        message="Bạn có chắc chắn muốn đăng xuất không?"
        confirmText="Đăng xuất"
        cancelText="Hủy"
      />
    </div>
  );
};

export default AdminLayout;
