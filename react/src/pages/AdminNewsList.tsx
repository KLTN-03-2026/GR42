import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { 
  Search, Plus, Eye, Trash2, Loader2, ChevronLeft, ChevronRight, ExternalLink, ShieldCheck
} from 'lucide-react';
import { API_BASE_URL } from '../config';

const AdminNewsList = () => {
    const [news, setNews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('');
    const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 10, total_pages: 0 });
    const token = localStorage.getItem('auth_token');

    const fetchNews = async (page = 1, search = '', cat = '') => {
        try {
            setLoading(true);
            const host = window.location.hostname === 'localhost' ? API_BASE_URL.replace('/BE', '') : '';
            const res = await axios.get(`${host}/BE/modules/api/admin/admin_news.php`, {
                params: { token, page, search, category: cat, limit: 10 }
            });
            if (res.data.status === 'success') {
                setNews(res.data.data);
                setPagination(res.data.pagination);
            }
        } catch (error) {
            console.error('Error fetching admin news:', error);
        } finally {
            setLoading(false);
        }
    };

    const debouncedSearch = useCallback(
        debounce((search: string, cat: string) => {
            fetchNews(1, search, cat);
        }, 500),
        []
    );

    useEffect(() => {
        fetchNews(1, searchTerm, filterCategory);
    }, []);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setSearchTerm(val);
        debouncedSearch(val, filterCategory);
    };

    const handleCategoryChange = (cat: string) => {
        setFilterCategory(cat);
        fetchNews(1, searchTerm, cat);
    };

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= pagination.total_pages) {
            fetchNews(newPage, searchTerm, filterCategory);
        }
    };

    return (
        <div className="space-y-6 max-w-[1400px] mx-auto pb-10 px-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Quản lý Tin tức</h1>
                    <p className="text-slate-500 text-sm mt-1">Tổng cộng {pagination.total.toLocaleString()} bài báo trong hệ thống.</p>
                </div>
                <button className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm flex items-center gap-2 transition-colors">
                    <Plus size={18} />
                    <span>Cào dữ liệu mới</span>
                </button>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col lg:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                        type="text" 
                        placeholder="Tìm kiếm tiêu đề, nguồn..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="w-full bg-slate-50 border border-transparent rounded-lg pl-11 pr-4 py-2.5 text-sm focus:bg-white focus:border-blue-200 outline-none transition-all"
                    />
                    {loading && <div className="absolute right-4 top-1/2 -translate-y-1/2"><Loader2 size={16} className="text-blue-600 animate-spin" /></div>}
                </div>

                <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0">
                    {['', 'thoi-su', 'the-gioi', 'kinh-doanh', 'giai-tri', 'the-thao'].map((cat) => (
                        <button
                            key={cat}
                            onClick={() => handleCategoryChange(cat)}
                            className={`px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                                filterCategory === cat ? 'bg-blue-600 text-white' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                            }`}
                        >
                            {cat === '' ? 'Tất cả' : cat.toUpperCase()}
                        </button>
                    ))}
                </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50 text-slate-500 text-[10px] font-bold uppercase tracking-wider">
                                <th className="px-6 py-4">Bài báo</th>
                                <th className="px-6 py-4 text-center">Chuyên mục</th>
                                <th className="px-6 py-4 text-center">Nguồn</th>
                                <th className="px-6 py-4 text-center">Ngày cập nhật</th>
                                <th className="px-6 py-4 text-right">Hành động</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {news.map((item) => (
                                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <img src={item.image} className="w-12 h-12 rounded-lg object-cover bg-slate-100 border border-slate-100" alt="" />
                                            <div className="max-w-md">
                                                <h4 className="text-sm font-bold text-slate-800 line-clamp-1">{item.title}</h4>
                                                <span className="text-[10px] text-slate-400 font-medium">ID: #{item.id}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded text-[10px] font-bold uppercase">
                                            {item.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex flex-col items-center">
                                            <span className="text-xs font-bold text-slate-700">{item.source}</span>
                                            <a href={item.link} target="_blank" rel="noreferrer" className="text-[10px] text-blue-400 hover:underline flex items-center gap-1">
                                                Link gốc <ExternalLink size={10} />
                                            </a>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center text-xs text-slate-500 font-medium whitespace-nowrap">
                                        {item.pubDate.split(' ')[0]}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Eye size={18} /></button>
                                            <button className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={18} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="px-6 py-4 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100">
                    <p className="text-xs text-slate-500 font-medium">
                        Trang {pagination.page} / {pagination.total_pages} • {pagination.total} bài báo
                    </p>
                    <div className="flex items-center gap-2">
                        <button 
                            onClick={() => handlePageChange(pagination.page - 1)}
                            disabled={pagination.page === 1}
                            className="p-1.5 border border-slate-200 rounded hover:bg-white disabled:opacity-30 transition-colors"
                        >
                            <ChevronLeft size={18} />
                        </button>
                        <div className="flex gap-1">
                            {Array.from({ length: Math.min(5, pagination.total_pages) }, (_, i) => (
                                <button 
                                    key={i + 1}
                                    onClick={() => handlePageChange(i + 1)}
                                    className={`w-8 h-8 rounded text-xs font-bold transition-colors ${
                                        pagination.page === i + 1 ? 'bg-blue-600 text-white' : 'bg-white border border-slate-100 text-slate-500 hover:text-blue-600'
                                    }`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>
                        <button 
                            onClick={() => handlePageChange(pagination.page + 1)}
                            disabled={pagination.page === pagination.total_pages}
                            className="p-1.5 border border-slate-200 rounded hover:bg-white disabled:opacity-30 transition-colors"
                        >
                            <ChevronRight size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

function debounce<T extends (...args: any[]) => void>(func: T, wait: number): T {
    let timeout: NodeJS.Timeout;
    return ((...args: any[]) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    }) as T;
}

export default AdminNewsList;


