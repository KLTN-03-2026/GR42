import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts';
import { 
  Users, Newspaper, Eye, ArrowUpRight, ArrowDownRight, Globe, Loader2, Zap, Sparkles
} from 'lucide-react';
import { API_BASE_URL } from '../config';

const COLORS = ['#2563EB', '#3B82F6', '#60A5FA', '#93C5FD', '#BFDBFE'];

const StatCard = ({ title, value, icon: Icon, color }: any) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm transition-all hover:border-blue-100 flex items-center gap-6">
    <div className={`p-4 rounded-2xl ${color} bg-opacity-10`}>
      <Icon size={24} />
    </div>
    <div>
      <h3 className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-0.5">{title}</h3>
      <p className="text-2xl font-bold text-slate-900 tracking-tight">
        {typeof value === 'number' ? value.toLocaleString() : (value || '...')}
      </p>
    </div>
  </div>
);

const AdminDashboard = () => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<any>(null);
    const token = localStorage.getItem('auth_token');

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const host = window.location.hostname === 'localhost' ? API_BASE_URL.replace('/BE', '') : '';
                const res = await axios.get(`${host}/BE/modules/api/admin/admin_stats.php?token=${token}`);
                if (res.data.status === 'success') {
                    setData(res.data.data);
                }
            } catch (error) {
                console.error('Error fetching admin stats:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, [token]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-32">
                <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Đang tải dữ liệu...</p>
            </div>
        );
    }

    const chartData = data?.categories.map((c: any) => ({
        name: c.category,
        value: parseInt(c.count)
    })) || [];

    const barData = [
        { name: 'T2', value: 400 }, { name: 'T3', value: 300 }, { name: 'T4', value: 600 },
        { name: 'T5', value: 800 }, { name: 'T6', value: 500 }, { name: 'T7', value: 900 }, { name: 'CN', value: 700 },
    ];

    return (
        <div className="space-y-8 max-w-[1400px] mx-auto pb-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Trung tâm Quản trị</h1>
                    <p className="text-slate-500 text-sm mt-1">Tổng quan hoạt động hệ thống tin tức iAI</p>
                </div>
                <div className="flex items-center gap-3 bg-white p-2 rounded-xl border border-slate-100 shadow-sm">
                    <div className="px-4 text-right">
                        <p className="text-[10px] font-bold text-slate-400 uppercase">{localStorage.getItem('user_role')}</p>
                        <p className="text-sm font-bold text-slate-900">{localStorage.getItem('user_name')}</p>
                    </div>
                    <img 
                        src={localStorage.getItem('user_avatar') || `https://api.dicebear.com/7.x/avataaars/svg?seed=Admin`} 
                        className="w-10 h-10 rounded-lg object-cover bg-slate-100" 
                        alt="Admin" 
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <StatCard title="Tổng số Thành viên" value={data?.stats.total_users} icon={Users} color="text-blue-600 bg-blue-600" />
                <StatCard title="Tổng số Bài báo" value={data?.stats.total_news} icon={Newspaper} color="text-indigo-600 bg-indigo-600" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-8 bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider">Tần suất tin tức theo tuần</h3>
                        <div className="flex gap-2 bg-slate-50 p-1 rounded-lg">
                            <button className="px-3 py-1 bg-white shadow-sm rounded-md text-[10px] font-bold">7 ngày</button>
                            <button className="px-3 py-1 text-[10px] font-bold text-slate-400">Tháng</button>
                        </div>
                    </div>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={barData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                                <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="lg:col-span-4 bg-slate-900 p-8 rounded-2xl text-white shadow-sm">
                    <h3 className="font-bold uppercase tracking-wider text-sm mb-8 text-slate-400 text-center">Phân bố danh mục</h3>
                    <div className="h-[220px] relative flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={chartData} innerRadius={60} outerRadius={85} paddingAngle={5} dataKey="value">
                                    {chartData.map((entry: any, index: number) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute flex flex-col items-center pointer-events-none">
                            <span className="text-2xl font-bold">{data?.stats.total_news}</span>
                            <span className="text-[9px] font-bold uppercase text-slate-400">Tin bài</span>
                        </div>
                    </div>
                    <div className="mt-8 space-y-3">
                        {data?.categories.map((item: any, index: number) => (
                            <div key={item.category} className="flex items-center justify-between text-xs">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                                    <span className="text-slate-300 uppercase font-medium">{item.category}</span>
                                </div>
                                <span className="font-bold">{item.count}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                            <Zap size={20} />
                        </div>
                        <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider">Cập nhật gần nhất</h3>
                    </div>
                    <button className="text-xs font-bold text-blue-600 hover:underline">Xem kho tin</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                    {data?.recent_news.map((item: any) => (
                        <div key={item.id} className="group">
                            <div className="aspect-[4/3] rounded-xl overflow-hidden bg-slate-100 mb-3 border border-slate-100 shadow-sm">
                                <img src={item.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform" alt="" />
                            </div>
                            <h4 className="text-xs font-bold text-slate-800 line-clamp-2 leading-tight uppercase mb-2">{item.title}</h4>
                            <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold uppercase">
                                <span>{item.source}</span>
                                <span>{item.pubDate.split(' ')[0]}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;


