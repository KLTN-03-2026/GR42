import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, LogOut, AlertTriangle, X, ShieldCheck, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import VAvatar from './VAvatar';
import { encodeId } from '../utils/idEncoder';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const userName = localStorage.getItem('user_name');
  const userAvatar = localStorage.getItem('user_avatar');
  const userRole = localStorage.getItem('user_role');
  const authToken = localStorage.getItem('auth_token');

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchTerm.trim().length >= 2) {
        try {
          const res = await axios.get(`${API_BASE_URL}/index.php`, {
            params: {
              module: 'api',
              action: 'news_load',
              keyword: searchTerm.trim(),
              perPage: 5
            }
          });
          if (res.data.status === 'success') {
            setSuggestions(res.data.data);
            setShowSuggestions(true);
          }
        } catch (error) {
          console.error('Error fetching suggestions:', error);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const handleSearch = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && searchTerm.trim()) {
      setShowSuggestions(false);
      navigate(`/?keyword=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const handleSelectSuggestion = (id: number) => {
    setShowSuggestions(false);
    setSearchTerm('');
    navigate(`/article/${encodeId(id)}`);
  };

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_name');
    localStorage.removeItem('user_avatar');
    localStorage.removeItem('user_role');
    window.location.href = '/';
  };

  return (
    <>
      <header className="bg-white border-b border-slate-100 flex items-center sticky top-0 z-50 shadow-sm shadow-slate-100/50">
        <div className="max-w-7xl mx-auto w-full px-6 h-20 flex items-center justify-between gap-12">
          <Link to="/" className="flex items-center gap-2 group shrink-0">
            <img src="/logo_vertex.png" alt="Vertex" className="h-16 w-auto object-contain" />
          </Link>

          <div className="flex-1 max-w-3xl relative group hidden md:block" ref={searchRef}>
            <button 
              onClick={() => {
                if (searchTerm.trim()) {
                    setShowSuggestions(false);
                    navigate(`/?keyword=${encodeURIComponent(searchTerm.trim())}`);
                }
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors"
            >
              <Search size={18} />
            </button>
            <input 
              type="text" 
              placeholder="Hôm nay bạn muốn xem tin tức gì?"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleSearch}
              onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-12 py-3 text-sm font-medium focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-200 transition-all outline-none"
            />
            {searchTerm && (
                <button 
                  onClick={() => {
                      setSearchTerm('');
                      setSuggestions([]);
                      setShowSuggestions(false);
                      if (location.search.includes('keyword')) {
                          navigate('/');
                      }
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-red-500 transition-colors"
                >
                  <X size={18} />
                </button>
            )}

            <AnimatePresence>
              {showSuggestions && suggestions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden z-[100]"
                >
                  <div className="p-4 border-b border-slate-50 bg-slate-50/50">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Gợi ý tìm kiếm</span>
                  </div>
                  <div className="max-h-[400px] overflow-y-auto">
                    {suggestions.map((item) => (
                      <div 
                        key={item.id}
                        onClick={() => handleSelectSuggestion(item.id)}
                        className="p-4 hover:bg-blue-50 cursor-pointer flex gap-4 transition-colors border-b border-slate-50 last:border-0 group"
                      >
                        <div className="w-16 h-12 rounded-xl overflow-hidden shrink-0 bg-slate-100 border border-slate-100">
                          <img src={item.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform" alt="" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h5 className="text-sm font-bold text-slate-800 line-clamp-1 group-hover:text-blue-600 transition-colors">{item.title}</h5>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest">{item.category}</span>
                            <span className="text-[9px] text-slate-400 font-bold">• {item.source}</span>
                          </div>
                        </div>
                        <ArrowRight size={14} className="text-slate-200 group-hover:text-blue-600 self-center" />
                      </div>
                    ))}
                  </div>
                  <div 
                    onClick={() => {
                        setShowSuggestions(false);
                        navigate(`/?keyword=${encodeURIComponent(searchTerm.trim())}`);
                    }}
                    className="p-4 text-center bg-blue-600 text-white text-xs font-black uppercase tracking-widest cursor-pointer hover:bg-blue-700 transition-all"
                  >
                    Xem tất cả kết quả cho "{searchTerm}"
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            {authToken ? (
              <div className="flex items-center gap-3 pl-4 border-l border-slate-100">
                <Link 
                  to="/profile" 
                  className="flex items-center gap-3 group"
                >
                  <VAvatar src={userAvatar} name={userName || 'U'} size="md" className="hover:ring-2 hover:ring-blue-100 transition-all active:scale-95" />
                  <div className="hidden lg:block text-left">
                    <div className="flex items-center gap-1.5">
                        <p className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{userName || 'Người dùng'}</p>
                        {userRole === 'admin' && (
                            <span className="px-1.5 py-0.5 bg-blue-600 text-white text-[8px] font-black rounded-md uppercase tracking-tighter">Admin</span>
                        )}
                    </div>
                  </div>
                </Link>

                {userRole === 'admin' && (
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
    </>
  );
};

export default Header;