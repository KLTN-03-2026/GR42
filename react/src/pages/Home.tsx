import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Search, Heart, MessageCircle, Share2, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { API_BASE_URL } from '../config';
import VButton from '../components/VButton';
import NewsCard, { NewsItem } from '../components/NewsCard';
import { CategoryBadge } from '../components/CategoryUI';
import { encodeId } from '../utils/idEncoder';

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

const normalizeImageUrl = (url: string | undefined) => {
    if (!url) return 'https://images.unsplash.com/photo-1504711434969-e33886168f5a?q=80&w=2070&auto=format&fit=crop';
    if (url.startsWith('//')) return `https:${url}`;
    if (url.startsWith('/')) return `${API_BASE_URL.replace('/BE', '')}${url}`;
    return url;
};

const Home = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const currentKeyword = searchParams.get('keyword') || '';
  
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchNews = useCallback(async (pageNum = 1, category = '', reset = false) => {
    try {
      const token = localStorage.getItem('auth_token');
      if (reset) setLoading(true);
      const host = window.location.hostname === 'localhost' ? API_BASE_URL.replace('/BE', '') : '';
      const response = await axios.get(`${host}/BE/index.php`, {
        params: {
          module: 'api',
          action: 'news_load',
          page: pageNum,
          category: category,
          keyword: currentKeyword,
          perPage: 12,
          token: token
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
  }, [currentKeyword]);

  useEffect(() => {
    fetchNews(1, selectedCategory, true);
    setPage(1);
    window.scrollTo(0, 0);
  }, [selectedCategory, currentKeyword, fetchNews]);

  const handleLoadMore = useCallback(() => {
    if (loading || !hasMore) return;
    const nextPage = page + 1;
    setPage(nextPage);
    fetchNews(nextPage, selectedCategory);
  }, [loading, hasMore, page, fetchNews, selectedCategory]);

  const observerTarget = useRef(null);

  useEffect(() => {
    if (!hasMore || loading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          handleLoadMore();
        }
      },
      { threshold: 0.5, rootMargin: '100px' }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasMore, loading, page, selectedCategory]);

  const [activeFeaturedIndex, setActiveFeaturedIndex] = useState(0);
  const featuredItems = news.slice(0, 5);
  const trendingItems = news.slice(featuredItems.length, featuredItems.length + 5);
  const otherItems = news.slice(featuredItems.length + 5);
  const featuredItem = featuredItems[activeFeaturedIndex];

  const mainNewsItems = selectedCategory ? news : otherItems;
  const withImage = mainNewsItems.filter(item => item.image && !item.image.includes('placeholder') && item.image !== '');
  const withoutImage = mainNewsItems.filter(item => !item.image || item.image.includes('placeholder') || item.image === '');

  useEffect(() => {
    if (featuredItems.length <= 1) return;
    
    const timer = setInterval(() => {
        setActiveFeaturedIndex((prev) => (prev + 1) % featuredItems.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [featuredItems.length]);

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
        const host = window.location.hostname === 'localhost' ? API_BASE_URL.replace('/BE', '') : '';
        const response = await axios.post(`${host}/BE/index.php?module=api&action=favorites`, {
            news_id: featuredItem.id,
            token: token,
            action_type: 'toggle'
        });

        if (response.data.status === 'success') {
            const isAdded = response.data.action === 'added';
            setIsFavFeatured(isAdded);
            setNews(prev => prev.map(n => 
                n.id === featuredItem.id ? { ...n, is_favourite: isAdded } : n
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
              <div className="lg:col-span-8 group relative aspect-[16/9] md:aspect-[21/9] lg:aspect-auto lg:h-[500px] rounded-[3rem] overflow-hidden bg-slate-900 border border-slate-100 shadow-2xl">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={featuredItem.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0 cursor-pointer"
                    onClick={() => navigate(`/article/${encodeId(featuredItem.id)}`)}
                  >
                    <img 
                      src={featuredItem.image || 'https://images.unsplash.com/photo-1504711434969-e33886168f5a?q=80&w=2070&auto=format&fit=crop'} 
                      alt={featuredItem.title}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent"></div>
                    
                    <div className="absolute bottom-0 left-0 p-8 md:p-12 w-full max-w-3xl">
                        <motion.span 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                          className="inline-block px-3 py-1 bg-blue-600 rounded-lg text-white text-[10px] font-black uppercase tracking-widest mb-6"
                        >
                            TIÊU ĐIỂM
                        </motion.span>
                        <motion.h3 
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                          className="text-2xl md:text-4xl font-black text-white leading-tight mb-4 group-hover:text-blue-400 transition-colors"
                        >
                            {featuredItem.title}
                        </motion.h3>
                    </div>
                  </motion.div>
                </AnimatePresence>

                <div className="absolute bottom-10 right-10 flex items-center gap-4 z-20">
                    <div className="flex gap-2 mr-4">
                        {featuredItems.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={(e) => { e.stopPropagation(); setActiveFeaturedIndex(idx); }}
                                className={`w-2 h-2 rounded-full transition-all duration-300 ${activeFeaturedIndex === idx ? 'w-8 bg-blue-500' : 'bg-white/30 hover:bg-white/50'}`}
                            />
                        ))}
                    </div>
                    <div className="flex gap-2">
                        <VButton
                            variant="dark"
                            size="sm"
                            className="w-10 h-10 rounded-full p-0 flex items-center justify-center backdrop-blur-md bg-white/10 border-white/20 text-white hover:bg-white/20"
                            onClick={(e) => {
                                e.stopPropagation();
                                setActiveFeaturedIndex((prev) => (prev - 1 + featuredItems.length) % featuredItems.length);
                            }}
                        >
                            <ChevronLeft size={20} />
                        </VButton>
                        <VButton
                            variant="dark"
                            size="sm"
                            className="w-10 h-10 rounded-full p-0 flex items-center justify-center backdrop-blur-md bg-white/10 border-white/20 text-white hover:bg-white/20"
                            onClick={(e) => {
                                e.stopPropagation();
                                setActiveFeaturedIndex((prev) => (prev + 1) % featuredItems.length);
                            }}
                        >
                            <ChevronRight size={20} />
                        </VButton>
                    </div>
                </div>
                
                <div className="absolute top-6 right-6 flex flex-col gap-4 z-10">
                    <VButton
                      variant="dark"
                      onClick={handleToggleLikeFeatured}
                      loading={isLikingFeatured}
                      className={`w-12 h-12 rounded-full p-0 flex items-center justify-center backdrop-blur-md transition-all ${isFavFeatured ? 'bg-red-500 border-red-500 text-white' : 'bg-slate-900/80 border-slate-700/50 text-white'}`}
                    >
                        <Heart size={22} fill={isFavFeatured ? 'currentColor' : 'none'} className="transition-transform duration-300 group-hover:scale-110" />
                    </VButton>
                    <VButton
                      variant="dark"
                      onClick={handleCommentFeatured}
                      icon={MessageCircle}
                      iconSize={22}
                      className="w-12 h-12 rounded-full p-0 flex items-center justify-center backdrop-blur-md bg-slate-900/80 border-slate-700/50 text-white"
                    />
                    <VButton
                      variant="dark"
                      onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          if (featuredItem && navigator.share) {
                              navigator.share({ title: featuredItem.title, url: featuredItem.link });
                          } else if (featuredItem) {
                              navigator.clipboard.writeText(featuredItem.link);
                              alert('Đã sao chép liên kết!');
                          }
                      }}
                      icon={Share2}
                      iconSize={22}
                      className="w-12 h-12 rounded-full p-0 flex items-center justify-center backdrop-blur-md bg-slate-900/80 border-slate-700/50 text-white"
                    />
                </div>
              </div>
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
                        onClick={() => navigate(`/article/${encodeId(item.id)}`)}
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

          <div className={`grid grid-cols-1 ${withoutImage.length > 0 ? 'lg:grid-cols-12' : 'lg:grid-cols-1'} gap-12`}>
            <div className={withoutImage.length > 0 ? 'lg:col-span-8' : 'lg:col-span-12'}>
              <div className={`grid grid-cols-1 sm:grid-cols-2 ${withoutImage.length === 0 ? 'lg:grid-cols-3 xl:grid-cols-4' : ''} gap-10`}>
                {withImage.map((item) => (
                  <NewsCard key={item.id} item={item} />
                ))}
              </div>
            </div>
            
            {withoutImage.length > 0 && (
              <div className="lg:col-span-4">
                <div className="sticky top-24 space-y-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-1.5 h-6 bg-slate-900 rounded-full"></div>
                    <h3 className="font-black text-slate-900 uppercase tracking-widest text-sm">Tin nhanh</h3>
                  </div>
                  <div className="space-y-8">
                    {withoutImage.map((item, idx) => (
                      <div 
                        key={item.id} 
                        className="group cursor-pointer border-b border-slate-50 pb-8 last:border-0 hover:bg-slate-50/50 -mx-4 px-4 rounded-2xl transition-all"
                        onClick={() => navigate(`/article/${encodeId(item.id)}`)}
                      >
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center justify-between">
                            <CategoryBadge name={item.category} showIcon={false} />
                            <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">{item.pubDate}</span>
                          </div>
                          <h4 className="font-bold text-slate-800 line-clamp-3 group-hover:text-blue-600 transition-colors leading-relaxed">
                            {item.title}
                          </h4>
                          <div className="flex items-center gap-4 mt-2">
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">{item.source}</span>
                            <div className="w-1 h-1 bg-slate-200 rounded-full"></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {loading && (
        <div className="flex flex-col items-center justify-center py-20">
           <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4 opacity-20" />
        </div>
      )}

      <div className="flex flex-col items-center justify-center mt-12 pb-20">
        {hasMore ? (
          <div className="w-full flex flex-col items-center gap-6">
            <div ref={observerTarget} className="h-10 w-full flex items-center justify-center">
                {loading && (
                    <div className="flex flex-col items-center gap-2">
                        <Loader2 className="w-8 h-8 text-blue-600 animate-spin opacity-40" />
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Đang tự động tải thêm...</p>
                    </div>
                )}
            </div>
            
            {!loading && (
                <VButton
                    variant="ghost"
                    onClick={handleLoadMore}
                    className="px-10 py-4 rounded-2xl bg-white border border-slate-100 hover:border-blue-100 transition-all group"
                >
                    <div className="flex flex-col items-center gap-1">
                        <span className="text-sm font-black text-slate-900 uppercase tracking-widest group-hover:text-blue-600">Tải thêm bài viết</span>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Bấm nếu không tự động tải</p>
                    </div>
                </VButton>
            )}
          </div>
        ) : (
          news.length > 0 && (
            <div className="flex flex-col items-center gap-4 py-10 opacity-50">
                <div className="w-12 h-1 bg-slate-200 rounded-full mb-2"></div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Bạn đã xem hết tin tức hôm nay</p>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default Home;
