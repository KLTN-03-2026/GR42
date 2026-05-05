import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Lock, CheckCircle2, Send, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import { API_BASE_URL } from '../config';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (!token) {
      setError("Liên kết không hợp lệ hoặc đã hết hạn.");
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      setError("Liên kết không hợp lệ.");
      return;
    }

    if (!password.trim()) {
      setError("Mật khẩu bắt buộc phải nhập");
      return;
    }

    if (password.length < 6) {
      setError("Mật khẩu phải từ 6 ký tự trở lên");
      return;
    }

    if (password !== confirmPassword) {
      setError("Mật khẩu nhập lại không khớp");
      return;
    }

    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/?module=api&action=reset`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          token,
          password,
          confirm_password: confirmPassword
        })
      });
      
      const data = await response.json();
      
      if (data.status === 'success') {
        setSuccessMsg(data.msg);
        setTimeout(() => {
            navigate('/login');
        }, 3000);
      } else {
        setError(data.msg || 'Đã có lỗi xảy ra!');
      }
    } catch (err) {
      setError('Lỗi kết nối đến máy chủ. Vui lòng thử lại!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex overflow-hidden">
      <div className="hidden lg:flex lg:w-1/2 relative bg-white items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#F8FAFC] via-white to-[#EFF6FF]"></div>
        <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-blue-400/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute -bottom-[10%] -right-[10%] w-[50%] h-[50%] bg-amber-400/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
        
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#2563eb 0.5px, transparent 0.5px)', backgroundSize: '32px 32px' }}></div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="relative z-10 w-full flex justify-center"
        >
          <div className="bg-white/40 backdrop-blur-2xl p-32 rounded-[6rem] border border-white/70 shadow-[0_48px_128px_-32px_rgba(37,99,235,0.2)] flex flex-col items-center w-[90%] max-w-4xl">
            <img
              src="/logo_vertex.png"
              alt="Vertex"
              className="h-80 w-auto object-contain hover:scale-110 transition-transform duration-1000 cursor-pointer"
            />
            <div className="mt-20 text-center space-y-6 w-full">
              <div className="h-1.5 w-32 bg-blue-600/30 mx-auto rounded-full"></div>
              <p className="text-xl font-black text-slate-900 uppercase tracking-[0.8em] whitespace-nowrap pl-[0.8em]">Vertex Platform</p>
              <p className="text-sm font-bold text-slate-500 uppercase tracking-[0.3em] opacity-90">Intelligence • speed • accuracy</p>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-20 bg-background relative overflow-y-auto">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-600/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-blue-600/5 rounded-full blur-3xl"></div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md relative z-10"
        >
          <Link to="/login" className="inline-flex items-center gap-2 text-xs font-black text-slate-400 hover:text-blue-600 uppercase tracking-widest transition-colors mb-8">
            <ArrowLeft size={16} />
            Quay lại đăng nhập
          </Link>

          <div className="mb-12 text-center">
            <h2 className="text-4xl font-black text-slate-900 tracking-tighter mb-2">Đặt lại mật khẩu</h2>
            <p className="text-slate-400 font-bold text-sm tracking-tight px-4 leading-relaxed">
              Nhập mật khẩu mới cho tài khoản của bạn
            </p>
          </div>

          {successMsg ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-green-50 border border-green-100 rounded-2xl p-6 text-center"
            >
              <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 size={32} />
              </div>
              <h3 className="text-xl font-black text-slate-800 mb-2">Thành công!</h3>
              <p className="text-sm font-medium text-slate-600 mb-6 leading-relaxed">
                {successMsg}
              </p>
              <Link 
                to="/login"
                className="w-full bg-blue-600 text-white py-4 rounded-xl font-black text-sm uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center"
              >
                Đăng nhập ngay
              </Link>
            </motion.div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-2 flex flex-col">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Mật khẩu mới</label>
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    disabled={loading || !token}
                    className={`w-full bg-slate-50 border ${error && !password ? 'border-red-300' : 'border-slate-100'} rounded-[1.25rem] px-6 py-4 focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-600 transition-all text-sm font-medium outline-none`}
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="space-y-2 flex flex-col">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Xác nhận mật khẩu</label>
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    disabled={loading || !token}
                    className={`w-full bg-slate-50 border ${error && confirmPassword !== password ? 'border-red-300' : 'border-slate-100'} rounded-[1.25rem] px-6 py-4 focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-600 transition-all text-sm font-medium outline-none`}
                  />
                </div>
              </div>

              {error && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-50 text-red-600 text-xs font-bold p-4 rounded-xl border border-red-100"
                  >
                    {error}
                  </motion.div>
              )}

              <button 
                disabled={loading || !token}
                className={`w-full bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-[1.25rem] font-black text-sm uppercase tracking-widest shadow-2xl shadow-blue-200 transition-all ${loading || !token ? 'opacity-70 cursor-not-allowed' : 'active:scale-95'} flex items-center justify-center gap-3`}
              >
                {loading ? 'Đang cập nhật...' : 'Cập nhật mật khẩu'}
                {!loading && <Lock size={18} />}
              </button>
            </form>
          )}

        </motion.div>
      </div>
    </div>
  );
};

export default ResetPassword;
