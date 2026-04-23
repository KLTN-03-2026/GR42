import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { API_BASE_URL, PROJECT_FOLDER } from '../config';
import { ArrowRight, Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const userRole = localStorage.getItem('user_role');
  const token = localStorage.getItem('auth_token');

  useEffect(() => {
    if (token && !location.search.includes('token=')) {
        if (userRole === 'admin') {
            navigate('/admin');
        } else {
            navigate('/');
        }
    }
  }, [token, userRole, navigate, location]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    const name = params.get('name');
    const avatar = params.get('avatar');
    const role = params.get('role');

    if (token) {
      localStorage.setItem('auth_token', token);
      if (name) {
        localStorage.setItem('user_name', decodeURIComponent(name));
      }
      if (avatar) {
        localStorage.setItem('user_avatar', decodeURIComponent(avatar));
      }
      if (role) {
        localStorage.setItem('user_role', role);
      }
      const email = params.get('email');
      if (email) {
        localStorage.setItem('user_email', decodeURIComponent(email));
      }
      
      if (role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    }
  }, [location, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Vui lòng nhập đầy đủ thông tin');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/?module=api&action=login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const result = await response.json();

      if (result.status === 'success') {
        localStorage.setItem('auth_token', result.data.token);
        localStorage.setItem('user_name', result.data.name);
        if (result.data.avatar) {
          localStorage.setItem('user_avatar', result.data.avatar);
        }
        localStorage.setItem('user_role', result.data.role);
        if (result.data.email) {
            localStorage.setItem('user_email', result.data.email);
        }

        if (result.data.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      } else {
        setError(result.msg);
      }
    } catch (err) {
      setError('Lỗi kết nối máy chủ. Vui lòng thử lại sau');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    const client_id = "406500628615-c725efu1d7ijrg41ekuuv0m32uvqdafo.apps.googleusercontent.com";
    const redirect_uri = `${window.location.protocol}//${window.location.hostname}${PROJECT_FOLDER}/BE/?module=auth&action=google_callback`;
    const scope = "email profile";
    const google_login_url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${client_id}&redirect_uri=${encodeURIComponent(redirect_uri)}&response_type=code&scope=${encodeURIComponent(scope)}&access_type=offline&prompt=select_account&state=react`;
    window.location.href = google_login_url;
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

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-20 bg-[#F9FAFB] relative overflow-y-auto">
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

          <div className="mb-12 text-center">
            <h2 className="text-4xl font-black text-slate-900 tracking-tighter mb-2">Chào mừng quay trở lại</h2>
            <p className="text-slate-400 font-bold text-sm tracking-tight uppercase">Vui lòng nhập thông tin để đăng nhập</p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 text-red-600 text-sm font-bold p-4 rounded-xl border border-red-100 flex items-center gap-3"
              >
                {error}
              </motion.div>
            )}
            <div className="space-y-2 flex flex-col">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Địa chỉ Email</label>
              <input
                type="text"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError('');
                }}
                disabled={loading}
                placeholder="name@gmail.com"
                className={`w-full bg-slate-50 border ${error ? 'border-red-300 focus:ring-red-50 focus:border-red-500' : 'border-slate-100 focus:ring-blue-50 focus:border-blue-600'} rounded-[1.25rem] px-6 py-4 focus:bg-white focus:ring-4 transition-all text-sm font-medium outline-none ${loading ? 'opacity-50' : ''}`}
              />
            </div>

            <div className="space-y-2 flex flex-col">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Mật khẩu</label>
                <Link to="/forgot-password" className="text-[10px] font-black text-blue-600 hover:underline uppercase tracking-tighter">Quên mật khẩu?</Link>
              </div>
              <div className="relative group">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError('');
                  }}
                  disabled={loading}
                  placeholder="••••••••"
                  className={`w-full bg-slate-50 border ${error ? 'border-red-300 focus:ring-red-50 focus:border-red-500' : 'border-slate-100 focus:ring-blue-50 focus:border-blue-600'} rounded-[1.25rem] px-6 py-4 focus:bg-white focus:ring-4 transition-all text-sm font-medium outline-none ${loading ? 'opacity-50' : ''}`}
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

            <button
              disabled={loading}
              className={`w-full bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-[1.25rem] font-black text-sm uppercase tracking-widest shadow-2xl shadow-blue-200 transition-all flex items-center justify-center gap-3 ${loading ? 'opacity-70 cursor-not-allowed' : 'active:scale-95'}`}
            >
              {loading ? 'Đang xử lý...' : 'Đăng nhập ngay'}
              {!loading && <ArrowRight size={20} />}
            </button>
          </form>

          <div className="flex items-center my-10 justify-center">
            <div className="flex-grow border-t border-slate-200"></div>
            <span className="px-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Hoặc tiếp tục với</span>
            <div className="flex-grow border-t border-slate-200"></div>
          </div>

          <div className="flex justify-center flex-col">
            <button
              type="button"
              onClick={() => handleGoogleLogin()}
              className="w-full flex items-center justify-center gap-3 py-4 bg-white border border-slate-100 rounded-2xl hover:bg-slate-50 hover:shadow-lg hover:shadow-slate-100 transition-all font-bold text-sm text-slate-700 shadow-sm active:scale-95"
            >
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
              Tiếp tục với Google
            </button>
          </div>

          <div className="mt-12 text-center">
            <p className="text-sm text-slate-500 font-bold">
              Chưa có tài khoản?{' '}
              <Link to="/register" className="text-blue-600 hover:underline ml-1">Tạo tài khoản mới</Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
