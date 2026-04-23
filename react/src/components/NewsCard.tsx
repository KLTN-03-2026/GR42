import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Heart, Share2, ArrowRight, MessageCircle, Clock } from 'lucide-react';
import { API_BASE_URL } from '../config';
import VButton from '../components/VButton';
import { CategoryBadge } from '../components/CategoryUI';

export interface NewsItem {
  id: number;
  title: string;
  source: string;
  pubDate: string;
  image?: string;
  category: string;
  link: string;
  is_favourite?: boolean;
}

interface NewsCardProps {
  item: NewsItem;
  featured?: boolean;
}

const NewsCard: React.FC<NewsCardProps> = ({ item, featured = false }) => {
  const navigate = useNavigate();
  const [isFav, setIsFav] = useState(item.is_favourite);
  const [isLiking, setIsLiking] = useState(false);

  const handleToggleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const token = localStorage.getItem('auth_token');
    if (!token) {
      alert('Vui lòng đăng nhập để thực hiện tính năng này');
      return;
    }

    if (isLiking) return;

    try {
      setIsLiking(true);
      const response = await axios.post(`${API_BASE_URL}/index.php?module=api&action=favorites`, {
        news_id: item.id,
        token: token,
        action_type: 'toggle'
      });

      if (response.data.status === 'success') {
        setIsFav(response.data.action === 'added');
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    } finally {
      setIsLiking(false);
    }
  };

  const handleCommentClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/article/${item.id}#comments`);
  };

  if (featured) {
    return (
      <div className="group relative aspect-[16/10] rounded-[2rem] overflow-hidden bg-slate-900 border border-slate-100 shadow-xl">
        <img 
          src={item.image || 'https://images.unsplash.com/photo-1504711434969-e33886168f5a?q=80&w=2070&auto=format&fit=crop'} 
          alt={item.title}
          className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 to-transparent"></div>
        
        <div className="absolute top-6 right-6 flex flex-col gap-3 z-10">
          <VButton 
            variant={isFav ? 'primary' : 'outline'}
            onClick={handleToggleLike}
            loading={isLiking}
            icon={Heart}
            iconSize={22}
            className={`w-11 h-11 rounded-full p-0 flex items-center justify-center backdrop-blur-md ${isFav ? 'bg-red-500 border-red-500 text-white' : 'bg-white/10 border-white/20 text-white'}`}
          />
          <VButton 
            variant="outline"
            onClick={handleCommentClick}
            icon={MessageCircle}
            iconSize={22}
            className="w-11 h-11 rounded-full p-0 flex items-center justify-center backdrop-blur-md bg-white/10 border-white/20 text-white"
          />
        </div>

        <div className="absolute bottom-0 left-0 p-8 w-full pr-20">
            <CategoryBadge name={item.category} className="mb-3" />
            <h3 className="text-xl font-bold text-white mb-2 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors">
                <Link to={`/article/${item.id}`}>{item.title}</Link>
            </h3>
            <div className="flex items-center justify-between">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{item.source} • {item.pubDate}</p>
              <VButton 
                variant="ghost" size="sm" icon={Share2}
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (navigator.share) {
                        navigator.share({ title: item.title, url: item.link });
                    } else {
                        navigator.clipboard.writeText(item.link);
                        alert('Đã sao chép liên kết!');
                    }
                }}
                className="text-white/40 p-0"
                title="Chia sẻ"
              />
            </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="flex flex-col h-full group bg-transparent cursor-pointer"
      onClick={() => navigate(`/article/${item.id}`)}
    >
      <div className="relative aspect-[16/10] rounded-[2rem] overflow-hidden mb-6 bg-slate-100 border border-slate-50 shadow-sm group-hover:shadow-xl transition-all duration-500">
        <img 
          src={item.image || 'https://images.unsplash.com/photo-1504711434969-e33886168f5a?q=80&w=2070&auto=format&fit=crop'} 
          alt={item.title} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
        />
        
        <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
          <VButton 
            variant={isFav ? 'primary' : 'outline'}
            onClick={handleToggleLike}
            loading={isLiking}
            icon={Heart}
            iconSize={20}
            className={`w-10 h-10 rounded-full p-0 flex items-center justify-center backdrop-blur-md ${isFav ? 'bg-red-500 border-red-500 shadow-xl shadow-red-200 text-white' : 'bg-white/80 border-white/40 shadow-lg text-slate-800'}`}
          />
          <VButton 
            variant="outline"
            onClick={handleCommentClick}
            icon={MessageCircle}
            iconSize={20}
            className="w-10 h-10 rounded-full p-0 flex items-center justify-center backdrop-blur-md bg-white/80 border-white/40 shadow-lg text-slate-800"
          />
          <VButton 
            variant="outline"
            onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                const shareData = { title: item.title, url: item.link };
                if (navigator.share) {
                    navigator.share(shareData).catch(() => {
                        navigator.clipboard.writeText(item.link);
                        alert('🚀 Đã sao chép liên kết!');
                    });
                } else {
                    navigator.clipboard.writeText(item.link);
                    alert('🚀 Đã sao chép liên kết!');
                }
            }}
            icon={Share2}
            iconSize={20}
            className="w-10 h-10 rounded-full p-0 flex items-center justify-center backdrop-blur-md bg-white/80 border-white/40 shadow-lg text-slate-800"
            title="Chia sẻ"
          />
        </div>

        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
            <div className="p-4 bg-white/90 backdrop-blur-md rounded-full text-slate-900 shadow-2xl hover:bg-blue-600 hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0">
                <ArrowRight size={24} />
            </div>
        </div>

        <div className="absolute top-4 left-4">
            <CategoryBadge name={item.category} className="bg-white/90 backdrop-blur-md shadow-sm border-white" />
        </div>
      </div>

      <div className="flex-1 flex flex-col items-start px-2">
        <div className="flex items-center gap-3 mb-3 text-slate-400">
            <span className="text-[10px] font-black uppercase tracking-[0.1em]">{item.source}</span>
            <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
            <div className="flex items-center gap-1.5 text-[10px] font-bold">
                <Clock size={12} className="text-slate-300" />
                {item.pubDate}
            </div>
        </div>
        
        <h3 className="font-black text-lg text-slate-800 mb-4 line-clamp-2 leading-[1.3] group-hover:text-blue-600 transition-colors tracking-tight">
            {item.title}
        </h3>

        <div className="mt-auto pt-4 flex items-center justify-between w-full border-t border-slate-100">
        </div>
      </div>
    </div>
  );
};

export default NewsCard;
