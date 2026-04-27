import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  MessageSquare, 
  Trash2, 
  Search, 
  User, 
  Clock, 
  ExternalLink,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { API_BASE_URL } from '../config';
import VButton from '../components/VButton';

const AdminComments = () => {
    const [comments, setComments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const token = localStorage.getItem('auth_token');

    const fetchComments = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${API_BASE_URL}/index.php`, {
                params: {
                    module: 'api',
                    action: 'admin/admin_comments',
                    token: token
                }
            });
            if (res.data.status === 'success') {
                setComments(res.data.data);
            }
        } catch (error) {
            console.error('Error fetching comments:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchComments();
    }, []);

    const handleDelete = async (id: number) => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa bình luận này?')) return;

        try {
            const res = await axios.post(`${API_BASE_URL}/index.php?module=api&action=admin/admin_comments&token=${token}`, {
                action: 'delete',
                id: id
            });
            if (res.data.status === 'success') {
                setComments(comments.filter(c => c.id !== id));
            } else {
                alert(res.data.msg);
            }
        } catch (error) {
            console.error('Error deleting comment:', error);
            alert('Lỗi kết nối máy chủ!');
        }
    };

    const filteredComments = comments.filter(c => 
        c.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.news_title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-32">
                <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-6 opacity-20" />
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Đang tải danh sách bình luận...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-10">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1">
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                        Quản lý bình luận
                    </h1>
                    <p className="text-xs font-bold text-slate-400 tracking-widest">Kiểm duyệt và quản lý phản hồi của độc giả</p>
                </div>
                
                <div className="flex items-center gap-4">
                    <div className="bg-white px-6 py-3 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                        <div className="text-right whitespace-nowrap">
                            <p className="text-[10px] font-bold text-slate-400 tracking-tight">
                                Tổng số
                            </p>
                            <p className="text-xl font-black text-slate-900">
                                {comments.length.toLocaleString()}
                            </p>
                        </div>
                        <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                            <MessageSquare size={20} />
                        </div>
                    </div>
                </div>
            </header>

            <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                <div className="relative w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                        type="text" 
                        placeholder="Tìm kiếm nội dung, người dùng hoặc bài báo..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-slate-50 border-none rounded-2xl pl-12 pr-4 py-4 text-sm font-bold text-slate-900 focus:bg-white focus:ring-4 focus:ring-blue-50 transition-all outline-none"
                    />
                </div>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Người dùng</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Nội dung</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Bài viết</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            <AnimatePresence mode="popLayout">
                                {filteredComments.map((comment) => (
                                    <motion.tr 
                                        key={comment.id}
                                        layout
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors group"
                                    >
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                                                    <User size={20} />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-black text-slate-900 leading-none">{comment.fullname}</p>
                                                    <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-tight">{comment.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 max-w-md">
                                            <p className="text-sm font-medium text-slate-700 leading-relaxed mb-2">{comment.content}</p>
                                            <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                                                <Clock size={12} />
                                                {new Date(comment.created_at).toLocaleString('vi-VN')}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 max-w-xs">
                                            <div className="flex items-start gap-2">
                                                <p className="text-xs font-bold text-slate-500 line-clamp-2 leading-snug">{comment.news_title}</p>
                                                <a 
                                                    href={`/news/${comment.news_id}`} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="text-blue-500 hover:text-blue-700 mt-0.5"
                                                >
                                                    <ExternalLink size={14} />
                                                </a>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center justify-center gap-2">
                                                <button 
                                                    onClick={() => handleDelete(comment.id)}
                                                    className="w-10 h-10 rounded-xl bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-sm"
                                                    title="Xóa bình luận"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>

                {filteredComments.length === 0 && (
                    <div className="py-32 text-center flex flex-col items-center justify-center">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6 text-slate-200">
                            <AlertCircle size={40} />
                        </div>
                        <h3 className="text-xl font-black text-slate-900 mb-2">Không tìm thấy bình luận nào</h3>
                        <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">Thử tìm kiếm với từ khóa khác</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminComments;
