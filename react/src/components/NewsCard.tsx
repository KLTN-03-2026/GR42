import React, { useState } from 'react';
import { Heart, Share2, ArrowRight, MessageCircle, Clock, ExternalLink } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../config';

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
      const host = window.location.hostname === 'localhost' ? API_BASE_URL.replace('/BE', '') : '';
      const response = await axios.post(`${host}/BE/modules/api/favorites.php`, {
        news_id: item.id,
        token: token,
        action: 'toggle'
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

  const handleExternalLink = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    window.open(item.link, '_blank');
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
        
        {/* Interaction Buttons for Featured */}
        <div className="absolute top-6 right-6 flex flex-col gap-3 z-10">
          <button 
            onClick={handleToggleLike}
            disabled={isLiking}
            className={`w-11 h-11 rounded-full flex items-center justify-center backdrop-blur-md border border-white/20 transition-all active:scale-90 ${isFav ? 'bg-red-500 text-white' : 'bg-white/10 text-white hover:bg-white/20'}`}
          >
            <Heart size={20} className={isFav ? 'fill-current' : ''} />
          </button>
          <button 
            onClick={handleCommentClick}
            className="w-11 h-11 rounded-full flex items-center justify-center backdrop-blur-md bg-white/10 text-white border border-white/20 hover:bg-white/20 transition-all active:scale-90"
          >
            <MessageCircle size={20} />
          </button>
        </div>

        <div className="absolute bottom-0 left-0 p-8 w-full pr-20">
            <span className="inline-block px-2 py-1 bg-blue-600 rounded-lg text-white text-[9px] font-black uppercase tracking-widest mb-3">
                {item.category}
            </span>
            <h3 className="text-xl font-bold text-white mb-2 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors">
                <Link to={`/article/${item.id}`}>{item.title}</Link>
            </h3>
            <div className="flex items-center justify-between">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{item.source} • {item.pubDate}</p>
              <button 
                onClick={handleExternalLink}
                className="text-white/40 hover:text-blue-400 transition-colors"
                title="Xem nguồn gốc"
              >
                <ExternalLink size={14} />
              </button>
            </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full group bg-transparent">
      <div className="relative aspect-[16/10] rounded-[2rem] overflow-hidden mb-6 bg-slate-100 border border-slate-50 shadow-sm group-hover:shadow-xl transition-all duration-500">
        <img 
          src={item.image || 'https://images.unsplash.com/photo-1504711434969-e33886168f5a?q=80&w=2070&auto=format&fit=crop'} 
          alt={item.title} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
        />
        
        {/* Interaction Buttons Overlay */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
          <button 
            onClick={handleToggleLike}
            disabled={isLiking}
            className={`w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md border border-white/40 transition-all shadow-lg active:scale-90 ${isFav ? 'bg-red-500 text-white border-red-400' : 'bg-white/80 text-slate-400 hover:text-blue-600 hover:bg-white'}`}
          >
            <Heart size={18} className={isFav ? 'fill-current' : ''} />
          </button>
          <button 
            onClick={handleCommentClick}
            className="w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md bg-white/80 text-slate-400 border border-white/40 hover:text-blue-600 hover:bg-white transition-all shadow-lg active:scale-90"
          >
            <MessageCircle size={18} />
          </button>
          <button 
            onClick={handleExternalLink}
            className="w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md bg-white/80 text-slate-400 border border-white/40 hover:text-blue-600 hover:bg-white transition-all shadow-lg active:scale-90"
            title="Xem nguồn gốc"
          >
            <ExternalLink size={18} />
          </button>
        </div>

        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
            <Link to={`/article/${item.id}`} className="p-4 bg-white/90 backdrop-blur-md rounded-full text-slate-900 shadow-2xl hover:bg-blue-600 hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0">
                <ArrowRight size={24} />
            </Link>
        </div>

        <div className="absolute top-4 left-4">
            <span className="px-3 py-1 bg-white/90 backdrop-blur-md rounded-xl text-[9px] font-black text-blue-600 uppercase shadow-sm border border-white">
                {item.category}
            </span>
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
          <Link to={`/article/${item.id}`}>
            {item.title}
          </Link>
        </h3>

        <div className="mt-auto pt-4 flex items-center justify-between w-full border-t border-slate-100">
           <div className="flex items-center gap-2">
                <button className="p-2 -ml-2 text-slate-300 hover:text-blue-600 transition-colors">
                    <Share2 size={16} />
                </button>
           </div>
           <Link 
            to={`/article/${item.id}`} 
            className="text-[10px] font-black text-slate-400 hover:text-blue-600 uppercase tracking-[0.2em] transition-colors flex items-center gap-1"
           >
              Đọc ngay
              <ArrowRight size={12} />
           </Link>
        </div>
      </div>
    </div>
  );
};

export default NewsCard;
