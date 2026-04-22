import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, UserPlus, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { API_BASE_URL } from '../config';

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [globalError, setGlobalError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGlobalError('');
    setFieldErrors({});
    setSuccessMsg('');
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/?module=api&action=register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          fullname: name,
          email: email,
          password: password,
          confirm_password: password
        })
      });
      
      const data = await response.json();
      
      if (data.status === 'success') {
        setSuccessMsg(data.msg);
      } else {
        if (data.errors && Object.keys(data.errors).length > 0) {
          setFieldErrors(data.errors);
        } else {
          setGlobalError(data.msg || 'Đã có lỗi xảy ra!');
        }
      }
    } catch (err) {
      setGlobalError('Lỗi kết nối đến máy chủ. Vui lòng thử lại!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex overflow-hidden font-inter">
      <div className="hidden lg:flex lg:w-1/2 relative bg-white items-center justify-center overflow-hidden">
        {/* Animated Background Elements */}
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

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-20 bg-[#F9FAFB] relative overflow-y-auto pt-24 lg:pt-20">
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-blue-600/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-blue-600/5 rounded-full blur-3xl"></div>

        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md relative z-10"
        >
          <div className="lg:hidden flex justify-center mb-10">
              <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-black">K</div>
          </div>

          <div className="mb-12">
            <h2 className="text-4xl font-black text-slate-900 tracking-tighter mb-2">Tạo tài khoản mới</h2>
            <p className="text-slate-400 font-bold text-sm tracking-tight uppercase">Khám phá vũ trụ tin tức cùng Gemini AI</p>
          </div>

          {successMsg ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-green-50 border border-green-100 rounded-2xl p-6 text-center shadow-sm"
            >
              <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 size={32} />
              </div>
              <h3 className="text-xl font-black text-slate-800 mb-2">Đăng ký thành công!</h3>
              <p className="text-sm font-medium text-slate-600 mb-6 leading-relaxed">
                {successMsg}
              </p>
              <Link 
                to="/login"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-black text-sm uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                Đến trang Đăng nhập <ArrowRight size={18} />
              </Link>
            </motion.div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit}>
              
              {globalError && (
                <div className="bg-red-50 text-red-600 text-sm font-bold p-4 rounded-xl border border-red-100 flex items-center gap-3">
                  {globalError}
                </div>
              )}

              <div className="space-y-2 flex flex-col">
                <div className="flex justify-between items-end">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Họ và tên</label>
                  {fieldErrors.fullname && <span className="text-[10px] font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded mr-1">{fieldErrors.fullname}</span>}
                </div>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if(fieldErrors.fullname) setFieldErrors({...fieldErrors, fullname: ''});
                  }}
                  disabled={loading}
                  placeholder="Nguyễn Văn A"
                  className={`w-full bg-slate-50 border ${fieldErrors.fullname ? 'border-red-300 focus:ring-red-50 focus:border-red-500' : 'border-slate-100 focus:ring-blue-50 focus:border-blue-600'} rounded-[1.25rem] px-6 py-4 focus:bg-white focus:ring-4 transition-all text-sm font-medium outline-none ${loading ? 'opacity-50' : ''}`}
                />
              </div>

              <div className="space-y-2 flex flex-col">
                <div className="flex justify-between items-end">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Địa chỉ Email</label>
                  {fieldErrors.email && <span className="text-[10px] font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded mr-1">{fieldErrors.email}</span>}
                </div>
                <input 
                  type="text" 
                  value={email}
                  disabled={loading}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if(fieldErrors.email) setFieldErrors({...fieldErrors, email: ''});
                  }}
                  placeholder="name@gmail.com"
                  className={`w-full bg-slate-50 border ${fieldErrors.email ? 'border-red-300 focus:ring-red-50 focus:border-red-500' : 'border-slate-100 focus:ring-blue-50 focus:border-blue-600'} rounded-[1.25rem] px-6 py-4 focus:bg-white focus:ring-4 transition-all text-sm font-medium outline-none ${loading ? 'opacity-50' : ''}`}
                />
              </div>

              <div className="space-y-2 flex flex-col">
                <div className="flex justify-between items-end">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Mật khẩu</label>
                  {fieldErrors.password && <span className="text-[10px] font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded mr-1">{fieldErrors.password}</span>}
                </div>
                <div className="relative group">
                  <input 
                    type={showPassword ? 'text' : 'password'} 
                    value={password}
                    disabled={loading}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if(fieldErrors.password) setFieldErrors({...fieldErrors, password: ''});
                    }}
                    placeholder="Tối thiểu 6 ký tự"
                    className={`w-full bg-slate-50 border ${fieldErrors.password ? 'border-red-300 focus:ring-red-50 focus:border-red-500' : 'border-slate-100 focus:ring-blue-50 focus:border-blue-600'} rounded-[1.25rem] px-6 py-4 focus:bg-white focus:ring-4 transition-all text-sm font-medium outline-none ${loading ? 'opacity-50' : ''}`}
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="flex items-start gap-3 px-1 pb-4">
                  <input type="checkbox" required id="terms" className="mt-1 w-5 h-5 rounded-lg border-slate-200 text-blue-600 focus:ring-blue-100 cursor-pointer" />
                  <label htmlFor="terms" className="text-[11px] text-slate-500 font-bold leading-relaxed cursor-pointer">
                      Tôi đồng ý với <Link to="/terms" className="text-blue-600 hover:underline">Điều khoản</Link> & <Link to="/privacy" className="text-blue-600 hover:underline">Chính sách bảo mật</Link> của KLTN NEWS.
                  </label>
              </div>

              <button 
                disabled={loading}
                className={`w-full bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-[1.25rem] font-black text-sm uppercase tracking-widest shadow-2xl shadow-blue-200 transition-all flex items-center justify-center gap-3 ${loading ? 'opacity-70 cursor-not-allowed' : 'active:scale-95'}`}
              >
                {loading ? 'Đang xử lý...' : 'Tạo tài khoản ngay'}
                {!loading && <ArrowRight size={20} />}
              </button>
            </form>
          )}

          <div className="mt-12 pt-8 border-t border-slate-50 text-center">
            <p className="text-sm text-slate-500 font-bold">
              Đã có tài khoản?{' '}
              <Link to="/login" className="text-blue-600 hover:underline ml-1">Đăng nhập tại đây</Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
