import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts';
import { 
  Users, Newspaper, MessageSquare, LineChart, Plus, UserPlus, 
  Activity, ChevronRight, Clock, User, MessageCircle, Zap,
  Loader2
} from 'lucide-react';
import { motion } from 'framer-motion';
import { API_BASE_URL } from '../config';
import VButton from '../components/VButton';

const COLORS = ['#2563EB', '#3B82F6', '#60A5FA', '#93C5FD', '#BFDBFE'];

const normalizeImageUrl = (url: string | undefined) => {
    if (!url) return 'https://images.unsplash.com/photo-1504711434969-e33886168f5a?q=80&w=2070&auto=format&fit=crop';
    if (url.startsWith('/')) return `${API_BASE_URL.replace('/BE', '')}${url}`;
    return url;
};

const StatCard = ({ title, value, icon: Icon, color, delay }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm transition-all hover:shadow-xl hover:border-blue-100 group relative overflow-hidden"
  >
    <div className={`absolute top-0 right-0 w-24 h-24 ${color} opacity-[0.03] rounded-full -mr-8 -mt-8 transition-transform group-hover:scale-150 duration-700`}></div>
    <div className="flex items-center gap-6 relative z-10">
      <div className={`w-14 h-14 rounded-2xl ${color} bg-opacity-10 flex items-center justify-center text-current`}>
        <Icon size={28} className={color.replace('bg-', 'text-')} />
      </div>
      <div>
        <h3 className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">{title}</h3>
        <p className="text-3xl font-black text-slate-900 tracking-tight">
          {typeof value === 'number' ? value.toLocaleString() : (value || '...')}
        </p>
      </div>
    </div>
  </motion.div>
);

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<any>(null);
    const [crawling, setCrawling] = useState(false);
    const token = localStorage.getItem('auth_token');
    const userName = localStorage.getItem('user_name') || 'Admin';

    const fetchStats = useCallback(async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/index.php`, {
                params: {
                    module: 'api',
                    action: 'admin/admin_stats',
                    token: token
                }
            });
            if (res.data.status === 'success') {
                setData(res.data.data);
            }
        } catch (error) {
            console.error('Error fetching admin stats:', error);
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    const handleRunCrawl = async () => {
        if (!window.confirm('Bạn có chắc chắn muốn tiến hành thu thập dữ liệu mới?')) return;
        
        try {
            setCrawling(true);
            const host = window.location.hostname === 'localhost' ? API_BASE_URL.replace('/BE', '') : '';
            const res = await axios.get(`${host}/BE/modules/api/crawl_database.php`);
            
            if (res.data.status === 'success') {
                alert(`Thành công! Đã thêm: ${res.data.new} - Cập nhật: ${res.data.updated} bài báo.`);
                fetchStats();
            } else {
                alert('Lỗi: ' + (res.data.message || 'Thất bại'));
            }
        } catch (error) {
            console.error(error);
            alert('Lỗi kết nối máy chủ!');
        } finally {
            setCrawling(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-32">
                <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-6 opacity-20" />
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Đang khởi tạo dữ liệu quản trị...</p>
            </div>
        );
    }

    const chartData = data?.categories.map((c: any) => ({
        name: c.category,
        value: parseInt(c.count)
    })) || [];

    const dayNames = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
    const barData = data?.weekly_news?.map((item: any) => {
        const date = new Date(item.date);
        return {
            name: dayNames[date.getDay()],
            value: parseInt(item.count)
        };
    }) || [];

    return (
        <div className="space-y-8 max-w-[1400px] mx-auto pb-20 px-4 md:px-0">
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2.5rem] p-8 md:p-12 text-white shadow-2xl shadow-blue-200"
            >
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-400/20 rounded-full -ml-32 -mb-32 blur-2xl"></div>
                
                <div className="relative z-10 max-w-2xl">
                    <div className="flex items-center gap-3 mb-6">
                        <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-lg text-[10px] font-black uppercase tracking-[0.2em]">
                            Quản lý Hệ thống
                        </span>
                        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-4">
                        Xin chào, {userName}! 👋
                    </h1>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Tổng Thành viên" value={data?.stats.total_users} icon={Users} color="bg-blue-500" delay={0.1} />
                <StatCard title="Tổng Bài báo" value={data?.stats.total_news} icon={Newspaper} color="bg-indigo-500" delay={0.2} />
                <StatCard title="Bình luận mới" value={data?.stats.total_comments} icon={MessageSquare} color="bg-violet-500" delay={0.3} />
                <StatCard title="Truy cập hôm nay" value={data?.stats.today_visits} icon={LineChart} color="bg-sky-500" delay={0.4} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-8 space-y-8">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm"
                    >
                        <div className="flex items-center justify-between mb-10">
                            <div>
                                <h3 className="font-black text-slate-900 text-sm uppercase tracking-wider mb-1">Tần suất đăng bài</h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Dữ liệu cập nhật theo tuần</p>
                            </div>
                            <div className="flex gap-2 bg-slate-50 p-1.5 rounded-2xl">
                                <button className="px-4 py-2 bg-white shadow-sm rounded-xl text-[10px] font-black uppercase tracking-widest text-blue-600">7 Ngày</button>
                                <button className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors">Tháng</button>
                            </div>
                        </div>
                        <div className="h-[350px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={barData}>
                                    <defs>
                                        <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#3b82f6" />
                                            <stop offset="100%" stopColor="#60a5fa" />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 800, fill: '#94a3b8' }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 800, fill: '#94a3b8' }} />
                                    <Tooltip 
                                        cursor={{ fill: '#f8fafc' }}
                                        contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '15px' }}
                                        labelStyle={{ fontWeight: 900, marginBottom: '5px', textTransform: 'uppercase', fontSize: '10px' }}
                                    />
                                    <Bar dataKey="value" fill="url(#barGradient)" radius={[8, 8, 0, 0]} barSize={45} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>

                    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
                                    <Zap size={20} />
                                </div>
                                <div>
                                    <h3 className="font-black text-slate-900 text-sm uppercase tracking-wider">Cập nhật tin tức</h3>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Các bài báo mới nhất trong hệ thống</p>
                                </div>
                            </div>
                            <VButton variant="ghost" size="sm" onClick={() => navigate('/admin/news')}>Xem tất cả</VButton>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                            {data?.recent_news.map((item: any, idx: number) => (
                                <motion.div 
                                    key={item.id} 
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.6 + (idx * 0.05) }}
                                    className="group cursor-pointer"
                                    onClick={() => navigate(`/admin/news/edit/${item.id}`)}
                                >
                                    <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 mb-4 border border-slate-50 shadow-sm relative">
                                        <img 
                                            src={normalizeImageUrl(item.image)} 
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                                            alt="" 
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1504711434969-e33886168f5a?q=80&w=2070&auto=format&fit=crop';
                                            }}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                                            <span className="text-[8px] font-black text-white uppercase tracking-widest">Chỉnh sửa</span>
                                        </div>
                                    </div>
                                    <h4 className="text-[11px] font-black text-slate-800 line-clamp-2 leading-tight uppercase mb-2 group-hover:text-blue-600 transition-colors">{item.title}</h4>
                                    <div className="flex justify-between items-center text-[9px] text-slate-400 font-bold uppercase tracking-tighter">
                                        <span>{item.source}</span>
                                        <span className="flex items-center gap-1"><Clock size={10} /> {item.pubDate.split(' ')[0]}</span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-4 space-y-8">
                    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                        <h3 className="font-black text-slate-900 text-sm uppercase tracking-wider mb-8 flex items-center gap-3">
                            <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div>
                            Thao tác nhanh
                        </h3>
                        <div className="space-y-4">
                            <QuickActionBtn 
                                icon={Plus} 
                                label="Thêm Bài Báo Mới" 
                                color="bg-blue-600" 
                                onClick={() => navigate('/admin/news/add')} 
                            />
                            <QuickActionBtn 
                                icon={UserPlus} 
                                label="Thêm Người Dùng" 
                                color="bg-indigo-600" 
                                onClick={() => navigate('/admin/users/add')} 
                            />
                            <QuickActionBtn 
                                icon={MessageCircle} 
                                label="Duyệt Bình Luận" 
                                color="bg-violet-600" 
                                badge={data?.stats.today_comments}
                                onClick={() => navigate('/admin/comments')} 
                            />
                            <button 
                                onClick={handleRunCrawl}
                                disabled={crawling}
                                className="w-full flex items-center justify-between p-5 rounded-[1.5rem] bg-slate-50 border border-slate-100 hover:border-emerald-200 hover:bg-emerald-50 transition-all group disabled:opacity-50"
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-100 group-hover:scale-110 transition-transform ${crawling ? 'animate-spin' : ''}`}>
                                        <Activity size={24} />
                                    </div>
                                    <span className="font-black text-xs text-slate-700 uppercase tracking-widest group-hover:text-emerald-700 transition-colors">
                                        {crawling ? 'Đang thu thập...' : 'Chạy Thu Thập Dữ Liệu'}
                                    </span>
                                </div>
                                <ChevronRight size={18} className="text-slate-300 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
                            </button>
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden group">
                        <h3 className="font-black uppercase tracking-widest text-[10px] mb-8 text-slate-400 text-center">Phân bố danh mục</h3>
                        <div className="h-[250px] relative flex items-center justify-center">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={chartData} innerRadius={70} outerRadius={95} paddingAngle={8} dataKey="value" stroke="none">
                                        {chartData.map((entry: any, index: number) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip 
                                        contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', fontSize: '10px', fontWeight: 800, textTransform: 'uppercase' }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="absolute flex flex-col items-center pointer-events-none group-hover:scale-110 transition-transform duration-500">
                                <span className="text-3xl font-black text-slate-900 tracking-tighter">{data?.stats.total_news}</span>
                                <span className="text-[8px] font-black uppercase text-slate-400 tracking-[0.3em]">Tin bài</span>
                            </div>
                        </div>
                        <div className="mt-8 grid grid-cols-2 gap-3">
                            {data?.categories.map((item: any, index: number) => (
                                <div key={item.category} className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-transparent hover:border-blue-100 transition-colors">
                                    <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                                    <span className="text-[9px] text-slate-600 uppercase font-black tracking-tight flex-1 line-clamp-1">{item.category}</span>
                                    <span className="text-[9px] font-black text-slate-900">{item.count}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const QuickActionBtn = ({ icon: Icon, label, color, onClick, badge }: any) => (
    <button 
        onClick={onClick}
        className="w-full flex items-center justify-between p-5 rounded-[1.5rem] bg-slate-50 border border-slate-100 hover:border-blue-200 hover:bg-blue-50 transition-all group"
    >
        <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl ${color} text-white flex items-center justify-center shadow-lg shadow-blue-100 group-hover:scale-110 transition-transform`}>
                <Icon size={24} />
            </div>
            <div className="flex flex-col items-start">
                <span className="font-black text-xs text-slate-700 uppercase tracking-widest group-hover:text-blue-700 transition-colors">{label}</span>
                {badge && <span className="text-[8px] font-black bg-red-500 text-white px-2 py-0.5 rounded-full mt-1">+{badge} Mới</span>}
            </div>
        </div>
        <ChevronRight size={18} className="text-slate-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
    </button>
);

export default AdminDashboard;

