import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  ArrowLeft, Save, Image as ImageIcon, Link as LinkIcon, 
  FileText, Settings, Globe, CheckCircle2, AlertCircle
} from 'lucide-react';
import { API_BASE_URL } from '../config';
import VButton from '../components/VButton';
import VModal from '../components/VModal';

const AdminNewsAdd = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('auth_token');
    
    const [formData, setFormData] = useState({
        title: '',
        category: '',
        thumbnail: '',
        link: '',
        source: '',
        content: '',
        pubDate: new Date().toISOString().slice(0, 19).replace('T', ' ')
    });

    const [loading, setLoading] = useState(false);
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.title || !formData.category) {
            setErrorMsg('Vui lòng nhập đầy đủ tiêu đề và chuyên mục.');
            return;
        }

        try {
            setLoading(true);
            setErrorMsg('');
            const res = await axios.post(`${API_BASE_URL}/index.php?module=api&action=admin/admin_news&token=${token}`, {
                action: 'add',
                ...formData
            });

            if (res.data.status === 'success') {
                setIsSuccessModalOpen(true);
            } else {
                setErrorMsg(res.data.msg || 'Đã xảy ra lỗi khi thêm bài viết.');
            }
        } catch (error) {
            console.error('Error adding news:', error);
            setErrorMsg('Lỗi kết nối máy chủ!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-[1200px] mx-auto pb-20 px-4 pt-4">
            {}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => navigate('/admin/news')}
                        className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:border-blue-100 transition-all shadow-sm active:scale-95"
                    >
                        <ArrowLeft size={24} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-black text-slate-900">Thêm Bài Báo Mới</h1>
                        <p className="text-slate-500 text-sm">Viết bài mới, thêm hình ảnh và chọn chuyên mục.</p>
                    </div>
                </div>
                
                <div className="hidden sm:flex items-center gap-3">
                    <VButton 
                        variant="outline" 
                        size="md"
                        onClick={() => navigate('/admin/news')}
                    >
                        Hủy bỏ
                    </VButton>
                    <VButton 
                        variant="primary" 
                        size="md"
                        icon={Save}
                        loading={loading}
                        onClick={handleSubmit}
                    >
                        Đăng bài viết
                    </VButton>
                </div>
            </div>

            {errorMsg && (
                <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 animate-shake">
                    <AlertCircle size={20} />
                    <p className="text-sm font-bold">{errorMsg}</p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {}
                <div className="lg:col-span-8 space-y-6">
                    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
                        <div className="flex items-center gap-2 mb-2">
                            <FileText size={18} className="text-blue-500" />
                            <h2 className="text-sm font-black uppercase tracking-widest text-slate-400">Nội dung bài viết</h2>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Tiêu đề bài báo <span className="text-red-500">*</span></label>
                                <input 
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    placeholder="Nhập tiêu đề ấn tượng cho bài viết..."
                                    className="w-full bg-slate-50 border-2 border-transparent rounded-2xl px-6 py-4 text-slate-900 font-bold focus:bg-white focus:border-blue-100 outline-none transition-all placeholder:text-slate-300"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Nguồn tin</label>
                                    <input 
                                        type="text"
                                        name="source"
                                        value={formData.source}
                                        onChange={handleChange}
                                        placeholder="Ví dụ: VnExpress, Tuổi Trẻ..."
                                        className="w-full bg-slate-50 border-2 border-transparent rounded-2xl px-6 py-4 text-slate-900 font-bold focus:bg-white focus:border-blue-100 outline-none transition-all placeholder:text-slate-300"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Đường dẫn gốc</label>
                                    <div className="relative">
                                        <LinkIcon className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                        <input 
                                            type="text"
                                            name="link"
                                            value={formData.link}
                                            onChange={handleChange}
                                            placeholder="https://..."
                                            className="w-full bg-slate-50 border-2 border-transparent rounded-2xl pl-14 pr-6 py-4 text-slate-900 font-bold focus:bg-white focus:border-blue-100 outline-none transition-all placeholder:text-slate-300"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Nội dung chi tiết</label>
                                <textarea 
                                    name="content"
                                    value={formData.content}
                                    onChange={handleChange}
                                    rows={12}
                                    placeholder="Nhập nội dung đầy đủ của bài báo tại đây..."
                                    className="w-full bg-slate-50 border-2 border-transparent rounded-[2rem] px-6 py-6 text-slate-900 font-medium leading-relaxed focus:bg-white focus:border-blue-100 outline-none transition-all placeholder:text-slate-300 resize-none"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {}
                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-8">
                        <div className="flex items-center gap-2">
                            <Settings size={18} className="text-slate-400" />
                            <h2 className="text-sm font-black uppercase tracking-widest text-slate-400">Thuộc tính</h2>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Chuyên mục <span className="text-red-500">*</span></label>
                                <select 
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    className="w-full bg-slate-50 border-2 border-transparent rounded-2xl px-6 py-4 text-slate-900 font-bold focus:bg-white focus:border-blue-100 outline-none transition-all appearance-none cursor-pointer"
                                >
                                    <option value="">Chọn chuyên mục</option>
                                    <option value="Thời sự">Thời sự</option>
                                    <option value="Thế giới">Thế giới</option>
                                    <option value="Kinh doanh">Kinh doanh</option>
                                    <option value="Giải trí">Giải trí</option>
                                    <option value="Thể thao">Thể thao</option>
                                    <option value="Công nghệ">Công nghệ</option>
                                    <option value="Giáo dục">Giáo dục</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 ml-1">Ảnh bìa (URL)</label>
                                <div className="space-y-4">
                                    <div className="aspect-video bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center overflow-hidden group transition-all hover:border-blue-200">
                                        {formData.thumbnail ? (
                                            <img src={formData.thumbnail} alt="Preview" className="w-full h-full object-cover" />
                                        ) : (
                                            <>
                                                <ImageIcon size={32} className="text-slate-300 mb-2 group-hover:text-blue-300 transition-colors" />
                                                <p className="text-[10px] font-bold text-slate-400">Xem trước hình ảnh</p>
                                            </>
                                        )}
                                    </div>
                                    <div className="relative">
                                        <Globe className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                        <input 
                                            type="text"
                                            name="thumbnail"
                                            value={formData.thumbnail}
                                            onChange={handleChange}
                                            placeholder="https://..."
                                            className="w-full bg-slate-50 border-2 border-transparent rounded-2xl pl-14 pr-6 py-4 text-xs font-bold focus:bg-white focus:border-blue-100 outline-none transition-all placeholder:text-slate-300"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-slate-50">
                            <VButton 
                                variant="primary" 
                                fullWidth
                                icon={Save}
                                loading={loading}
                                onClick={handleSubmit}
                            >
                                Đăng bài viết
                            </VButton>
                        </div>
                    </div>
                </div>
            </form>

            {}
            <VModal
                isOpen={isSuccessModalOpen}
                onClose={() => navigate('/admin/news')}
                type="success"
                title="Đã đăng bài viết!"
                message="Bài báo mới của bạn đã được lưu thành công vào hệ thống."
                confirmText="Quay lại danh sách"
                onConfirm={() => navigate('/admin/news')}
            />
        </div>
    );
};

export default AdminNewsAdd;
