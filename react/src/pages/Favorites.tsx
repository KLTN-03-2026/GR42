import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import NewsCard, { NewsItem } from '../components/NewsCard';
import { Heart, Loader2, Newspaper, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { API_BASE_URL } from '../config';

const Favorites = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const isAdminPath = location.pathname.startsWith('/admin');
    const [news, setNews] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem('auth_token');

    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }

        const fetchFavorites = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${API_BASE_URL}/index.php`, {
                    params: {
                        module: 'api',
                        action: 'favorites',
                        token: token,
                        action_type: 'list'
                    }
                });

                if (response.data.status === 'success') {
                    
                    const favNews = response.data.data.map((item: any) => ({
                        ...item,
                        is_favourite: true
                    }));
                    setNews(favNews);
                }
            } catch (error) {
                console.error('Error fetching favorites:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchFavorites();
    }, [token, navigate]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-40 bg-background">
                <Loader2 className="w-12 h-12 text-red-500 animate-spin mb-6 opacity-20" />
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Đang tải danh sách yêu thích...</p>
            </div>
        );
    }

    return (
        <div className={`${isAdminPath ? '' : 'max-w-7xl mx-auto px-6 py-12 min-h-screen bg-[#F9F9FC]'}`}>
            <header className={`${isAdminPath ? 'mb-8' : 'mb-16'}`}>
                
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter mb-4 flex items-center gap-4">
                            <Heart className="text-red-500 fill-current" size={40} />
                            TIN ĐÃ LƯU
                        </h1>
                        <p className="text-slate-500 font-bold text-sm uppercase tracking-widest">
                            Bạn có {news.length} bài báo đã yêu thích
                        </p>
                    </div>
                </div>
            </header>

            {news.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                    {news.map((item) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <NewsCard item={item} />
                        </motion.div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-32 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-100">
                    <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-slate-200 mx-auto mb-6 shadow-sm">
                        <Newspaper size={40} />
                    </div>
                    <h3 className="text-xl font-black text-slate-900 mb-2">Chưa có bài báo nào được lưu</h3>
                    <p className="text-slate-400 font-bold text-sm mb-8">Hãy khám phá tin tức và lưu lại những bài báo bạn quan tâm nhé!</p>
                    <button 
                        onClick={() => navigate('/')}
                        className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition-all active:scale-95 shadow-xl shadow-blue-100"
                    >
                        Khám phá ngay
                    </button>
                </div>
            )}
        </div>
    );
};

export default Favorites;
