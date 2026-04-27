import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { 
  Search, Plus, Eye, Trash2, Loader2, ChevronLeft, ChevronRight, ExternalLink, ShieldCheck,
  CloudDownload, CheckCircle2, AlertCircle, PlusCircle,
  Newspaper
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config';
import VModal from '../components/VModal';
import VButton from '../components/VButton';

const AdminNewsList = () => {
    const navigate = useNavigate();
    const [news, setNews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('');
    const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 10, total_pages: 0 });
    const token = localStorage.getItem('auth_token');

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [newsToDelete, setNewsToDelete] = useState<{id: number, title: string} | null>(null);
    const [deleting, setDeleting] = useState(false);
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

    const [crawling, setCrawling] = useState(false);
    const [isCrawlSuccessModalOpen, setIsCrawlSuccessModalOpen] = useState(false);
    const [crawlResults, setCrawlResults] = useState<{new: number, updated: number, skipped: number, total: number} | null>(null);

    const fetchNews = async (page = 1, search = '', cat = '') => {
        try {
            setLoading(true);
            const res = await axios.get(`${API_BASE_URL}/index.php`, {
                params: { 
                    module: 'api',
                    action: 'admin/admin_news',
                    token, 
                    page, 
                    search, 
                    category: cat, 
                    limit: 10 
                }
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

    const handleDelete = (id: number, title: string) => {
        setNewsToDelete({ id, title });
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!newsToDelete) return;
        
        try {
            setDeleting(true);
            const res = await axios.post(`${API_BASE_URL}/index.php?module=api&action=admin/admin_news&token=${token}`, {
                action: 'delete',
                id: newsToDelete.id
            });
            if (res.data.status === 'success') {
                setIsDeleteModalOpen(false);
                setIsSuccessModalOpen(true);
                fetchNews(pagination.page, searchTerm, filterCategory);
            } else {
                alert('Lỗi: ' + res.data.msg);
            }
        } catch (error) {
            console.error('Error deleting news:', error);
            alert('Lỗi kết nối máy chủ!');
        } finally {
            setDeleting(false);
        }
    };

    const handleView = (id: number) => {
        window.open(`/article/${id}`, '_blank');
    };

    const handleCrawl = async () => {
        if (!window.confirm('Bạn có chắc chắn muốn tiến hành thu thập dữ liệu mới? Quá trình này có thể mất vài phút.')) return;
        
        try {
            setCrawling(true);
            const res = await axios.get(`${API_BASE_URL}/index.php`, {
                params: {
                    module: 'api',
                    action: 'crawl_database'
                }
            });
            
            if (res.data.status === 'success') {
                setCrawlResults({
                    new: res.data.new,
                    updated: res.data.updated,
                    skipped: res.data.skipped,
                    total: res.data.total
                });
                setIsCrawlSuccessModalOpen(true);
                fetchNews(1, searchTerm, filterCategory);
            } else {
                alert('Lỗi: ' + (res.data.message || 'Thất bại khi thu thập dữ liệu'));
            }
        } catch (error) {
            console.error('Error crawling news:', error);
            alert('Lỗi kết nối máy chủ khi thu thập dữ liệu!');
        } finally {
            setCrawling(false);
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
        <div className="space-y-8 pb-10">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1">
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                        Quản lý bài báo
                    </h1>
                    <p className="text-xs font-bold text-slate-400 tracking-widest">Danh sách tin tức và công cụ thu thập dữ liệu tự động</p>
                </div>
                
                <div className="flex items-center gap-4">
                    <div className="bg-white px-6 py-3 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                        <div className="text-right whitespace-nowrap">
                            <p className="text-[10px] font-bold text-slate-400 tracking-tight">
                                Tổng cộng
                            </p>
                            <p className="text-xl font-black text-slate-900">
                                {pagination.total.toLocaleString()}
                            </p>
                        </div>
                        <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                            <Newspaper size={20} />
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <VButton 
                            variant="secondary" 
                            size="md" 
                            icon={CloudDownload}
                            onClick={handleCrawl}
                            loading={crawling}
                        >
                            {crawling ? 'Đang thu thập...' : 'Thu thập dữ liệu'}
                        </VButton>
                        <VButton 
                            variant="primary" 
                            size="md" 
                            icon={PlusCircle}
                            onClick={() => navigate('/admin/news/add')}
                            className="shadow-lg shadow-blue-100"
                        >
                            Thêm bài báo
                        </VButton>
                    </div>
                </div>
            </header>

            <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col lg:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                        type="text" 
                        placeholder="Tìm kiếm tiêu đề, nguồn..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="w-full bg-slate-50 border-none rounded-2xl pl-12 pr-4 py-4 text-sm font-bold text-slate-900 focus:bg-white focus:ring-4 focus:ring-blue-50 transition-all outline-none"
                    />
                    {loading && <div className="absolute right-6 top-1/2 -translate-y-1/2"><Loader2 size={18} className="text-blue-600 animate-spin" /></div>}
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
                                            <button 
                                                onClick={() => handleView(item.id)}
                                                className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                title="Xem bài báo"
                                            >
                                                <Eye size={18} />
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(item.id, item.title)}
                                                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Xóa bài báo"
                                            >
                                                <Trash2 size={18} />
                                            </button>
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

            {}
            <VModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                loading={deleting}
                type="danger"
                title="Xác nhận xóa"
                message={`Bạn có chắc chắn muốn xóa bài báo "${newsToDelete?.title}"? Hành động này không thể hoàn tác.`}
                confirmText="Xóa vĩnh viễn"
                cancelText="Quay lại"
            />

            {}
            <VModal
                isOpen={isSuccessModalOpen}
                onClose={() => setIsSuccessModalOpen(false)}
                type="info"
                title="Thành công"
                message="Bài báo đã được xóa khỏi hệ thống."
                confirmText="Đóng"
                onConfirm={() => setIsSuccessModalOpen(false)}
            />

            {}
            <VModal
                isOpen={isCrawlSuccessModalOpen}
                onClose={() => setIsCrawlSuccessModalOpen(false)}
                type="info"
                title="Thu thập dữ liệu hoàn tất"
                confirmText="Tuyệt vời"
                onConfirm={() => setIsCrawlSuccessModalOpen(false)}
                message={
                    <div className="space-y-4">
                        <p className="text-sm text-slate-500">Quá trình đồng bộ hóa dữ liệu từ nguồn tin đã hoàn thành thành công.</p>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100 text-center">
                                <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">Bài viết mới</p>
                                <p className="text-2xl font-black text-emerald-700">{crawlResults?.new || 0}</p>
                            </div>
                            <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 text-center">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Tổng dữ liệu</p>
                                <p className="text-2xl font-black text-white">{crawlResults?.total || 0}</p>
                            </div>
                        </div>
                    </div>
                }
            />
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

