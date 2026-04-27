import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, CheckCircle2, Send } from 'lucide-react';
import { motion } from 'framer-motion';
import { API_BASE_URL } from '../config';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      setError("Email bắt buộc phải nhập");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError("Email không đúng định dạng");
      return;
    }

    setError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/?module=api&action=forgot`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: email.trim() })
      });
      
      const data = await response.json();
      
      if (data.status === 'success') {
        setSuccessMsg(data.msg);
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
          <div className="lg:hidden flex justify-center mb-10">
              <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-black shadow-xl shadow-blue-200">K</div>
          </div>

          <Link to="/login" className="inline-flex items-center gap-2 text-xs font-black text-slate-400 hover:text-blue-600 uppercase tracking-widest transition-colors mb-8">
            <ArrowLeft size={16} />
            Quay lại đăng nhập
          </Link>

          <div className="mb-12 text-center">
            <h2 className="text-4xl font-black text-slate-900 tracking-tighter mb-2">Quên mật khẩu?</h2>
            <p className="text-slate-400 font-bold text-sm tracking-tight px-4 leading-relaxed">
              Nhập địa chỉ email đăng ký để nhận liên kết khôi phục
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
              <h3 className="text-xl font-black text-slate-800 mb-2">Kiểm tra hộp thư!</h3>
              <p className="text-sm font-medium text-slate-600 mb-6 leading-relaxed">
                {successMsg}
              </p>
              <button 
                onClick={() => setSuccessMsg('')}
                className="w-full bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 py-4 rounded-xl font-black text-sm uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center"
              >
                Gửi lại email
              </button>
            </motion.div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-2 flex flex-col">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Địa chỉ Email</label>
                <div className="relative">
                  {error && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="absolute -top-2.5 right-4 bg-red-50 text-red-600 text-[9px] uppercase tracking-widest font-black px-2 py-0.5 rounded border border-red-100 shadow-sm z-10"
                      >
                        {error}
                      </motion.div>
                  )}
                  <input 
                    type="text" 
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (error) setError('');
                    }}
                    placeholder="name@gmail.com"
                    disabled={loading}
                    className={`w-full bg-slate-50 border ${error ? 'border-red-300 focus:ring-red-50 focus:border-red-500' : 'border-slate-100 focus:ring-blue-50 focus:border-blue-600'} rounded-[1.25rem] px-6 py-4 focus:bg-white focus:ring-4 transition-all text-sm font-medium outline-none ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  />
                </div>
              </div>

              <button 
                disabled={loading}
                className={`w-full bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-[1.25rem] font-black text-sm uppercase tracking-widest shadow-2xl shadow-blue-200 transition-all ${loading ? 'opacity-70 cursor-not-allowed' : 'active:scale-95'} flex items-center justify-center gap-3`}
              >
                {loading ? 'Đang gửi...' : 'Gửi yêu cầu'}
                {!loading && <Send size={20} />}
              </button>
            </form>
          )}

        </motion.div>
      </div>
    </div>
  );
};

export default ForgotPassword;
