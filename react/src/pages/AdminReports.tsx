import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { 
    Bell, 
    CheckCircle2, 
    Clock, 
    ExternalLink, 
    Loader2,
    ShieldAlert,
    Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { API_BASE_URL } from '../config';
import VButton from '../components/VButton';
import { encodeId } from '../utils/idEncoder';

const AdminReports = () => {
    const [reports, setReports] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem('auth_token');

    const fetchReports = useCallback(async () => {
        try {
            setLoading(true);
            const host = window.location.hostname === 'localhost' ? API_BASE_URL.replace('/BE', '') : '';
            const res = await axios.get(`${host}/BE/modules/api/admin/reports_get.php?token=${token}`);
            if (res.data.status === 'success') {
                setReports(res.data.data);
            }
        } catch (error) {
            console.error('Error fetching reports:', error);
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        fetchReports();
    }, [fetchReports]);

    const handleAction = async (id: number, action: 'process' | 'delete') => {
        if (!window.confirm(`Xác nhận ${action === 'process' ? 'đã xử lý' : 'xóa'} báo cáo này?`)) return;
        
        try {
            const host = window.location.hostname === 'localhost' ? API_BASE_URL.replace('/BE', '') : '';
            const res = await axios.post(`${host}/BE/modules/api/admin/reports_action.php`, {
                id,
                action,
                token
            });
            if (res.data.status === 'success') {
                fetchReports();
            } else {
                alert(res.data.message);
            }
        } catch (error) {
            console.error('Error handling report action:', error);
        }
    };

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-10">
                <div className="space-y-1">
                    <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase flex items-center gap-3">
                        <ShieldAlert className="text-blue-600" size={32} />
                        Quản lý báo cáo bài viết
                    </h2>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Danh sách các bài viết bị người dùng báo cáo vi phạm</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="px-4 py-2 bg-blue-50 text-blue-600 rounded-xl text-xs font-black uppercase tracking-widest border border-blue-100">
                        {reports.length} Báo cáo
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[3rem] border border-slate-100 shadow-sm">
                    <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-6 opacity-20" />
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Đang tải danh sách báo cáo...</p>
                </div>
            ) : reports.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[3rem] border border-slate-100 shadow-sm">
                    <div className="w-20 h-20 bg-slate-50 text-slate-300 rounded-3xl flex items-center justify-center mb-6">
                        <Bell size={40} />
                    </div>
                    <h3 className="text-xl font-black text-slate-900 mb-2">Chưa có báo cáo nào</h3>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Tuyệt vời! Hiện tại không có bài viết nào bị báo cáo.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    <AnimatePresence>
                        {reports.map((report, index) => (
                            <motion.div
                                key={report.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ delay: index * 0.05 }}
                                className={`bg-white rounded-[2.5rem] border ${report.status === 1 ? 'border-slate-100 opacity-60' : 'border-blue-100 shadow-xl shadow-blue-100/20'} p-8 transition-all hover:shadow-2xl overflow-hidden relative group`}
                            >
                                <div className="flex flex-col lg:flex-row gap-8 items-start relative z-10">
                                    <div className="flex-1 space-y-6">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                                    report.status === 1 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                                                }`}>
                                                    {report.status === 1 ? 'Đã xử lý' : 'Chờ xử lý'}
                                                </span>
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                                                    <Clock size={12} /> {report.created_at}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {report.status === 0 && (
                                                    <VButton 
                                                        variant="ghost" size="sm" 
                                                        className="text-green-600 hover:bg-green-50 rounded-xl"
                                                        onClick={() => handleAction(report.id, 'process')}
                                                    >
                                                        <CheckCircle2 size={16} className="mr-2" /> Đánh dấu đã xử lý
                                                    </VButton>
                                                )}
                                                <VButton 
                                                    variant="ghost" size="sm" 
                                                    className="text-red-500 hover:bg-red-50 rounded-xl"
                                                    onClick={() => handleAction(report.id, 'delete')}
                                                >
                                                    <Trash2 size={16} />
                                                </VButton>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100">
                                                <div className="flex items-center gap-3 mb-3">
                                                    <ShieldAlert size={18} className="text-red-500" />
                                                    <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">Lý do: {report.reason}</h4>
                                                </div>
                                                {report.details && (
                                                    <p className="text-xs font-bold text-slate-600 leading-relaxed italic">
                                                        "{report.details}"
                                                    </p>
                                                )}
                                            </div>

                                            <div className="flex gap-4 items-center">
                                                <div className="w-16 h-16 bg-slate-100 rounded-2xl overflow-hidden shrink-0 border border-slate-50 shadow-sm">
                                                    <img src={report.news_image} className="w-full h-full object-cover" alt="" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest block mb-1">{report.news_category}</span>
                                                    <h5 className="text-sm font-black text-slate-800 line-clamp-1 group-hover:text-blue-600 transition-colors">{report.news_title}</h5>
                                                    <div className="flex items-center gap-3 mt-1.5">
                                                        <div className="flex items-center gap-1.5">
                                                            <div className="w-4 h-4 bg-blue-100 rounded-md flex items-center justify-center text-[8px] font-black text-blue-600">U</div>
                                                            <span className="text-[10px] font-bold text-slate-500">{report.reporter_name}</span>
                                                        </div>
                                                        <a 
                                                            href={`/article/${encodeId(report.news_id)}`} target="_blank" rel="noreferrer"
                                                            className="flex items-center gap-1 text-[9px] font-black text-blue-600 uppercase tracking-widest hover:underline"
                                                        >
                                                            Xem bài báo <ExternalLink size={10} />
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
};

export default AdminReports;
