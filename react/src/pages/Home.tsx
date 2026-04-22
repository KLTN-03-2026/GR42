import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Search, Heart, MessageCircle, Share2, Loader2 } from 'lucide-react';
import { API_BASE_URL } from '../config';
import VButton from '../components/VButton';
import NewsCard, { NewsItem } from '../components/NewsCard';
import { CategoryBadge } from '../components/CategoryUI';

const categories = [
  { id: '', name: 'Tất cả' },
  { id: 'doi-song', name: 'Đời Sống' },
  { id: 'kinh-doanh', name: 'Kinh Doanh' },
  { id: 'giao-duc', name: 'Giáo Dục' },
  { id: 'the-gioi', name: 'Thế Giới' },
  { id: 'phap-luat', name: 'Pháp Luật' },
  { id: 'thoi-su', name: 'Thời Sự' },
  { id: 'giai-tri', name: 'Giải Trí' },
  { id: 'suc-khoe', name: 'Sức Khỏe' },
  { id: 'cong-nghe', name: 'Công Nghệ' },
  { id: 'the-thao', name: 'Thể Thao' }
];

const Home = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const currentKeyword = searchParams.get('keyword') || '';
  
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchNews = async (pageNum: number, category: string, reset = false) => {
    try {
      setLoading(true);
      if (reset) setNews([]);
      const authToken = localStorage.getItem('auth_token');
      const response = await axios.get(`${API_BASE_URL}/index.php`, {
        params: {
          module: 'api',
          action: 'news_load',
          page: pageNum,
          category: category,
          keyword: currentKeyword,
          perPage: 12,
          token: authToken
        }
      });

      if (response.data.status === 'success') {
        const fetchedNews = response.data.data;
        if (reset) {
          setNews(fetchedNews);
        } else {
          setNews(prev => [...prev, ...fetchedNews]);
        }
        setHasMore(pageNum < response.data.pagination.totalPages);
      }
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews(1, selectedCategory, true);
    setPage(1);
    window.scrollTo(0, 0);
  }, [selectedCategory, currentKeyword]);

  useEffect(() => {
    if (!hasMore || loading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          const nextPage = page + 1;
          setPage(nextPage);
          fetchNews(nextPage, selectedCategory);
        }
      },
      { threshold: 0.1 }
    );

    const trigger = document.getElementById('infinite-scroll-trigger');
    if (trigger) observer.observe(trigger);

    return () => {
      if (trigger) observer.unobserve(trigger);
    };
  }, [hasMore, loading, page, selectedCategory]);

  const featuredItem = news.length > 0 ? news[0] : null;
  const trendingItems = news.slice(1, 6);
  const otherItems = news.slice(6);

  const [isFavFeatured, setIsFavFeatured] = useState(false);
  const [isLikingFeatured, setIsLikingFeatured] = useState(false);

  useEffect(() => {
    if (featuredItem) {
        setIsFavFeatured(featuredItem.is_favourite || false);
    }
  }, [featuredItem]);

  const handleToggleLikeFeatured = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!featuredItem) return;
    
    const token = localStorage.getItem('auth_token');
    if (!token) {
      alert('Vui lòng đăng nhập để thực hiện tính năng này');
      return;
    }

    if (isLikingFeatured) return;

    try {
        setIsLikingFeatured(true);
        const response = await axios.post(`${API_BASE_URL}/index.php?module=api&action=favorites`, {
            news_id: featuredItem.id,
            token: token,
            action_type: 'toggle'
        });

        if (response.data.status === 'success') {
            const isAdded = response.data.action === 'added';
            setIsFavFeatured(isAdded);
            setNews(prev => prev.map((n, idx) => 
                idx === 0 ? { ...n, is_favourite: isAdded } : n
            ));
        }
    } catch (error) {
        console.error('Error toggling favorite:', error);
    } finally {
        setIsLikingFeatured(false);
    }
  };

  const handleCommentFeatured = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (featuredItem) {
        navigate(`/article/${featuredItem.id}#comments`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 pb-20">
      <div className="flex items-center gap-4 py-8 overflow-x-auto no-scrollbar mb-8 border-b border-slate-50">
        {categories.map((cat) => (
          <VButton
            key={cat.id}
            variant={selectedCategory === cat.id ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setSelectedCategory(cat.id)}
            className="whitespace-nowrap"
          >
            {cat.name}
          </VButton>
        ))}
      </div>
 
      {currentKeyword ? (
        <div className="mb-16">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
              <Search size={24} />
            </div>
            <div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">Kết quả tìm kiếm</h2>
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-1">Tìm thấy {news.length} bài viết cho "{currentKeyword}"</p>
            </div>
          </div>
          
          {news.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {news.map(item => (
                    <NewsCard key={item.id} item={item} />
                ))}
            </div>
          ) : (
            <div className="py-20 text-center bg-white rounded-[3rem] border border-slate-100 shadow-xl">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-200">
                    <Search size={40} />
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-2">Không tìm thấy kết quả</h3>
                <p className="text-slate-400 font-medium">Thử lại với từ khóa khác nhé!</p>
            </div>
          )}
        </div>
      ) : (
        <>
          {featuredItem && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => navigate(`/article/${featuredItem.id}`)}
                className="lg:col-span-8 group relative aspect-[16/9] md:aspect-[21/9] lg:aspect-auto lg:h-[500px] rounded-[2rem] overflow-hidden bg-slate-900 border border-slate-100 shadow-2xl cursor-pointer"
              >
                <img 
                  src={featuredItem.image || 'https://images.unsplash.com/photo-1504711434969-e33886168f5a?q=80&w=2070&auto=format&fit=crop'} 
                  alt={featuredItem.title}
                  className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:scale-105 transition-transform duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent"></div>
                
                <div className="absolute top-6 right-6 flex flex-col gap-3 z-10">
                    <VButton
                      variant={isFavFeatured ? 'primary' : 'outline'}
                      icon={Heart}
                      onClick={handleToggleLikeFeatured}
                      loading={isLikingFeatured}
                      className={`w-12 h-12 rounded-full p-0 flex items-center justify-center backdrop-blur-md ${isFavFeatured ? 'bg-red-500 border-red-500' : 'bg-white/90 border-white/40'}`}
                    />
                    <VButton
                      variant="outline"
                      icon={MessageCircle}
                      onClick={handleCommentFeatured}
                      className="w-12 h-12 rounded-full p-0 flex items-center justify-center backdrop-blur-md bg-white/90 border-white/40"
                    />
                    <VButton
                      variant="outline"
                      icon={Share2}
                      onClick={(e) => {
                          e.stopPropagation();
                          if (navigator.share) {
                              navigator.share({ title: featuredItem.title, url: featuredItem.link });
                          } else {
                              navigator.clipboard.writeText(featuredItem.link);
                              alert('Đã sao chép liên kết!');
                          }
                      }}
                      className="w-12 h-12 rounded-full p-0 flex items-center justify-center backdrop-blur-md bg-white/90 border-white/40"
                    />
                </div>

                <div className="absolute bottom-0 left-0 p-8 md:p-12 w-full max-w-3xl">
                    <span className="inline-block px-3 py-1 bg-blue-600 rounded-lg text-white text-[10px] font-black uppercase tracking-widest mb-6">
                        TIÊU ĐIỂM
                    </span>
                    <h3 className="text-2xl md:text-4xl font-black text-white leading-tight mb-4 group-hover:text-blue-400 transition-colors">
                        {featuredItem.title}
                    </h3>
                </div>
              </motion.div>
              <div className="lg:col-span-4 flex flex-col">
                <div className="flex items-center justify-between mb-8">
                    <h3 className="font-black text-slate-900 uppercase tracking-widest">Trending</h3>
                    <div className="h-1 flex-1 bg-slate-100 ml-4 rounded-full"></div>
                </div>
                <div className="space-y-6">
                    {trendingItems.map((item, idx) => (
                        <div 
                        key={item.id} 
                        className="flex gap-4 group cursor-pointer"
                        onClick={() => navigate(`/article/${item.id}`)}
                        >
                            <span className="text-3xl font-black text-slate-100 group-hover:text-blue-600/10 transition-colors leading-none pt-1">
                                0{idx + 1}
                            </span>
                            <div className="flex-1">
                                <CategoryBadge name={item.category} showIcon={false} className="mb-2" />
                                <h4 className="font-bold text-slate-800 line-clamp-2 group-hover:text-blue-600 transition-colors leading-snug">
                                    {item.title}
                                </h4>
                            </div>
                        </div>
                    ))}
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between mb-10">
            <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase flex items-center gap-3">
              <div className="w-2 h-8 bg-blue-600 rounded-full"></div>
              {selectedCategory ? categories.find(c => c.id === selectedCategory)?.name : 'TIN MỚI NHẤT'}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {(selectedCategory ? news : otherItems).map((item) => (
              <NewsCard key={item.id} item={item} />
            ))}
          </div>
        </>
      )}

      {loading && (
        <div className="flex flex-col items-center justify-center py-20">
           <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4 opacity-20" />
        </div>
      )}

      <div id="infinite-scroll-trigger" className="h-20 flex items-center justify-center mt-12">
        {hasMore && (
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Đang tải thêm tin tức...</p>
          </div>
        )}
        {!hasMore && news.length > 0 && (
          <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">Bạn đã xem hết tin tức hôm nay</p>
        )}
      </div>
    </div>
  );
};

export default Home;
