import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Bell, User, Sparkles, MessageSquare, LogOut, AlertTriangle, X, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Chatbot from './Chatbot';

const PublicLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_name');
    localStorage.removeItem('user_avatar');
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-[#F9F9FC] flex flex-col font-inter">
      <header className="bg-white border-b border-slate-100 flex items-center sticky top-0 z-50 shadow-sm shadow-slate-100/50">
        <div className="max-w-7xl mx-auto w-full px-6 h-20 flex items-center justify-between gap-12">
          <Link to="/" className="flex items-center gap-2 group shrink-0">
            <img src="/logo_vertex.png" alt="Vertex" className="h-16 w-auto object-contain" />
          </Link>

          <div className="flex-1 max-w-3xl relative group hidden md:block">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Hôm nay bạn muốn xem tin tức gì?"
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-4 py-3 text-sm font-medium focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-200 transition-all outline-none"
            />
          </div>

          <div className="flex items-center gap-4 shrink-0">
            {localStorage.getItem('auth_token') ? (
              <div className="flex items-center gap-3 pl-4 border-l border-slate-100">
                <Link 
                  to="/profile" 
                  className="flex items-center gap-3 group"
                >
                  <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center font-black shadow-sm overflow-hidden hover:ring-2 hover:ring-blue-100 transition-all active:scale-95">
                    {localStorage.getItem('user_avatar') ? (
                      <img src={localStorage.getItem('user_avatar')!} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      localStorage.getItem('user_name') ? localStorage.getItem('user_name')!.charAt(0).toUpperCase() : 'U'
                    )}
                  </div>
                  <div className="hidden lg:block text-left">
                    <p className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{localStorage.getItem('user_name') || 'Người dùng'}</p>
                  </div>
                </Link>

                {localStorage.getItem('user_role') === 'admin' && (
                  <Link 
                    to="/admin" 
                    className="flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-amber-100 transition-all active:scale-95 border border-amber-100"
                  >
                    <ShieldCheck size={14} />
                    Quản trị
                  </Link>
                )}
                
                <button 
                  onClick={() => setShowLogoutConfirm(true)}
                  className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all active:scale-90"
                  title="Đăng xuất"
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <>
                <Link to="/login" className="text-xs font-black text-slate-900 bg-slate-100 hover:bg-blue-600 hover:text-white px-5 py-2.5 rounded-xl transition-all uppercase tracking-widest active:scale-95">
                    Đăng nhập
                </Link>
                <Link to="/register" className="hidden sm:block text-xs font-black text-white bg-blue-600 hover:bg-blue-700 px-5 py-2.5 rounded-xl shadow-lg shadow-blue-200 transition-all uppercase tracking-widest active:scale-95">
                    Đăng ký
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1">
        {children}
      </main>

      <AnimatePresence>
        {showLogoutConfirm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLogoutConfirm(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-sm bg-white rounded-[2rem] p-8 shadow-2xl"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mb-6">
                  <AlertTriangle size={32} />
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-2">Đăng xuất?</h3>
                <p className="text-sm font-medium text-slate-500 mb-8 leading-relaxed">
                  Bạn có chắc chắn muốn rời khỏi phiên làm việc hiện tại không?
                </p>
                <div className="grid grid-cols-2 gap-4 w-full">
                  <button 
                    onClick={() => setShowLogoutConfirm(false)}
                    className="py-4 bg-slate-100 text-slate-600 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-200 transition-all active:scale-95"
                  >
                    Hủy
                  </button>
                  <button 
                    onClick={handleLogout}
                    className="py-4 bg-red-500 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-red-600 transition-all shadow-lg shadow-red-100 active:scale-95"
                  >
                    Đăng xuất
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <footer className="bg-white border-t border-slate-100 py-16">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-16">
          <div className="md:col-span-5">
            <Link to="/" className="flex items-center gap-2 group shrink-0 mb-6 inline-block">
              <img src="/logo_vertex.png" alt="Vertex" className="h-14 w-auto object-contain" />
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm font-medium mb-8">
                Hệ thống tin tức thông minh dựa trên nền tảng Gemini AI, cung cấp thông tin đa chiều và cá nhân hóa trải nghiệm người dùng mọi lúc mọi nơi.
            </p>
            <div className="flex items-center gap-4">
                {[1,2,3,4].map(i => <div key={i} className="w-10 h-10 bg-slate-50 text-slate-400 rounded-xl hover:bg-blue-600 hover:text-white transition-all cursor-pointer flex items-center justify-center border border-slate-100 shadow-sm shadow-slate-100"></div>)}
            </div>
          </div>

          <div className="md:col-span-3">
            <h4 className="font-black text-slate-900 mb-8 uppercase text-[10px] tracking-[0.2em]">KHÁM PHÁ</h4>
            <ul className="space-y-4 text-xs font-black text-slate-400 uppercase tracking-widest">
                <li className="hover:text-blue-600 cursor-pointer transition-colors">Về chúng tôi</li>
                <li className="hover:text-blue-600 cursor-pointer transition-colors">Đội ngũ biên tập</li>
                <li className="hover:text-blue-600 cursor-pointer transition-colors">Tuyển dụng</li>
                <li className="hover:text-blue-600 cursor-pointer transition-colors">Liên hệ</li>
            </ul>
          </div>

          <div className="md:col-span-4">
            <h4 className="font-black text-slate-900 mb-8 uppercase text-[10px] tracking-[0.2em]">PHÁP LÝ</h4>
            <ul className="space-y-4 text-xs font-black text-slate-400 uppercase tracking-widest">
                <li className="hover:text-blue-600 cursor-pointer transition-colors">Điều khoản bảo mật</li>
                <li className="hover:text-blue-600 cursor-pointer transition-colors">Bản quyền nội dung</li>
                <li className="hover:text-blue-600 cursor-pointer transition-colors">Quảng cáo</li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-slate-50 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">© 2026 KLTN NEWS. ALL RIGHTS RESERVED.</p>
            <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.5)]"></div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Gemini 2.0 Connected</p>
            </div>
        </div>
      </footer>

      <Chatbot />
    </div>
  );
};

export default PublicLayout;
